import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  // Sign up
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error };
  },

  // Update password
  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    return { error };
  }
};

// Database helper functions
export const db = {
  // Get user profile
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
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

  // Get courses
  getCourses: async (filters = {}) => {
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
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
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

  // Enroll in course
  enrollInCourse: async (userId, courseId) => {
    const { data, error } = await supabase
      .from('user_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId
      })
      .select()
      .single();
    return { data, error };
  },

  // Get user enrollments
  getUserEnrollments: async (userId) => {
    const { data, error } = await supabase
      .from('user_enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  // Get lessons for a course
  getLessonsByCourse: async (courseId) => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_index');
    return { data, error };
  },

  // Update progress
  updateProgress: async (progressData) => {
    const { data, error } = await supabase
      .from('progress')
      .upsert(progressData)
      .select()
      .single();
    return { data, error };
  },

  // Get user progress
  getUserProgress: async (userId, courseId = null) => {
    let query = supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query;
    return { data, error };
  }
};

export default supabase;
