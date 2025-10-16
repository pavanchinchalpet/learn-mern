# Supabase Migration Guide

This guide covers the complete migration from MongoDB to Supabase for the MERN Quest learning platform.

## 🎯 Migration Overview

The application has been completely migrated from MongoDB to Supabase, including:
- Database schema migration
- Authentication system update
- API controllers refactoring
- Frontend integration updates

## 📋 Prerequisites

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project in your Supabase dashboard
3. **Environment Variables**: Set up the required environment variables

## 🗄️ Database Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

### 2. Run Database Schema
Execute the SQL schema in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of api/supabase-schema.sql
-- This will create all necessary tables, indexes, and RLS policies
```

### 3. Configure Environment Variables
Update your `.env` file in the `api/` directory:

```env
NODE_ENV=development
PORT=5000

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Configuration (for custom auth flow)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=MERN Quest <your-email@gmail.com>

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
cd api
npm install
```

### 2. Seed the Database
```bash
npm run seed
```

This will populate your Supabase database with sample data including:
- 15+ quiz questions across all MERN stack categories
- Sample courses and learning paths
- Default badges and achievements

### 3. Start the Server
```bash
npm run dev
```

## 🔄 Key Changes Made

### Backend Changes

#### 1. **Database Configuration**
- ❌ Removed: `api/config/db.js` (MongoDB connection)
- ✅ Added: `api/config/supabase.js` (Supabase client)
- ✅ Added: `api/utils/supabaseHelpers.js` (Database operations)

#### 2. **Controllers Migration**
- ❌ Removed: MongoDB model dependencies
- ✅ Updated: All controllers to use Supabase queries
- ✅ Added: New Supabase-based controllers:
  - `supabaseAuthController.js`
  - `supabaseQuizController.js`
  - `supabaseUserController.js`

#### 3. **Routes Update**
- ✅ Updated: All route files to use new Supabase controllers
- ✅ Maintained: Same API endpoints and functionality

#### 4. **Package Dependencies**
- ❌ Removed: `mongoose` (MongoDB ODM)
- ❌ Removed: `pg` (PostgreSQL driver - not needed with Supabase client)
- ✅ Kept: `@supabase/supabase-js` (Supabase client)

### Frontend Changes

#### 1. **Authentication Context**
- ✅ Updated: `web/src/context/AuthContext.js` to work with Supabase
- ✅ Added: `web/src/context/SupabaseAuthContext.js` (alternative implementation)

#### 2. **Configuration**
- ✅ Added: `web/src/config/supabase.js` with helper functions

## 📊 Database Schema

### Core Tables
- **users**: User profiles (extends Supabase auth.users)
- **quizzes**: Quiz questions and metadata
- **quiz_scores**: User quiz attempts and scores
- **courses**: Course information
- **lessons**: Individual lessons within courses
- **learning_paths**: Structured learning curricula
- **progress**: User progress tracking
- **badges**: Achievement badges
- **user_badges**: User badge assignments

### Key Features
- **Row Level Security (RLS)**: Automatic data protection
- **UUID Primary Keys**: Better performance and security
- **JSONB Fields**: Flexible content storage
- **Automatic Timestamps**: Created/updated tracking
- **Foreign Key Constraints**: Data integrity

## 🔐 Authentication Flow

### Current Implementation
1. **Registration**: Creates user in Supabase Auth + profile in users table
2. **Login**: Authenticates with Supabase Auth + returns profile data
3. **JWT Tokens**: Custom JWT for API authentication
4. **Session Management**: HTTP-only cookies for security

### Supabase Auth Features Available
- Email/password authentication
- Social logins (Google, GitHub, etc.)
- Password reset flows
- Email verification
- Multi-factor authentication

## 🧪 Testing the Migration

### 1. **API Endpoints Test**
```bash
# Test quiz endpoints
curl http://localhost:5000/api/quiz
curl http://localhost:5000/api/quiz/categories

# Test user endpoints (requires authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/user/profile
```

### 2. **Frontend Integration**
1. Start the frontend: `cd web && npm start`
2. Test user registration/login
3. Test quiz functionality
4. Verify data persistence

### 3. **Database Verification**
Check your Supabase dashboard to verify:
- Tables are created correctly
- Sample data is inserted
- RLS policies are active

## 🚨 Troubleshooting

### Common Issues

#### 1. **Connection Errors**
- Verify Supabase URL and keys are correct
- Check network connectivity
- Ensure Supabase project is active

#### 2. **Authentication Issues**
- Verify JWT_SECRET is set
- Check cookie settings for CORS
- Ensure user exists in both auth.users and users tables

#### 3. **RLS Policy Errors**
- Check RLS policies in Supabase dashboard
- Verify user authentication context
- Test with service role key if needed

#### 4. **Data Migration Issues**
- Run the seed script: `npm run seed`
- Check Supabase logs for errors
- Verify table schemas match expectations

## 📈 Performance Considerations

### Supabase Advantages
- **Automatic Scaling**: Handles traffic spikes
- **Built-in Caching**: Faster query performance
- **Connection Pooling**: Efficient database connections
- **Real-time Features**: WebSocket support for live updates

### Optimization Tips
- Use appropriate indexes (already included in schema)
- Leverage Supabase's built-in caching
- Consider using Supabase Edge Functions for complex operations
- Monitor query performance in Supabase dashboard

## 🔮 Next Steps

### Immediate
1. Test all functionality thoroughly
2. Update documentation
3. Deploy to production environment

### Future Enhancements
1. **Real-time Features**: Implement live quiz sessions
2. **Advanced Analytics**: Use Supabase's analytics features
3. **File Storage**: Use Supabase Storage for course materials
4. **Edge Functions**: Move complex logic to Supabase Edge Functions

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

---

**Migration Status**: ✅ Complete
**Last Updated**: December 2024
**Version**: 2.0.0
