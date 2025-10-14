
# learn-mern
A comprehensive learning platform built using the MERN stack

# 🎓 MERN Quest - Complete Learning Platform

A comprehensive learning platform built using the MERN stack (MongoDB, Express, React, Node.js) that helps learners master MERN concepts through structured courses, interactive lessons, coding exercises, and gamified quizzes while earning points, badges, and climbing levels.

## 🔗 Repository Links

- **GitHub Repository**: [https://github.com/pavanchinchalpet/learn-mern](https://github.com/pavanchinchalpet/learn-mern)
- **Live Demo**: Coming Soon
- **Issues**: [Report a Bug](https://github.com/pavanchinchalpet/learn-mern/issues)

## 🚀 Features

### 👨‍🎓 User Features
- ✅ **Authentication**: JWT-based signup/login system with OTP support
- ✅ **Course Management**: Browse, enroll, and track progress in structured courses
- ✅ **Interactive Lessons**: Video tutorials, articles, coding exercises, and projects
- ✅ **Quiz System**: Take quizzes by category (MongoDB, Express, React, Node)
- ✅ **Progress Tracking**: Detailed analytics and performance monitoring
- ✅ **Gamification**: Earn XP, points, badges, and climb levels
- ✅ **Learning Paths**: Structured curriculum for different skill levels
- ✅ **Notes & Bookmarks**: Personal learning tools and progress tracking
- ✅ **Leaderboard**: Compete with other learners globally
- ✅ **Profile Management**: Customize avatar and track achievements
- ✅ **Daily Streaks**: Build momentum with consistent learning

### 🛠 Admin Features
- ✅ **Course Management**: Create, update, and organize courses and lessons
- ✅ **Content Management**: Upload videos, articles, and coding exercises
- ✅ **User Analytics**: Track user performance and platform statistics
- ✅ **Quiz Management**: Add, update, and delete quiz questions
- ✅ **Learning Path Management**: Design structured learning curricula
- ✅ **Category Management**: Organize content by MERN stack components
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
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling
- **JWT** - Authentication
- **Socket.IO** - Real-time features
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📂 Project Structure

```
learn-mern/
├── api/                    # Backend API
│   ├── config/            # Database configuration
│   ├── controllers/       # Business logic
│   ├── middleware/        # Authentication middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
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
└── package.json          # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
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
   MONGODB_URI=mongodb://localhost:27017/learn-mern
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:3000
   ```

4. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### 🔑 Sample Login Credentials
After running the seed script, you can use these credentials:
- **Admin User**: admin@mernquest.com / admin123
- **Regular User**: learner@mernquest.com / admin123

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

## 📊 Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  points: Number,
  level: Number,
  badges: [String],
  streak: Number,
  totalQuizzes: Number,
  correctAnswers: Number,
  totalAnswers: Number,
  isAdmin: Boolean,
  avatar: String
}
```

### Quiz Model
```javascript
{
  question: String,
  options: [String],
  answer: String,
  category: String (MongoDB|Express|React|Node),
  difficulty: String (easy|medium|hard),
  points: Number,
  timesAnswered: Number,
  timesCorrect: Number,
  isActive: Boolean
}
```

### Score Model
```javascript
{
  userId: ObjectId,
  quizId: ObjectId,
  score: Number,
  timeTaken: Number,
  answers: [{
    questionId: ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  totalQuestions: Number,
  correctAnswers: Number,
  streak: Number,
  pointsEarned: Number
}
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

### Latest UI Updates (Quiz Experience)
- Minimal, exam-style layout focused on the question interface
- Left dark sidebar with:
  - Topic name and attempted/unattempted indicators
  - "Questions Attempted" counter (e.g., 3 / 10)
  - Grid of numbered buttons for question navigation (current, attempted, unattempted states)
- Centered white question card on the right with fixed size (static background that never changes between questions)
- Plain timer text at the top-right of the card (no colored bars)
- Options rendered as simple outlined choices with A/B/C/D markers
- Bottom action row with uniformly sized buttons: Clear, Skip, Submit (yellow)
- No extra headers, review panels, or dynamic background changes; only question content updates

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

#### Building and pushing only the frontend (web)
From the repository root:
```bash
cd web
npm ci
npm run build
cd ..
git add web
git commit -m "build(web): quiz UI - centered card, static background, sidebar nav"
git push origin <your-branch>
```

### Backend (Render/Heroku)
1. Set up MongoDB Atlas
2. Deploy to Render or Heroku
3. Configure environment variables
4. Set up CORS for frontend domain

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update environment variables

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
