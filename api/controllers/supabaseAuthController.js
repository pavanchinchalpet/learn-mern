const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { userHelpers } = require('../utils/supabaseHelpers');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('🔵 [REGISTER] Request received:', {
      body: req.body,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('🔴 [REGISTER] Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    console.log('🔵 [REGISTER] Processing registration for:', { username, email });

    // Check if user already exists
    console.log('🔵 [REGISTER] Checking if user exists...');
    const { data: existingUser } = await userHelpers.getUserByEmailOrUsername(email, username);

    if (existingUser) {
      console.log('🔴 [REGISTER] User already exists:', existingUser.email);
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    console.log('🔵 [REGISTER] Creating user via Supabase Admin (email auto-confirm)...');
    // Create user via Admin API with email confirmed to prevent signup emails
    const serviceClient = supabase.getServiceClient();
    if (!serviceClient) {
      console.log('🔴 [REGISTER] Service role key not configured');
      return res.status(500).json({ message: 'Server misconfiguration: service role key missing' });
    }

    // Check if user already exists in Supabase Auth
    const { data: authUsers, error: checkError } = await serviceClient.auth.admin.listUsers();
    
    if (!checkError && authUsers?.users) {
      const userExists = authUsers.users.find(user => user.email === email);
      if (userExists) {
        console.log('🔴 [REGISTER] User already exists in Supabase Auth:', email);
        return res.status(409).json({ 
          message: 'User with this email already exists. Please use a different email or contact support.' 
        });
      }
    }

    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        avatar: 'default'
      }
    });

    if (authError) {
      console.log('🔴 [REGISTER] Supabase auth error:', authError);
      if (authError.code === 'email_exists') {
        return res.status(409).json({ 
          message: 'User with this email already exists. Please use a different email or contact support.' 
        });
      }
      return res.status(400).json({ message: authError.message });
    }

    if (!authData.user) {
      console.log('🔴 [REGISTER] No user data returned from Supabase');
      return res.status(400).json({ message: 'Failed to create user' });
    }

    console.log('🔵 [REGISTER] User created in Supabase Auth:', authData.user.id);

    // With admin.createUser and email_confirm: true, the email is already confirmed

    // Create user profile in our users table
    console.log('🔵 [REGISTER] Creating user profile...');
    const { data: userProfile, error: profileError } = await userHelpers.createUserProfile(
      authData.user.id,
      { username, email, avatar: 'default' }
    );

    if (profileError) {
      console.log('🔴 [REGISTER] Profile creation error:', profileError);
      console.error('Error creating user profile:', profileError);
      // Note: User is created in auth but not in our profile table
      // In production, you might want to handle this differently
    } else {
      console.log('🔵 [REGISTER] User profile created successfully');
    }

    // Generate token
    console.log('🔵 [REGISTER] Generating JWT token...');
    const token = generateToken(authData.user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('✅ [REGISTER] Registration successful for:', username);
    res.status(201).json({
      message: 'User registered successfully',
      token: token, // Include token in response for localStorage storage
      user: {
        id: authData.user.id,
        username,
        email,
        avatar: 'default',
        points: 0,
        level: 1,
        streak: 0,
        isAdmin: false
      }
    });
  } catch (error) {
    console.log('🔴 [REGISTER] Unexpected error:', error);
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    console.log('🔵 [LOGIN] Request received:', {
      body: req.body,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('🔴 [LOGIN] Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('🔵 [LOGIN] Processing login for:', email);

    // Get user profile first
    console.log('🔵 [LOGIN] Getting user profile...');
    const { data: userProfile, error: profileError } = await userHelpers.getUserByEmailOrUsername(email, '');
    
    if (profileError || !userProfile) {
      console.log('🔴 [LOGIN] User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('🔵 [LOGIN] User found, authenticating with Supabase...');
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.log('🔴 [LOGIN] Supabase auth error:', authError);
      
      // Check if it's an email confirmation error
      if (authError.message.includes('Email not confirmed')) {
        console.log('🔵 [LOGIN] Email not confirmed, but allowing login with JWT...');
        
        // Generate JWT token anyway for users with unconfirmed emails
        const token = generateToken(userProfile.id);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log('✅ [LOGIN] Login successful (email not confirmed)');
        return res.json({
          message: 'Login successful! Please confirm your email when convenient.',
          token: token, // Include token in response for localStorage storage
          user: {
            id: userProfile.id,
            username: userProfile.username,
            email: userProfile.email,
            avatar: userProfile.avatar,
            points: userProfile.points,
            level: userProfile.level,
            streak: userProfile.streak,
            isAdmin: userProfile.is_admin,
            emailConfirmed: false
          },
          requiresEmailConfirmation: true
        });
      }
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!authData.user) {
      console.log('🔴 [LOGIN] No user data returned from Supabase');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    console.log('🔵 [LOGIN] Authentication successful, logging in auth_logins...');
    // Hash the password for storage in auth_logins
    const passwordHash = await bcrypt.hash(password, 12);

    // Store login attempt in auth_logins table using service client
    const serviceClient = supabase.getServiceClient();
    const { error: loginLogError } = await serviceClient
      .from('auth_logins')
      .insert({
        user_id: userProfile.id,
        method: 'password',
        password_hash: passwordHash,
        is_verified: true,
        is_active: true,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent')
      });

    if (loginLogError) {
      console.log('🔴 [LOGIN] Error logging password login:', loginLogError);
      // Continue with login even if logging fails
    } else {
      console.log('🔵 [LOGIN] Login logged successfully');
    }

    // Generate token
    console.log('🔵 [LOGIN] Generating JWT token...');
    const token = generateToken(authData.user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('✅ [LOGIN] Login successful for:', userProfile.username);
    res.json({
      message: 'Login successful',
      token: token, // Include token in response for localStorage storage
      user: {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email,
        avatar: userProfile.avatar,
        points: userProfile.points,
        level: userProfile.level,
        streak: userProfile.streak,
        isAdmin: userProfile.is_admin
      }
    });
  } catch (error) {
    console.log('🔴 [LOGIN] Unexpected error:', error);
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: userProfile, error } = await userHelpers.getUserById(userId);

    if (error) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email,
        avatar: userProfile.avatar,
        points: userProfile.points,
        level: userProfile.level,
        streak: userProfile.streak,
        isAdmin: userProfile.is_admin,
        totalQuizzes: userProfile.total_quizzes,
        correctAnswers: userProfile.correct_answers,
        totalAnswers: userProfile.total_answers
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    // Always respond OK to avoid client-side noise
    return res.json({ message: 'Logout completed' });
  }
};

// @desc    Send OTP for login
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const { data: user } = await userHelpers.getUserByEmailOrUsername(email, '');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the OTP for secure storage
    const otpHash = await bcrypt.hash(otp, 12);
    
    // Set OTP expiration (10 minutes from now)
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Deactivate any existing OTP attempts for this user using service client
    const serviceClient = supabase.getServiceClient();
    await serviceClient
      .from('auth_logins')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('method', 'otp');

    // Store OTP in auth_logins table using service client
    const { error: otpStoreError } = await serviceClient
      .from('auth_logins')
      .insert({
        user_id: user.id,
        method: 'otp',
        otp_hash: otpHash,
        otp_expires_at: otpExpiresAt,
        is_verified: false,
        is_active: true,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent')
      });

    if (otpStoreError) {
      console.error('Error storing OTP:', otpStoreError);
      return res.status(500).json({ message: 'Error storing OTP' });
    }

    // Send OTP via console log (for development)
    console.log(`📧 [OTP] OTP for ${email}: ${otp}`);

    res.json({ 
      message: 'OTP sent successfully',
      expiresIn: 600 // 10 minutes in seconds
    });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if user exists
    const { data: user } = await userHelpers.getUserByEmailOrUsername(email, '');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use service client to bypass RLS for OTP verification
    const serviceClient = supabase.getServiceClient();

    // Find active OTP for this user
    const { data: otpRecord, error: otpFetchError } = await serviceClient
      .from('auth_logins')
      .select('*')
      .eq('user_id', user.id)
      .eq('method', 'otp')
      .eq('is_active', true)
      .eq('is_verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpFetchError || !otpRecord) {
      return res.status(400).json({ message: 'No valid OTP found. Please request a new OTP.' });
    }

    // Check if OTP has expired
    const now = new Date();
    if (new Date(otpRecord.otp_expires_at) < now) {
      // Mark OTP as inactive
      await serviceClient
        .from('auth_logins')
        .update({ is_active: false })
        .eq('id', otpRecord.id);
      
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Verify the OTP
    const isValidOTP = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark OTP as verified and inactive
    const { error: updateError } = await serviceClient
      .from('auth_logins')
      .update({ 
        is_verified: true, 
        is_active: false,
        updated_at: new Date()
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error updating OTP record:', updateError);
      return res.status(500).json({ message: 'Error verifying OTP' });
    }

    // Generate JWT token
    const token = generateToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'OTP verified successfully',
      token: token, // Include token in response for localStorage storage
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        points: user.points,
        level: user.level,
        streak: user.streak,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/reset-password-request
// @access  Public
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const { data: user } = await userHelpers.getUserByEmailOrUsername(email, '');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the OTP for secure storage
    const otpHash = await bcrypt.hash(otp, 12);
    
    // Set OTP expiration (15 minutes from now for password reset)
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Deactivate any existing OTP attempts for this user
    await supabase
      .from('auth_logins')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('method', 'otp');

    // Store OTP in auth_logins table
    const { error: otpStoreError } = await supabase
      .from('auth_logins')
      .insert({
        user_id: user.id,
        method: 'otp',
        otp_hash: otpHash,
        otp_expires_at: otpExpiresAt,
        is_verified: false,
        is_active: true,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent')
      });

    if (otpStoreError) {
      console.error('Error storing password reset OTP:', otpStoreError);
      return res.status(500).json({ message: 'Error storing OTP' });
    }

    // Send OTP via console log (for development)
    console.log(`📧 [OTP] OTP for ${email}: ${otp}`);

    res.json({ 
      message: 'Password reset OTP sent successfully',
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Error sending password reset OTP' });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if user exists
    const { data: user } = await userHelpers.getUserByEmailOrUsername(email, '');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find active OTP for this user
    const { data: otpRecord, error: otpFetchError } = await supabase
      .from('auth_logins')
      .select('*')
      .eq('user_id', user.id)
      .eq('method', 'otp')
      .eq('is_active', true)
      .eq('is_verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpFetchError || !otpRecord) {
      return res.status(400).json({ message: 'No valid OTP found. Please request a new OTP.' });
    }

    // Check if OTP has expired
    const now = new Date();
    if (new Date(otpRecord.otp_expires_at) < now) {
      // Mark OTP as inactive
      await supabase
        .from('auth_logins')
        .update({ is_active: false })
        .eq('id', otpRecord.id);
      
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    // Verify the OTP
    const isValidOTP = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update password in Supabase Auth
    const { error: passwordUpdateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (passwordUpdateError) {
      console.error('Error updating password:', passwordUpdateError);
      return res.status(500).json({ message: 'Error updating password' });
    }

    // Mark OTP as verified and inactive
    const { error: updateError } = await supabase
      .from('auth_logins')
      .update({ 
        is_verified: true, 
        is_active: false,
        updated_at: new Date()
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error updating OTP record:', updateError);
      // Continue even if logging fails
    }

    res.json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId || req.userId;
    console.log('🔵 [GET CURRENT USER] Getting user profile for:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { data: userProfile, error } = await userHelpers.getUserById(userId);
    
    if (error || !userProfile) {
      console.log('🔴 [GET CURRENT USER] User profile not found:', error);
      return res.status(404).json({ message: 'User profile not found' });
    }

    console.log('✅ [GET CURRENT USER] User profile found:', userProfile.username);
    
    res.json({
      user: {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email,
        avatar: userProfile.avatar,
        points: userProfile.points,
        level: userProfile.level,
        streak: userProfile.streak,
        isAdmin: userProfile.is_admin,
        totalQuizzes: userProfile.total_quizzes,
        correctAnswers: userProfile.correct_answers,
        totalAnswers: userProfile.total_answers,
        learningStyle: userProfile.learning_style,
        difficultyPreference: userProfile.difficulty_preference,
        emailNotifications: userProfile.email_notifications,
        courseUpdates: userProfile.course_updates,
        achievementAlerts: userProfile.achievement_alerts,
        createdAt: userProfile.created_at,
        lastLogin: userProfile.last_login
      }
    });
  } catch (error) {
    console.log('🔴 [GET CURRENT USER] Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = async (req, res) => {
  try {
    console.log('🔵 [REFRESH] Refresh request received');
    
    // For JWT-based auth, we don't actually refresh tokens
    // Instead, we validate the current token and return user info
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('🔴 [REFRESH] No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('✅ [REFRESH] Token is valid, user ID:', decoded.userId);
      
      // Get user data
      const { data: user } = await userHelpers.getUserById(decoded.userId);
      if (!user) {
        console.log('🔴 [REFRESH] User not found');
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('✅ [REFRESH] Refresh successful for user:', user.username);
      res.json({
        message: 'Token refreshed successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          points: user.points || 0,
          level: user.level || 1,
          achievements: user.achievements || []
        }
      });
    } catch (tokenError) {
      console.log('🔴 [REFRESH] Token verification failed:', tokenError.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('🔴 [REFRESH] Error:', error);
    res.status(500).json({ message: 'Server error during refresh' });
  }
};

// Helper function to clean up expired OTPs
const cleanupExpiredOTPs = async () => {
  try {
    const now = new Date();
    await supabase
      .from('auth_logins')
      .update({ is_active: false })
      .eq('method', 'otp')
      .eq('is_active', true)
      .lt('otp_expires_at', now);
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getCurrentUser,
  logout,
  sendOTP,
  verifyOTP,
  requestPasswordReset,
  resetPassword,
  refresh,
  cleanupExpiredOTPs
};