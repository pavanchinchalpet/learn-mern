
# MERN Quest
A comprehensive learning platform built using the MERN stack with Supabase

## 📋 Project Description

Developed a full-stack quiz platform using the MERN stack with Supabase integration, interactive assessments, and real-time progress tracking.
Designed optimized PostgreSQL schemas and integrated JWT authentication, OTP verification, and responsive UI functionality for secure, interactive, and engaging user experiences.
Built a scalable admin dashboard and responsive React frontend with quiz management, scoring systems, and gamification features to enhance learner engagement.

# 🎓 MERN Quest - Complete Learning Platform

A comprehensive learning platform built using the MERN stack (MongoDB, Express, React, Node.js) with Supabase backend that helps learners master MERN concepts through interactive quizzes while earning points, badges, and climbing levels.

## 🔗 Repository Links

- **GitHub Repository**: [https://github.com/pavanchinchalpet/learn-mern](https://github.com/pavanchinchalpet/learn-mern)
- **Live Demo**: Coming Soon
- **Issues**: [Report a Bug](https://github.com/pavanchinchalpet/learn-mern/issues)

## 🚀 Features

### 👨‍🎓 User Features
- ✅ **Authentication**: JWT-based signup/login system with OTP support
- ✅ **Quiz System**: Take quizzes by category (MongoDB, Express, React, Node)
- ✅ **Progress Tracking**: Detailed analytics and performance monitoring
- ✅ **Gamification**: Earn XP, points, badges, and climb levels
- ✅ **Leaderboard**: Compete with other learners globally
- ✅ **Profile Management**: Customize avatar and track achievements
- ✅ **Daily Streaks**: Build momentum with consistent learning

### 🛠 Admin Features
- ✅ **Comprehensive Quiz Management**: Create, edit, delete quizzes and questions
- ✅ **Bulk Question Import**: Upload multiple questions via CSV/JSON files
- ✅ **Real-time Session Monitoring**: Track active quiz sessions and participants
- ✅ **Advanced Analytics**: Detailed quiz performance and user statistics
- ✅ **User Management**: View, manage, and delete user accounts
- ✅ **Session Control**: Start, pause, resume, and end quiz sessions
- ✅ **Question Management**: Individual question editing and bulk operations
- ✅ **Dashboard Analytics**: Platform statistics and performance metrics

### 🌟 Advanced Features
- 🔥 **Daily Streaks & XP Boosters**
- 🎭 **Avatar System & Achievements**
- ⚡ **Multiplayer Quiz Battles** (Socket.IO ready)
- 📊 **Advanced Analytics & Reporting**
- 🎯 **Personalized Learning Recommendations**
- 📱 **Responsive Design** for all devices
- 🔔 **Real-time Notifications** for course updates
- 📜 **Certificates** for course completion

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time communication
- **CSS3** - Custom styling with clean, professional design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Backend-as-a-Service (Database & Auth)
- **JWT** - Authentication
- **Socket.IO** - Real-time features
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📂 Project Structure

```
mern-quest/
├── api/                    # Backend API
│   ├── config/            # Supabase configuration
│   ├── controllers/       # Business logic
│   ├── middleware/        # Authentication middleware
│   ├── routes/           # Express routes
│   ├── utils/            # Supabase helpers
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── web/                   # Frontend React app
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context (Auth)
│   │   ├── pages/        # Main pages
│   │   ├── utils/        # API utilities
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── package.json      # Frontend dependencies
└── README.md             # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Supabase account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pavanchinchalpet/learn-mern.git
   cd learn-mern
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the `api/` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Supabase Configuration
   SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # JWT Configuration
   JWT_SECRET=mern-quest-super-secret-jwt-key-2024
   
   # Client URL (for CORS)
   CLIENT_URL=http://localhost:3000
   ```

4. **Set up Supabase Database** (Optional - Fallback Mode Available)
   
   **Option A: With Supabase (Recommended)**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and API keys to the `.env` file
   - Run the SQL migrations to create tables
   - Insert sample quiz data
   - Configure authentication settings
   
   **Option B: Fallback Mode (No Database Required)**
   - The application works with mock data when Supabase is not configured
   - Perfect for development and testing
   - Admin dashboard shows sample quizzes, users, and sessions

5. **Start the application**
   ```bash
   # Start backend
   cd api && npm start
   
   # Start frontend (in new terminal)
   cd web && npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### 🔑 Sample Login Credentials

**With Supabase Database:**
- **Admin User**: Create via registration with admin privileges
- **Regular User**: Register through the signup form

**Fallback Mode (No Database):**
- The application works with mock authentication
- Admin dashboard shows sample data for testing
- Perfect for development and demonstration purposes

## 📝 Sample Data

The project includes comprehensive sample quiz data covering all MERN stack components:

### Quiz Categories
- **JavaScript** (30 questions): Core concepts, ES6+, async/await, closures
- **Node.js** (12 questions): Modules, event loop, APIs, file system
- **React** (20 questions): Hooks, components, state/props, lifecycle
- **Express** (12 questions): Middleware, routing, error handling
- **MongoDB** (8 questions): CRUD operations, schemas, indexes, aggregation
- **MERN** (20 questions): Integration and full-stack scenarios
- **Authentication** (10 questions): Security, JWT, OAuth
- **Performance** (8 questions): Optimization, caching, best practices
- **Deployment** (10 questions): Production deployment strategies

### Difficulty Levels
- **Easy** (50 questions): Basic concepts and fundamentals
- **Medium** (40 questions): Intermediate topics and practical usage
- **Hard** (30 questions): Advanced concepts and complex scenarios

### Features
- ✅ Multiple choice questions with explanations
- ✅ Points system (10-20 points per question)
- ✅ Category-based organization
- ✅ Difficulty progression
- ✅ Real-world MERN stack scenarios
- ✅ Admin can add/edit/delete questions
- ✅ Bulk import via CSV/JSON files

## 📊 Database Schema (Supabase)

### Core Tables

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  avatar VARCHAR(50) DEFAULT 'default',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Quizzes Table**
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  time_limit INTEGER DEFAULT 30,
  total_questions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Quiz Questions Table**
```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Quiz Sessions Table**
```sql
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  session_code VARCHAR(10) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Quiz Session Participants Table**
```sql
CREATE TABLE quiz_session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  time_taken INTEGER DEFAULT 0,
  answers JSONB,
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

**Quiz Scores Table**
```sql
CREATE TABLE quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  answers JSONB NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  streak INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Quizzes
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get specific quiz
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/stats` - Get quiz statistics

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/leaderboard` - Get leaderboard
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/achievements` - Get user achievements

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/quizzes` - Get all quizzes
- `POST /api/admin/quizzes` - Create new quiz
- `PUT /api/admin/quizzes/:quizId` - Update quiz
- `DELETE /api/admin/quizzes/:quizId` - Delete quiz
- `GET /api/admin/quizzes/:quizId/questions` - Get quiz questions
- `POST /api/admin/questions` - Add question to quiz
- `PUT /api/admin/questions/:questionId` - Update question
- `DELETE /api/admin/questions/:questionId` - Delete question
- `POST /api/admin/quizzes/:quizId/questions/bulk` - Bulk add questions
- `GET /api/admin/quizzes/:quizId/analytics` - Get quiz analytics
- `POST /api/admin/upload-quiz` - Upload quiz file (CSV/JSON)
- `GET /api/admin/quiz-sessions` - Get all quiz sessions
- `POST /api/admin/quiz-sessions` - Create quiz session
- `GET /api/admin/quiz-sessions/:sessionId` - Get session details
- `PUT /api/admin/quiz-sessions/:sessionId` - Update session status
- `POST /api/admin/quiz-sessions/:sessionId/end` - End quiz session
- `GET /api/admin/quiz-sessions/:sessionId/participants` - Get session participants

## 🎯 Features in Detail

### Quiz System
- Multiple choice questions with 4 options
- Category-based filtering (MongoDB, Express, React, Node, JavaScript, etc.)
- Difficulty levels (Easy, Medium, Hard)
- Real-time scoring and feedback
- Progress tracking and analytics
- Time-limited quizzes with auto-submit

### Admin Dashboard
- **Quiz Management**: Complete CRUD operations for quizzes and questions
- **Bulk Operations**: Import multiple questions via CSV/JSON upload
- **Session Monitoring**: Real-time tracking of active quiz sessions
- **User Management**: View, edit, and delete user accounts
- **Analytics Dashboard**: Comprehensive performance metrics and statistics
- **Question Editor**: Individual question editing with options and explanations
- **Session Control**: Start, pause, resume, and end quiz sessions
- **Participant Tracking**: Monitor individual participant progress

### Gamification
- **Points System**: Earn points for correct answers (10-20 points per question)
- **Level System**: Level up based on total points accumulated
- **Badges**: Unlock achievements (Perfect Score, Quiz Master, etc.)
- **Streaks**: Daily login streaks for bonus points
- **Leaderboard**: Compete with other users globally
- **XP System**: Experience points for progression tracking

### User Experience
- **Clean Professional Design**: Black and white theme with light blue accents
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Updates**: Live session monitoring and progress tracking
- **Intuitive Navigation**: Easy-to-use admin interface
- **Loading States**: Smooth user experience with proper feedback
- **Error Handling**: Comprehensive error management and user notifications

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes with middleware
- CORS configuration
- Environment variable management

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy to Vercel or Netlify
3. Set environment variables for API endpoints

### Backend (Render/Heroku)
1. Set up Supabase project (optional - fallback mode available)
2. Deploy to Render or Heroku
3. Configure environment variables
4. Set up CORS for frontend domain

### Database (Supabase)
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run SQL migrations to create tables
3. Configure authentication settings
4. Set up environment variables
5. **Note**: Application works in fallback mode without database

### Environment Variables
```env
# Production Environment
NODE_ENV=production
PORT=5000

# Supabase Configuration (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-production-jwt-secret

# Client URL (for CORS)
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🎉 Acknowledgments

- MERN stack community
- React and Node.js teams
- MongoDB for the database
- All contributors and users

---

**Happy Learning! 🎮📚**
