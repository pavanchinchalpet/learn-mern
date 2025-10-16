# Supabase Setup Guide for MERN Quest Learning Platform

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: mern-quest-learning
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project"

## 2. Get Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

## 3. Set Up Environment Variables

Create a `.env` file in the `api` directory with:

```env
NODE_ENV=development
PORT=5000

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

## 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `api/supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables, indexes, and RLS policies

## 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
4. Enable **Email** provider
5. Configure email templates if needed

## 6. Set Up Row Level Security (RLS)

The SQL schema includes RLS policies, but you can verify them in:
- **Authentication** → **Policies**

## 7. Test the Setup

1. Start your backend server: `npm run dev`
2. Check console for "Connected to Supabase" message
3. Test registration/login endpoints

## 8. Frontend Integration

The frontend will automatically work with Supabase once you:
1. Install Supabase client: `npm install @supabase/supabase-js`
2. Update API calls to use Supabase endpoints
3. Handle authentication with Supabase Auth

## Benefits of Supabase Migration

✅ **Built-in Authentication**: No need for custom JWT handling
✅ **Real-time Features**: Built-in subscriptions for live updates
✅ **SQL Database**: More robust than MongoDB for relational data
✅ **Dashboard**: Easy database management and monitoring
✅ **Scalability**: Automatic scaling and backups
✅ **Security**: Built-in RLS and security features
✅ **APIs**: Auto-generated REST and GraphQL APIs

## Next Steps

1. Complete the Supabase project setup
2. Run the SQL schema
3. Update environment variables
4. Test authentication endpoints
5. Migrate remaining controllers to use Supabase
