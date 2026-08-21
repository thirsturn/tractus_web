import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tractusLogo from '../../assets/Tractus.svg';
import sideImage from '../../assets/a-group-of-young-people-sitting-around-a-rounded-t.svg';
import './LoginPage.css';
import authService from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState(''); // Used for login username AND register username
  const [email, setEmail] = useState(''); // Used only for register
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // Used only for register
  const [lastName, setLastName] = useState(''); // Used only for register
  const [phoneNumber, setPhoneNumber] = useState(''); // Used only for register
  const [dateOfBirth, setDateOfBirth] = useState(''); // Used only for register
  const [gender, setGender] = useState(''); // Used only for register
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        // Login Flow
        const response = await authService.login({ username, password });
        login(response.token, response.user);
        navigate('/'); // Redirect to Dashboard
      } else {
        // Register Flow
        await authService.register({ username, email, passwordHash: password, firstName, lastName, phoneNumber, dateOfBirth, gender });
        // Automatically login after successful registration
        const response = await authService.login({ username, password });
        login(response.token, response.user);
        navigate('/'); // Redirect to Dashboard
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(''); // Clear errors when switching modes
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
            {error && <div style={{ color: '#fa477a', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
            
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            
            {!isLogin && (
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="input-group">
                <input
                  type="tel"
                  placeholder="Telephone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="input-group">
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div className="input-group">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="" disabled>Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            )}

            <div className="input-group">
              <input
                type="password"
                placeholder="Password (••••••••••••)"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            {!isLogin && (
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Confirm Password (••••••••••••)" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
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

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" className="toggle-btn" onClick={toggleMode}>
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
