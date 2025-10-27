# 🎓 MERN Quest - Learning Platform

A comprehensive gamified learning platform built using the MERN stack with Supabase integration. Master MERN concepts through interactive quizzes, earn points, badges, and climb leaderboards.

## 🔗 Live Links

- **GitHub Repository**: [https://github.com/pavanchinchalpet/learn-mern](https://github.com/pavanchinchalpet/learn-mern)
- **Live Demo**: [https://learn-mern-pied.vercel.app](https://learn-mern-pied.vercel.app)

## 🚀 Features

### User Features
- ✅ JWT-based authentication with OTP support
- ✅ Interactive quiz system with multiple categories
- ✅ Progress tracking and analytics dashboard
- ✅ Gamification system (points, levels, badges)
- ✅ Global leaderboard
- ✅ Profile management with achievements
- ✅ Daily streaks for consistent learning

### Admin Features
- ✅ Complete quiz management (CRUD operations)
- ✅ Bulk question import via CSV/JSON
- ✅ Real-time session monitoring
- ✅ Advanced analytics dashboard
- ✅ User management system
- ✅ Question editor with explanations

## 🛠 Tech Stack

**Frontend:**
- React.js, React Router, Axios, Socket.IO Client, Tailwind  CSS.

**Backend:**
- Node.js, Express.js, Supabase, JWT, Socket.IO, bcryptjs

## 📂 Project Structure

```
mern-quest/
├── api/                    # Backend API
│   ├── controllers/       # Business logic
│   ├── middleware/        # Authentication
│   ├── routes/           # Express routes
│   └── server.js         # Main server file
├── web/                   # Frontend React app
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── context/      # Auth context
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
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
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   
   # JWT Configuration
   JWT_SECRET=your-jwt-secret
   
   # Client URL
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or separately:
   # Backend
   cd api && npm run dev
   
   # Frontend (new terminal)
   cd web && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🎯 Key Features

### Quiz System
- Multiple choice questions with explanations
- Category-based organization (React, Node.js, Express, MongoDB, etc.)
- Difficulty levels (Easy, Medium, Hard)
- Real-time scoring and feedback
- Time-limited quizzes

### Gamification
- Points system (10-20 points per question)
- Level progression based on total points
- Achievements and badges
- Daily login streaks
- Global leaderboard rankings

### Admin Dashboard
- Create, edit, delete quizzes and questions
- Bulk import questions via CSV/JSON
- Monitor active quiz sessions
- View user statistics and analytics
- Manage user accounts

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Protected routes
- CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Happy Learning! 🎮📚**
