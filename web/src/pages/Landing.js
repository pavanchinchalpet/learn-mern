import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  // Defer non-critical content to improve LCP
  const [deferBelowFold, setDeferBelowFold] = useState(false);
  const [deferHeroVisual, setDeferHeroVisual] = useState(false);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    // Schedule below-the-fold sections after first paint
    const schedule = () => {
      setDeferHeroVisual(true);
      // Defer heavier sections a bit later
      setTimeout(() => setDeferBelowFold(true), 200);
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(schedule, { timeout: 500 });
    } else {
      setTimeout(schedule, 0);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const heroHeight = window.innerHeight * 0.8; // Hide nav after scrolling past 80% of viewport
      setShowNav(scrollPosition < heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${showNav ? 'visible' : 'hidden'}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">📚</div>
            <span className="brand-text">MERN Quest</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Master the MERN Stack
              <span className="hero-highlight"> Like a Pro</span>
            </h1>
            <p className="hero-description">
              Transform your coding journey with interactive challenges, real-world projects, 
              and comprehensive learning paths designed for developers of all levels.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-primary">
                <span>🚀</span>
                Start Learning Free
              </Link>
              <Link to="/login" className="btn-secondary">
                <span>👋</span>
                Sign In
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
          {deferHeroVisual && (
            <div className="hero-visual">
              <div className="code-preview">
                <div className="code-header">
                  <div className="code-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <span className="code-title">app.js</span>
                </div>
                <div className="code-content">
                  <div className="code-line">
                    <span className="code-keyword">const</span> 
                    <span className="code-variable"> express</span> 
                    <span className="code-operator"> =</span> 
                    <span className="code-function"> require</span>
                    <span className="code-bracket">(</span>
                    <span className="code-string">'express'</span>
                    <span className="code-bracket">)</span>
                  </div>
                  <div className="code-line">
                    <span className="code-keyword">const</span> 
                    <span className="code-variable"> app</span> 
                    <span className="code-operator"> =</span> 
                    <span className="code-function"> express</span>
                    <span className="code-bracket">()</span>
                  </div>
                  <div className="code-line">
                    <span className="code-keyword">const</span> 
                    <span className="code-variable"> mongoose</span> 
                    <span className="code-operator"> =</span> 
                    <span className="code-function"> require</span>
                    <span className="code-bracket">(</span>
                    <span className="code-string">'mongoose'</span>
                    <span className="code-bracket">)</span>
                  </div>
                  <div className="code-line">
                    <span className="code-comment">{'// Connect to MongoDB'}</span>
                  </div>
                  <div className="code-line">
                    <span className="code-function">mongoose</span>
                    <span className="code-bracket">.</span>
                    <span className="code-function">connect</span>
                    <span className="code-bracket">(</span>
                    <span className="code-string">process.env.MONGODB_URI</span>
                    <span className="code-bracket">)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {deferBelowFold && (
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose MERN Quest?</h2>
            <p className="section-description">
              Comprehensive learning platform designed to take you from beginner to expert
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Interactive Learning</h3>
              <p className="feature-description">
                Hands-on coding challenges and real-world projects that reinforce your learning
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Progress Tracking</h3>
              <p className="feature-description">
                Monitor your learning journey with detailed analytics and achievement badges
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Gamification</h3>
              <p className="feature-description">
                Earn points, unlock achievements, and compete on leaderboards to stay motivated
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3 className="feature-title">Real Projects</h3>
              <p className="feature-description">
                Build actual applications using industry best practices and modern tools
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Community</h3>
              <p className="feature-description">
                Connect with fellow learners, share projects, and get help when you need it
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Ready</h3>
              <p className="feature-description">
                Learn anywhere, anytime with our responsive design and mobile-optimized interface
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Learning Path Section */}
      {deferBelowFold && (
      <section className="learning-path-section">
        <div className="learning-path-container">
          <div className="section-header">
            <h2 className="section-title">Your Learning Journey</h2>
            <p className="section-description">
              Structured paths designed to take you from zero to hero
            </p>
          </div>
          <div className="path-steps">
            <div className="path-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Foundation</h3>
                <p className="step-description">
                  Master the basics of HTML, CSS, JavaScript, and Node.js fundamentals
                </p>
              </div>
            </div>
            <div className="path-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">Frontend</h3>
                <p className="step-description">
                  Dive deep into React.js, state management, and modern frontend development
                </p>
              </div>
            </div>
            <div className="path-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Backend</h3>
                <p className="step-description">
                  Build robust APIs with Express.js, MongoDB, and authentication systems
                </p>
              </div>
            </div>
            <div className="path-step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3 className="step-title">Integration</h3>
                <p className="step-description">
                  Connect frontend and backend, deploy applications, and learn DevOps basics
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* CTA Section */}
      {deferBelowFold && (
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <div className="cta-icon">🚀</div>
            <h2 className="cta-title">Ready to Transform Your Career?</h2>
            <p className="cta-description">
              Join thousands of developers who have mastered the MERN stack and built amazing applications. 
              Start your journey today and unlock your potential.
            </p>
            <div className="cta-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">✅</span>
                <span>Free to start</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✅</span>
                <span>Learn at your own pace</span>
              </div>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="btn-primary large">
                <span>🎯</span>
                Start Learning Now
              </Link>
              <Link to="/login" className="btn-secondary large">
                <span>👋</span>
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Footer */}
      {deferBelowFold && (
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="brand-icon">📚</div>
            <span className="brand-text">MERN Quest</span>
          </div>
          <div className="footer-links">
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="/courses" className="footer-link">Courses</Link>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2024 MERN Quest. All rights reserved.</p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default Landing;
