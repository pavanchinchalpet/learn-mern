const supabase = require('../config/supabase');

// Helper functions for Supabase operations

// User operations
const userHelpers = {
  // Create user profile after Supabase auth signup
  createUserProfile: async (userId, userData) => {
    // Use service role client to bypass RLS policies
    const serviceClient = supabase.getServiceClient();
    
    if (!serviceClient) {
      console.log('🔴 [USER HELPERS] Service client not available');
      return { data: null, error: { message: 'Service client not available' } };
    }

    console.log('🔵 [USER HELPERS] Creating user profile with service client...');
    
    const { data, error } = await serviceClient
      .from('users')
      .insert({
        id: userId,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar || 'default',
        points: 0,
        level: 1,
        streak: 0,
        is_admin: userData.is_admin || false,
        total_quizzes: 0,
        correct_answers: 0,
        total_answers: 0
      })
      .select()
      .single();
    
    if (error) {
      console.log('🔴 [USER HELPERS] Profile creation error:', error);
    } else {
      console.log('✅ [USER HELPERS] Profile created successfully');
    }
    
    return { data, error };
  },

  // Get user by email or username
  getUserByEmailOrUsername: async (email, username) => {
    // Use service client to bypass RLS policies
    const serviceClient = supabase.getServiceClient();
    
    if (!serviceClient) {
      console.log('🔴 [USER HELPERS] Service client not available for getUserByEmailOrUsername');
      return { data: null, error: { message: 'Service client not available' } };
    }

    console.log('🔵 [USER HELPERS] Getting user by email/username with service client...');
    
    const { data, error } = await serviceClient
      .from('users')
      .select('*')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();
    
    if (error) {
      console.log('🔴 [USER HELPERS] getUserByEmailOrUsername error:', error);
    } else {
      console.log('✅ [USER HELPERS] User found:', data?.username);
    }
    
    return { data, error };
  },

  // Get user by ID
  getUserById: async (userId) => {
    // Use service client to bypass RLS policies
    const serviceClient = supabase.getServiceClient();
    
    if (!serviceClient) {
      console.log('🔴 [USER HELPERS] Service client not available for getUserById');
      return { data: null, error: { message: 'Service client not available' } };
    }

    console.log('🔵 [USER HELPERS] Getting user by ID with service client...');
    
    const { data, error } = await serviceClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.log('🔴 [USER HELPERS] getUserById error:', error);
    } else {
      console.log('✅ [USER HELPERS] User found by ID:', data?.username);
    }
    
    return { data, error };
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, points, level, avatar')
      .order('points', { ascending: false })
      .limit(limit);
    
    return { data, error };
  }
};

