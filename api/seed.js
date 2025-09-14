const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const User = require('./models/User');
const quizzes = require('./quizData');
require('dotenv').config();

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-quest';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Quiz.deleteMany({});
    await User.deleteMany({});
    
    // Insert quiz data
    console.log('📝 Inserting quiz data...');
    const insertedQuizzes = await Quiz.insertMany(quizzes);
    console.log(`✅ Successfully inserted ${insertedQuizzes.length} quizzes`);
    
    // Create a sample admin user
    console.log('👤 Creating sample admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@mernquest.com',
      password: hashedPassword,
      isAdmin: true,
      points: 1000,
      level: 5,
      badges: ['Admin', 'Quiz Master', 'Perfect Score'],
      totalQuizzes: 50,
      correctAnswers: 45,
      totalAnswers: 50,
      streak: 7,
      avatar: '👨‍💻'
    });
    
    await adminUser.save();
    console.log('✅ Sample admin user created (admin@mernquest.com / admin123)');
    
    // Create a sample regular user
    console.log('👤 Creating sample regular user...');
    const regularUser = new User({
      username: 'learner',
      email: 'learner@mernquest.com',
      password: hashedPassword,
      isAdmin: false,
      points: 250,
      level: 2,
      badges: ['First Quiz'],
      totalQuizzes: 10,
      correctAnswers: 8,
      totalAnswers: 10,
      streak: 3,
      avatar: '🎮'
    });
    
    await regularUser.save();
    console.log('✅ Sample regular user created (learner@mernquest.com / admin123)');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Quiz Statistics:');
    console.log(`   Total Quizzes: ${insertedQuizzes.length}`);
    
    // Count quizzes by category
    const categoryStats = {};
    insertedQuizzes.forEach(quiz => {
      categoryStats[quiz.category] = (categoryStats[quiz.category] || 0) + 1;
    });
    
    console.log('   By Category:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`     ${category}: ${count} quizzes`);
    });
    
    // Count quizzes by difficulty
    const difficultyStats = {};
    insertedQuizzes.forEach(quiz => {
      difficultyStats[quiz.difficulty] = (difficultyStats[quiz.difficulty] || 0) + 1;
    });
    
    console.log('   By Difficulty:');
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      console.log(`     ${difficulty}: ${count} quizzes`);
    });
    
    console.log('\n🔑 Sample Login Credentials:');
    console.log('   Admin: admin@mernquest.com / admin123');
    console.log('   User: learner@mernquest.com / admin123');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
