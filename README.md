
# MERN Quest
A comprehensive learning platform built using the MERN stack with Supabase

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
- ✅ **User Analytics**: Track user performance and platform statistics
- ✅ **Quiz Management**: Add, update, and delete quiz questions
- ✅ **Real-time Dashboard**: Monitor platform activity and user engagement

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

4. **Set up Supabase Database**
   
   - Create a new Supabase project
   - Run the SQL migrations to create tables
   - Insert sample quiz data
   - Configure authentication settings

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
After setting up the database, you can register new users or use existing ones:
- **Admin User**: Create via registration with admin privileges
- **Regular User**: Register through the signup form

## 📝 Sample Data

The project includes comprehensive sample quiz data covering all MERN stack components:

### Quiz Categories
- **MongoDB** (8 questions): CRUD operations, schemas, indexes, aggregation
- **Express** (5 questions): Middleware, routing, error handling
- **React** (7 questions): Hooks, components, state/props, lifecycle
- **Node** (7 questions): Modules, event loop, async/await, APIs
- **MERN** (3 questions): Integration and stack overview

### Difficulty Levels
- **Easy** (15 questions): Basic concepts and fundamentals
- **Medium** (12 questions): Intermediate topics and practical usage
- **Hard** (3 questions): Advanced concepts like event loop

### Features
- ✅ Multiple choice questions with explanations
- ✅ Points system (10-20 points per question)
- ✅ Category-based organization
- ✅ Difficulty progression
- ✅ Real-world MERN stack scenarios

## 📊 Database Schema (Supabase)

### Users Table
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

### Quizzes Table
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  answer VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  points INTEGER DEFAULT 10,
  times_answered INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Quiz Scores Table
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
- `POST /api/admin/quiz` - Create new quiz
- `PUT /api/admin/quiz/:id` - Update quiz
- `DELETE /api/admin/quiz/:id` - Delete quiz
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/users` - Get all users

## 🎯 Features in Detail

### Quiz System
- Multiple choice questions
- Category-based filtering (MongoDB, Express, React, Node)
- Difficulty levels (Easy, Medium, Hard)
- Real-time scoring and feedback
- Progress tracking

### Gamification
- **Points System**: Earn points for correct answers
- **Level System**: Level up based on total points
- **Badges**: Unlock achievements (Perfect Score, Quiz Master, etc.)
- **Streaks**: Daily login streaks for bonus points
- **Leaderboard**: Compete with other users

### User Experience
- Clean, professional UI design
- Responsive design for mobile and desktop
- Real-time updates
- Intuitive navigation
- Loading states and error handling

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
3. Set environment variables

### Backend (Render/Heroku)
1. Set up MongoDB Atlas
2. Deploy to Render or Heroku
3. Configure environment variables
4. Set up CORS for frontend domain

### Database (Supabase)
1. Create Supabase project
2. Run SQL migrations
3. Configure authentication
4. Set up environment variables

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