// Quiz operations
const quizHelpers = {
  // Get all quizzes
  getAllQuizzes: async (filters = {}) => {
    // Prefer service client to bypass RLS for public data
    const client = supabase.getServiceClient() || supabase;
    let query = client
      .from('quizzes')
      .select(`
        *,
        quiz_category:quiz_categories(
          id,
          name,
          description,
          icon,
          color
        )
      `)
      .eq('is_active', true);

    if (filters.category) {
      // Support both category name and category_id
      if (filters.category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // It's a UUID, treat as category_id
        query = query.eq('category_id', filters.category);
      } else {
        // It's a category name, join with quiz_categories
        query = query.eq('quiz_category.name', filters.category);
      }
    }
    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get quiz by ID
  getQuizById: async (quizId) => {
    const client = supabase.getServiceClient() || supabase;
    const { data, error } = await client
      .from('quizzes')
      .select(`
        *,
        quiz_category:quiz_categories(
          id,
          name,
          description,
          icon,
          color
        )
      `)
      .eq('id', quizId)
      .single();
    
    return { data, error };
  },

  // Get quiz questions by quiz ID
  getQuizQuestions: async (quizId) => {
    const client = supabase.getServiceClient() || supabase;
    
    console.log('🔵 [QUIZ HELPERS] Getting questions for quiz:', quizId);
    
    // Get the quiz to find its category
    const { data: quiz, error: quizError } = await client
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();
    
    if (quizError || !quiz) {
      console.log('🔴 [QUIZ HELPERS] Quiz not found:', quizError);
      return { data: [], error: quizError };
    }
    
    console.log('✅ [QUIZ HELPERS] Found quiz:', quiz.title, 'Category:', quiz.category_id);
    
    // Get all quizzes from the same category to use as questions
    const { data: categoryQuizzes, error: categoryError } = await client
      .from('quizzes')
      .select('*')
      .eq('category_id', quiz.category_id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    
    if (categoryError) {
      console.log('🔴 [QUIZ HELPERS] Error getting category quizzes:', categoryError);
      return { data: [], error: categoryError };
    }
    
    console.log('✅ [QUIZ HELPERS] Found', categoryQuizzes.length, 'questions in category');
    
    // Transform quizzes to question format
    const questions = categoryQuizzes.map(q => {
      // Handle different answer field names
      let correctAnswer = 0;
      if (q.correct_answer !== undefined) {
        correctAnswer = q.correct_answer;
      } else if (q.answer !== undefined) {
        // If answer is a string, find its index in options
        if (typeof q.answer === 'string') {
          correctAnswer = q.options.findIndex(option => option === q.answer);
          if (correctAnswer === -1) correctAnswer = 0;
        } else {
          correctAnswer = q.answer;
        }
      }
      
      return {
        id: q.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: correctAnswer,
        explanation: q.explanation,
        points: q.points || 10,
        quiz_id: q.id
      };
    });
    
    console.log('✅ [QUIZ HELPERS] Transformed', questions.length, 'questions');
    return { data: questions, error: null };
  },

  // Get quiz categories
  getQuizCategories: async () => {
    // Prefer service client to bypass RLS
    const client = supabase.getServiceClient() || supabase;

    // Get categories from quiz_categories table
    const { data: catTable, error: catErr } = await client
      .from('quiz_categories')
      .select('id, name, description, icon, color, created_at');

    if (!catErr && Array.isArray(catTable) && catTable.length > 0) {
      // Fetch quiz counts grouped by category_id
      const { data: quizzes, error: quizErr } = await client
        .from('quizzes')
        .select('category_id, is_active')
        .eq('is_active', true);

      const counts = {};
      if (!quizErr && Array.isArray(quizzes)) {
        quizzes.forEach(q => {
          const key = q.category_id;
          counts[key] = (counts[key] || 0) + 1;
        });
      }

      const result = catTable.map(ct => ({
        id: ct.id,
        name: ct.name,
        description: ct.description,
        icon: ct.icon,
        color: ct.color,
        count: counts[ct.id] || 0
      }));

      return { data: result, error: null };
    }

    // Fallback: derive categories from quizzes table (if no quiz_categories data)
    const { data, error } = await client
      .from('quizzes')
      .select('category_id, difficulty')
      .eq('is_active', true);
    
    if (error) return { data: [], error };
    
    const categories = {};
    data.forEach(quiz => {
      if (!categories[quiz.category_id]) {
        categories[quiz.category_id] = {
          id: quiz.category_id,
          name: quiz.category_id, // Use ID as name fallback
          count: 0,
          difficulties: new Set()
        };
      }
      categories[quiz.category_id].count++;
      categories[quiz.category_id].difficulties.add(quiz.difficulty);
    });
    
    const result = Object.values(categories).map(cat => ({
      id: cat.id,
      name: cat.name,
      count: cat.count,
      difficulty: Array.from(cat.difficulties)[0]
    }));
    
    return { data: result, error: null };
  },

  // Submit quiz answers
  submitQuizAnswers: async (userId, answers, timeTaken) => {
    try {
      console.log('🔵 [SUBMIT QUIZ] Starting submission for user:', userId);
      console.log('🔵 [SUBMIT QUIZ] Answers:', answers.length);
      console.log('🔵 [SUBMIT QUIZ] Time taken:', timeTaken);
      
      const { data: quizzes, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .in('id', answers.map(a => a.questionId));
      
      if (quizError) {
        console.error('🔴 [SUBMIT QUIZ] Error fetching quizzes:', quizError);
        return { data: null, error: quizError };
      }
      
      console.log('🔵 [SUBMIT QUIZ] Found quizzes:', quizzes.length);
    
    let correctAnswers = 0;
    let totalQuestions = answers.length;
    let streak = 0;
    let maxStreak = 0;
    let pointsEarned = 0;
    
    const review = answers.map(answer => {
      const quiz = quizzes.find(q => q.id === answer.questionId);
      const isCorrect = quiz && quiz.answer === answer.selectedAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        streak++;
        maxStreak = Math.max(maxStreak, streak);
        pointsEarned += quiz.points || 10;
      } else {
        streak = 0;
      }
      
      return {
        questionId: answer.questionId,
        question: quiz?.question_text || '',
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: quiz?.answer || '',
        isCorrect,
        options: quiz?.options || [],
        explanation: quiz?.explanation || ''
      };
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Save quiz score - fix the quiz_id issue
    const { data: scoreData, error: scoreError } = await supabase
      .from('quiz_scores')
      .insert({
        user_id: userId,
        quiz_id: null, // Set to null since we're submitting multiple questions
        score,
        time_taken: timeTaken,
        answers: answers,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        streak: maxStreak,
        points_earned: pointsEarned
      })
      .select()
      .single();
    
    if (scoreError) {
      console.error('🔴 [SUBMIT QUIZ] Error saving score:', scoreError);
      return { data: null, error: scoreError };
    }
    
    console.log('✅ [SUBMIT QUIZ] Score saved successfully:', scoreData);
    
    // Get current user stats first
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('points, total_quizzes, correct_answers, total_answers')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user stats:', userError);
    } else {
      // Update user stats with calculated values
      const { error: updateError } = await supabase
        .from('users')
        .update({
          points: (currentUser.points || 0) + pointsEarned,
          total_quizzes: (currentUser.total_quizzes || 0) + 1,
          correct_answers: (currentUser.correct_answers || 0) + correctAnswers,
          total_answers: (currentUser.total_answers || 0) + totalQuestions
        })
        .eq('id', userId);
      
      if (updateError) console.error('Error updating user stats:', updateError);
    }
    
    return {
      data: {
        score,
        correctAnswers,
        totalQuestions,
        streak: maxStreak,
        pointsEarned,
        timeTaken,
        review
      },
      error: null
    };
    } catch (error) {
      console.error('🔴 [SUBMIT QUIZ] Unexpected error:', error);
      return { data: null, error: error.message || 'Unknown error' };
    }
  }
};

// Course operations
const courseHelpers = {
  // Get all courses
  getAllCourses: async (filters = {}) => {
    let query = supabase
      .from('courses')
      .select('*')
      .eq('is_published', true);

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    return { data, error };
  },

  // Get lessons by course
  getLessonsByCourse: async (courseId) => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_index');
    
    return { data, error };
  }
};

module.exports = {
  userHelpers,
  quizHelpers,
  courseHelpers
};
