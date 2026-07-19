import { useState } from 'react';
import tractusLogo from '../assets/Tractus.svg';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={tractusLogo} alt="Tractus Logo" className="logo" />
        <h2>{isLogin ? 'Welcome Back' : 'Join Tractus'}</h2>
        <p className="subtitle">
          {isLogin ? 'Enter your details to access your account' : 'Create an account to join the community'}
        </p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Username</label>
              <input type="text" placeholder="johndoe" required />
            </div>
          )}
          <div className="input-group">
            <label>{isLogin ? 'Username' : 'Email'}</label>
            <input type={isLogin ? "text" : "email"} placeholder={isLogin ? "johndoe" : "john@example.com"} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          
          <button type="submit" className="primary-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="toggle-mode">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" className="text-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
