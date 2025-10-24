const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get quizzes with pagination and filtering
router.get('/quizzes', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { 
      page = 1, 
      limit = 10, 
      category = '', 
      difficulty = '', 
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;

    // Check if Supabase is available
    if (!supabase) {
      console.log('⚠️ [ADMIN] Supabase not configured, returning mock data');
      const mockQuizzes = [
        {
          id: 'mock-quiz-1',
          title: 'JavaScript Basics',
          description: 'Test your JavaScript knowledge',
          category: 'JavaScript',
          difficulty: 'beginner',
          time_limit: 30,
          is_active: true,
          created_at: new Date().toISOString(),
          question_count: 5
        },
        {
          id: 'mock-quiz-2',
          title: 'Node.js Fundamentals',
          description: 'Learn Node.js concepts',
          category: 'Node.js',
          difficulty: 'intermediate',
          time_limit: 45,
          is_active: true,
          created_at: new Date().toISOString(),
          question_count: 8
        },
        {
          id: 'mock-quiz-3',
          title: 'React Components',
          description: 'Master React component patterns',
          category: 'React',
          difficulty: 'advanced',
          time_limit: 60,
          is_active: true,
          created_at: new Date().toISOString(),
          question_count: 12
        }
      ];

      // Apply filters to mock data
      let filteredQuizzes = mockQuizzes;
      if (category) {
        filteredQuizzes = filteredQuizzes.filter(q => q.category.toLowerCase() === category.toLowerCase());
      }
      if (difficulty) {
        filteredQuizzes = filteredQuizzes.filter(q => q.difficulty === difficulty);
      }
      if (search) {
        filteredQuizzes = filteredQuizzes.filter(q => 
          q.title.toLowerCase().includes(search.toLowerCase()) ||
          q.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const total = filteredQuizzes.length;
      const paginatedQuizzes = filteredQuizzes.slice(offset, offset + parseInt(limit));

      return res.json({
        quizzes: paginatedQuizzes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: offset + parseInt(limit) < total,
          hasPrev: page > 1
        }
      });
    }

    // Build query
    let query = supabase
      .from('quizzes')
      .select(`
        id,
        title,
        description,
        category,
        difficulty,
        time_limit,
        created_by,
        is_active,
        created_at,
        times_answered,
        times_correct
      `, { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: quizzes, error, count } = await query;

    if (error) {
      console.error('Error fetching quizzes:', error);
      return res.status(500).json({ error: 'Failed to fetch quizzes' });
    }

    // Add question count for each quiz (this would be optimized with a join in production)
    const quizzesWithCounts = await Promise.all(
      (quizzes || []).map(async (quiz) => {
        const { count: questionCount } = await supabase
          .from('quizzes')
          .select('id', { count: 'exact' })
          .eq('id', quiz.id);
        
        return {
          ...quiz,
          question_count: questionCount || 0
        };
      })
    );

    res.json({
      quizzes: quizzesWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + parseInt(limit) < (count || 0),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error in /quizzes route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz categories for filtering
router.get('/categories', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Check if Supabase is available
    if (!supabase) {
      console.log('⚠️ [ADMIN] Supabase not configured, returning mock categories');
      return res.json([
        { name: 'JavaScript', count: 25 },
        { name: 'Node.js', count: 15 },
        { name: 'React', count: 20 },
        { name: 'MongoDB', count: 12 },
        { name: 'Express', count: 8 },
        { name: 'MERN', count: 18 },
        { name: 'Authentication', count: 10 },
        { name: 'Performance', count: 6 },
        { name: 'Deployment', count: 7 }
      ]);
    }

    const { data: categories, error } = await supabase
      .from('quizzes')
      .select('category')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    // Count quizzes per category
    const categoryCounts = {};
    (categories || []).forEach(quiz => {
      categoryCounts[quiz.category] = (categoryCounts[quiz.category] || 0) + 1;
    });

    const result = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    res.json(result);
  } catch (error) {
    console.error('Error in /categories route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (Admin only)
router.get('/users', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Check if Supabase is available
    if (!supabase) {
      console.log('⚠️ [ADMIN] Supabase not configured, returning mock data');
      return res.json([
        {
          id: 'mock-user-1',
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johndoe',
          role: 'user',
          quizzes_taken: 5,
          average_score: 85,
          total_xp: 250,
          level: 3,
          streak_count: 7,
          created_at: new Date().toISOString()
        },
        {
          id: 'mock-user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          username: 'janesmith',
          role: 'admin',
          quizzes_taken: 12,
          average_score: 92,
          total_xp: 500,
          level: 5,
          streak_count: 15,
          created_at: new Date().toISOString()
        },
        {
          id: 'mock-user-3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          username: 'mikej',
          role: 'user',
          quizzes_taken: 3,
          average_score: 78,
          total_xp: 120,
          level: 2,
          streak_count: 3,
          created_at: new Date().toISOString()
        }
      ]);
    }

    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        created_at,
        quizzes_taken,
        average_score,
        total_xp,
        level,
        streak_count,
        username,
        points,
        streak
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json(users || []);
  } catch (error) {
    console.error('Error in /users route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new quiz (Admin only)
router.post('/quizzes', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { title, description, category, difficulty, timeLimit } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    // First, get or create quiz category
    let categoryId;
    const { data: existingCategory } = await supabase
      .from('quiz_categories')
      .select('id')
      .eq('name', category)
      .single();

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const { data: newCategory, error: categoryError } = await supabase
        .from('quiz_categories')
        .insert({
          name: category,
          description: `${category} quiz category`,
          icon: '📚',
          color: '#3b82f6'
        })
        .select()
        .single();
      
      if (categoryError) {
        console.error('Error creating category:', categoryError);
        return res.status(500).json({ error: 'Failed to create category' });
      }
      categoryId = newCategory.id;
    }

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert({
        title,
        description: description || '',
        category,
        category_id: categoryId,
        difficulty: difficulty || 'beginner',
        time_limit: timeLimit || 30,
        created_by: req.user.id,
        is_active: true,
        question_text: title, // Temporary placeholder
        options: ['', '', '', ''], // Temporary placeholder
        answer: '', // Temporary placeholder
        points: 10
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating quiz:', error);
      return res.status(500).json({ error: 'Failed to create quiz' });
    }

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error in /quizzes route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add question to quiz (Admin only)
router.post('/questions', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { question, options, correctAnswer, explanation, quizId } = req.body;

    if (!question || !options || !quizId) {
      return res.status(400).json({ error: 'Question, options, and quizId are required' });
    }

    if (options.length !== 4) {
      return res.status(400).json({ error: 'Exactly 4 options are required' });
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      return res.status(400).json({ error: 'Correct answer must be between 0 and 3' });
    }

    const { data: questionData, error } = await supabase
      .from('quiz_questions')
      .insert({
        quiz_id: quizId,
        question_text: question,
        options: options,
        correct_answer: correctAnswer,
        explanation: explanation || '',
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating question:', error);
      return res.status(500).json({ error: 'Failed to create question' });
    }

    res.status(201).json(questionData);
  } catch (error) {
    console.error('Error in /questions route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload quiz file (CSV/JSON) (Admin only)
router.post('/upload-quiz', auth, upload.single('quizFile'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let quizData;
    let questions = [];

    if (fileExtension === '.csv') {
      // Parse CSV file
      quizData = await parseCSVFile(filePath);
      questions = quizData.questions;
    } else if (fileExtension === '.json') {
      // Parse JSON file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      quizData = jsonData.quiz;
      questions = jsonData.questions || [];
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    // Create quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: quizData.title,
        description: quizData.description || '',
        category: quizData.category || 'General',
        difficulty: quizData.difficulty || 'Easy',
        time_limit: quizData.timeLimit || 30,
        created_by: req.user.id,
        is_active: true
      })
      .select()
      .single();

    if (quizError) {
      console.error('Error creating quiz from file:', quizError);
      return res.status(500).json({ error: 'Failed to create quiz from file' });
    }

    // Add questions
    if (questions.length > 0) {
      const questionsToInsert = questions.map(q => ({
        quiz_id: quiz.id,
        question_text: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || '',
        created_by: req.user.id
      }));

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert);

      if (questionsError) {
        console.error('Error creating questions from file:', questionsError);
        return res.status(500).json({ error: 'Failed to create questions from file' });
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: 'Quiz uploaded successfully',
      quiz: quiz,
      questionsAdded: questions.length
    });

  } catch (error) {
    console.error('Error in /upload-quiz route:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create quiz session (Admin only)
router.post('/quiz-sessions', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { quizId, userIds, timeLimit } = req.body;

    if (!quizId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'Quiz ID and user IDs are required' });
    }

    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Create quiz session
    const sessionData = {
      quiz_id: quizId,
      created_by: req.user.id,
      time_limit: timeLimit || quiz.time_limit,
      status: 'active',
      started_at: new Date().toISOString(),
      participants: userIds.length
    };

    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating quiz session:', sessionError);
      return res.status(500).json({ error: 'Failed to create quiz session' });
    }

    // Create session participants
    const participants = userIds.map(userId => ({
      session_id: session.id,
      user_id: userId,
      status: 'pending',
      score: 0,
      time_taken: 0
    }));

    const { error: participantsError } = await supabase
      .from('quiz_session_participants')
      .insert(participants);

    if (participantsError) {
      console.error('Error creating session participants:', participantsError);
      return res.status(500).json({ error: 'Failed to create session participants' });
    }

    res.status(201).json({
      ...session,
      quizTitle: quiz.title,
      participantCount: userIds.length,
      timeRemaining: timeLimit || quiz.time_limit
    });

  } catch (error) {
    console.error('Error in /quiz-sessions route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz sessions (Admin only)
router.get('/quiz-sessions', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Check if Supabase is available
    if (!supabase) {
      console.log('⚠️ [ADMIN] Supabase not configured, returning mock data');
      return res.json([
        {
          id: 'mock-session-1',
          quiz_id: 'mock-quiz-1',
          created_by: 'mock-user-2',
          time_limit: 30,
          status: 'active',
          started_at: new Date().toISOString(),
          participants: 5,
          quizzes: { title: 'JavaScript Basics', category: 'JavaScript' },
          quiz_session_participants: [
            { user_id: 'mock-user-1', status: 'completed', score: 85, time_taken: 1200, users: { name: 'John Doe', email: 'john@example.com' } },
            { user_id: 'mock-user-3', status: 'in_progress', score: 0, time_taken: 600, users: { name: 'Mike Johnson', email: 'mike@example.com' } }
          ]
        },
        {
          id: 'mock-session-2',
          quiz_id: 'mock-quiz-2',
          created_by: 'mock-user-2',
          time_limit: 45,
          status: 'completed',
          started_at: new Date(Date.now() - 3600000).toISOString(),
          ended_at: new Date().toISOString(),
          participants: 3,
          quizzes: { title: 'Node.js Fundamentals', category: 'Node.js' },
          quiz_session_participants: [
            { user_id: 'mock-user-1', status: 'completed', score: 92, time_taken: 1800, users: { name: 'John Doe', email: 'john@example.com' } }
          ]
        }
      ]);
    }

    const { data: sessions, error } = await supabase
      .from('quiz_sessions')
      .select(`
        *,
        quizzes(title, category),
        quiz_session_participants(
          user_id,
          status,
          score,
          time_taken,
          users(name, email)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz sessions:', error);
      return res.status(500).json({ error: 'Failed to fetch quiz sessions' });
    }

    res.json(sessions || []);
  } catch (error) {
    console.error('Error in /quiz-sessions route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz session details (Admin only)
router.get('/quiz-sessions/:sessionId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { sessionId } = req.params;

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select(`
        *,
        quizzes(title, category, time_limit),
        quiz_session_participants(
          *,
          users(name, email, username)
        )
      `)
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error fetching quiz session:', error);
      return res.status(500).json({ error: 'Failed to fetch quiz session' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error in GET /quiz-sessions/:sessionId route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update quiz session status (Admin only)
router.put('/quiz-sessions/:sessionId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { sessionId } = req.params;
    const { status, timeLimit } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (timeLimit) updateData.time_limit = timeLimit;
    
    if (status === 'completed' || status === 'cancelled') {
      updateData.ended_at = new Date().toISOString();
    }

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating quiz session:', error);
      return res.status(500).json({ error: 'Failed to update quiz session' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error in PUT /quiz-sessions/:sessionId route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// End quiz session (Admin only)
router.post('/quiz-sessions/:sessionId/end', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { sessionId } = req.params;

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error ending quiz session:', error);
      return res.status(500).json({ error: 'Failed to end quiz session' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error in POST /quiz-sessions/:sessionId/end route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get session participants (Admin only)
router.get('/quiz-sessions/:sessionId/participants', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { sessionId } = req.params;

    const { data: participants, error } = await supabase
      .from('quiz_session_participants')
      .select(`
        *,
        users(name, email, username)
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching session participants:', error);
      return res.status(500).json({ error: 'Failed to fetch session participants' });
    }

    res.json(participants || []);
  } catch (error) {
    console.error('Error in GET /quiz-sessions/:sessionId/participants route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update quiz (Admin only)
router.put('/quizzes/:quizId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { quizId } = req.params;
    const { title, description, category, difficulty, timeLimit, isActive } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (difficulty) updateData.difficulty = difficulty;
    if (timeLimit) updateData.time_limit = timeLimit;
    if (isActive !== undefined) updateData.is_active = isActive;

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .update(updateData)
      .eq('id', quizId)
      .select()
      .single();

    if (error) {
      console.error('Error updating quiz:', error);
      return res.status(500).json({ error: 'Failed to update quiz' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error in PUT /quizzes/:quizId route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete quiz (Admin only)
router.delete('/quizzes/:quizId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { quizId } = req.params;

    // Delete quiz questions first (due to foreign key constraint)
    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('quiz_id', quizId);

    if (questionsError) {
      console.error('Error deleting quiz questions:', questionsError);
      return res.status(500).json({ error: 'Failed to delete quiz questions' });
    }

    // Delete quiz
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (error) {
      console.error('Error deleting quiz:', error);
      return res.status(500).json({ error: 'Failed to delete quiz' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /quizzes/:quizId route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz questions (Admin only)
router.get('/quizzes/:quizId/questions', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { quizId } = req.params;

    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching quiz questions:', error);
      return res.status(500).json({ error: 'Failed to fetch quiz questions' });
    }

    res.json(questions || []);
  } catch (error) {
    console.error('Error in GET /quizzes/:quizId/questions route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update question (Admin only)
router.put('/questions/:questionId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { questionId } = req.params;
    const { question, options, correctAnswer, explanation } = req.body;

    if (!question || !options || options.length !== 4) {
      return res.status(400).json({ error: 'Question and exactly 4 options are required' });
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      return res.status(400).json({ error: 'Correct answer must be between 0 and 3' });
    }

    const { data: questionData, error } = await supabase
      .from('quiz_questions')
      .update({
        question_text: question,
        options: options,
        correct_answer: correctAnswer,
        explanation: explanation || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', questionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating question:', error);
      return res.status(500).json({ error: 'Failed to update question' });
    }

    res.json(questionData);
  } catch (error) {
    console.error('Error in PUT /questions/:questionId route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete question (Admin only)
router.delete('/questions/:questionId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { questionId } = req.params;

    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      console.error('Error deleting question:', error);
      return res.status(500).json({ error: 'Failed to delete question' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /questions/:questionId route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk add questions to quiz (Admin only)
router.post('/quizzes/:quizId/questions/bulk', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { quizId } = req.params;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Questions array is required' });
    }

    // Validate all questions
    for (const q of questions) {
      if (!q.question || !q.options || q.options.length !== 4) {
        return res.status(400).json({ error: 'Each question must have text and exactly 4 options' });
      }
      if (q.correctAnswer < 0 || q.correctAnswer > 3) {
        return res.status(400).json({ error: 'Correct answer must be between 0 and 3' });
      }
    }

    const questionsToInsert = questions.map(q => ({
      quiz_id: quizId,
      question_text: q.question,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation || '',
      created_by: req.user.id
    }));

    const { data: insertedQuestions, error } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert)
      .select();

    if (error) {
      console.error('Error bulk creating questions:', error);
      return res.status(500).json({ error: 'Failed to create questions' });
    }

    res.status(201).json({
      message: 'Questions added successfully',
      questionsAdded: insertedQuestions.length,
      questions: insertedQuestions
    });
  } catch (error) {
    console.error('Error in POST /quizzes/:quizId/questions/bulk route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test admin access (Admin only)
router.get('/test', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    res.json({ 
      message: 'Admin access confirmed',
      user: {
        id: req.user.userId,
        email: req.user.email,
        role: req.user.role,
        isAdmin: req.user.is_admin
      }
    });
  } catch (error) {
    console.error('Error in GET /test route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get platform analytics (Admin only)
router.get('/analytics', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Check if Supabase is available
    if (!supabase) {
      console.log('⚠️ [ADMIN] Supabase not configured, returning mock analytics');
      return res.json({
        totalUsers: 15,
        totalQuizzes: 8,
        totalQuestions: 120,
        activeSessions: 2,
        averageScore: 78,
        completionRate: 85
      });
    }

    // Get basic analytics
    const [usersResult, quizzesResult, scoresResult] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('quizzes').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('quiz_scores').select('score')
    ]);

    const totalUsers = usersResult.count || 0;
    const totalQuizzes = quizzesResult.count || 0;
    const scores = scoresResult.data || [];
    
    const averageScore = scores.length > 0 ? 
      Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length) : 0;

    res.json({
      totalUsers,
      totalQuizzes,
      totalQuestions: totalQuizzes * 10, // Estimate
      activeSessions: 0, // Would need to query quiz_sessions
      averageScore,
      completionRate: 85 // Mock data
    });
  } catch (error) {
    console.error('Error in GET /analytics route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quiz analytics (Admin only)
router.get('/quizzes/:quizId/analytics', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { quizId } = req.params;

    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Get quiz questions
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return res.status(500).json({ error: 'Failed to fetch questions' });
    }

    // Get quiz scores for this quiz
    const { data: scores, error: scoresError } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('quiz_id', quizId);

    if (scoresError) {
      console.error('Error fetching scores:', scoresError);
      return res.status(500).json({ error: 'Failed to fetch scores' });
    }

    // Calculate analytics
    const analytics = {
      quiz: quiz,
      totalQuestions: questions.length,
      totalAttempts: scores.length,
      averageScore: scores.length > 0 ? 
        Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length) : 0,
      highestScore: scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores.map(s => s.score)) : 0,
      completionRate: 0, // This would need to be calculated based on started vs completed
      questionStats: questions.map(q => ({
        id: q.id,
        question: q.question_text,
        timesAnswered: 0, // Would need to track this
        timesCorrect: 0   // Would need to track this
      }))
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error in GET /quizzes/:quizId/analytics route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (Admin only)
router.delete('/users/:userId', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /users/:userId route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to parse CSV file
async function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const questions = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
        
        // Parse question data
        if (data.question && data.option1 && data.option2 && data.option3 && data.option4) {
          questions.push({
            question: data.question,
            options: [data.option1, data.option2, data.option3, data.option4],
            correctAnswer: parseInt(data.correct_answer) || 0,
            explanation: data.explanation || ''
          });
        }
      })
      .on('end', () => {
        if (results.length === 0) {
          reject(new Error('No data found in CSV file'));
          return;
        }

        const firstRow = results[0];
        resolve({
          title: firstRow.quiz_title || 'Imported Quiz',
          description: firstRow.quiz_description || '',
          category: firstRow.category || 'General',
          difficulty: firstRow.difficulty || 'Easy',
          timeLimit: parseInt(firstRow.time_limit) || 30,
          questions: questions
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = router;