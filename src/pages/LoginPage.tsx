import { useState } from 'react';
import tractusLogo from '../assets/Tractus.svg';
import sideImage from '../assets/a-group-of-young-people-sitting-around-a-rounded-t.svg';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="login-page">
      {/* Left Form Section */}
      <div className="login-form-section">
        <div className="login-header">
          <img src={tractusLogo} alt="Tractus Logo" className="brand-logo" />
        </div>

        <div className="form-container">
          <h1 className="form-title">
            {isLogin ? 'Holla,\nWelcome Back' : 'Hello,\nJoin Tractus'}
          </h1>
          <p className="form-subtitle">
            {isLogin ? 'Hey, welcome back to your special place' : 'Create an account to join our amazing community'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <input type="text" placeholder="Username" required />
              </div>
            )}
            <div className="input-group">
              <input type={isLogin ? "text" : "email"} placeholder={isLogin ? "johndoe@gmail.com" : "Email Address"} required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="••••••••••••" required />
            </div>
            {!isLogin && (
              <div className="input-group">
                <input type="password" placeholder="Confirm Password (••••••••••••)" required />
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="login-image-section">
        <img src={sideImage} alt="Community Illustration" className="side-illustration" />
      </div>
    </div>
  )
}
