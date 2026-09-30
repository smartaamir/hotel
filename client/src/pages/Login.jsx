import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import '../styles/auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Client-side JWT Decoder Helper
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token', error);
    return null;
  }
};

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Google OAuth Auto-Registration and Real Integration States
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleCredentialResponse = async (response) => {
    setGoogleSubmitting(true);
    setError('');
    
    const decoded = decodeJwt(response.credential);
    if (!decoded) {
      setError('Google Sign-In Token decoding failed.');
      setGoogleSubmitting(false);
      return;
    }

    // Auto-link with a default PKR phone prefix for registry records
    const pkPrefixes = ['0300', '0312', '0321', '0333', '0345'];
    const prefix = pkPrefixes[Math.floor(Math.random() * pkPrefixes.length)];
    const phone = `${prefix}${Math.floor(1000000 + Math.random() * 9000000)}`;

    const result = await loginWithGoogle(decoded.email, decoded.name, decoded.sub, phone);
    setGoogleSubmitting(false);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Google auth handshake failed.');
    }
  };
useEffect(() => {
  // Agar script pehle se mojood hai toh dobara load na karein
  if (document.getElementById('google-script')) return;

  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.id = 'google-script';
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
      
      // Button Render karein
      window.google.accounts.id.renderButton(
  document.getElementById('google-signin-btn-container'),
  { 
    theme: 'filled_black', 
    size: 'large', 
    width: Math.min(380, window.innerWidth - 80).toString(), // <--- Yeh formula use karein
    shape: 'pill',
    text: 'signin_with'
  }
);

      // Resize hone par dobara render karne ka code
      const handleResize = () => {
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn-container'),
          { 
            theme: 'filled_black', 
            size: 'large', 
            width: '100%', 
            shape: 'pill',
            text: 'signin_with'
          }
        );
      };
      window.addEventListener('resize', handleResize);
    }
  };
  
  document.head.appendChild(script);

  // Cleanup function
  return () => {
    // Script ko remove na karein taake dobara load na ho
  };
}, []);
  // useEffect(() => {
  //   // Dynamic integration of the Google Identity Services SDK
  //   const script = document.createElement('script');
  //   script.src = 'https://accounts.google.com/gsi/client';
  //   script.async = true;
  //   script.defer = true;
  //   script.onload = () => {
  //     if (window.google) {
  //       window.google.accounts.id.initialize({
  //         client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '109283019283-abcdef.apps.googleusercontent.com',
  //         callback: handleCredentialResponse
  //       });
  //       window.google.accounts.id.renderButton(
  //         document.getElementById('google-signin-btn-container'),
  //         { theme: 'outline', size: 'large', width: Math.min(380, window.innerWidth - 80).toString(), shape: 'pill' }
  //       );
  //     }
  //   };
  //   document.head.appendChild(script);

  //   return () => {
  //     try {
  //       document.head.removeChild(script);
  //     } catch (e) {
  //       // Safe check in case component unmounts after script loads
  //     }
  //   };
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    setError('');
    setSubmitting(true);

    const result = await login(email, password);

    setSubmitting(false);
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
    }
  };

  const autofill = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to manage your luxury stay or administrative panel</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="concierge@aurastay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
  <label htmlFor="password">Password</label>
  <div style={{ position: 'relative' }}>
    
    {/* Lock Icon (Left Side) */}
    <Lock size={16} style={styles.inputIcon} />
    
    {/* Password Input */}
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      className="form-control"
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{ paddingLeft: '40px', paddingRight: '40px' }} // Right side padding barha di taake text icon ke neeche na aaye
      required 
    />
    
    {/* Eye Icon (Right Side) */}
    <div 
      onClick={() => setShowPassword(!showPassword)} 
      style={{
        position: 'absolute',
        right: '15px',      // Right side se 15px ka gap
        top: '50%',         // Top se 50% (center)
        transform: 'translateY(-50%)', // Perfect center karne ke liye
        cursor: 'pointer',
        color: '#888',      // Icon ka color (aap apni theme ke hisaab se change kar sakte hain)
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
    </div>

  </div>
</div>

          <button type="submit" className="btn-gold btn-auth-submit" disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.dividerRow}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>or</span>
          <span style={styles.dividerLine}></span>
        </div>

        {/* Real Google Sign-In Button Container */}
        <div style={{ marginBottom: '14px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div id="google-signin-btn-container" style={{ width: '100%', minHeight: '40px' }}></div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Reserve one here</Link>
        </div>

        <div className="demo-accounts">
          <div className="demo-title">🎓 Developer Evaluation Credentials</div>
          <div className="demo-account-row">
            <span>Customer Account:</span>
            <button 
              className="btn-outline" 
              style={styles.autofillBtn}
              onClick={() => autofill('guest@aurastay.com', 'guest123')}
            >
              Autofill Guest
            </button>
          </div>
          <div className="demo-account-row">
            <span>Administrator Account:</span>
            <button 
              className="btn-outline" 
              style={styles.autofillBtn}
              onClick={() => autofill('admin@aurastay.com', 'admin123')}
            >
              Autofill Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  autofillBtn: {
    padding: '4px 10px',
    fontSize: '0.7rem',
    borderRadius: '6px',
    border: '1px solid rgba(212, 175, 55, 0.4)',
    color: 'var(--gold)',
    background: 'transparent',
    cursor: 'pointer',
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    margin: '16px 0',
  },
  dividerLine: {
    height: '1px',
    background: 'var(--border-color)',
    flexGrow: 1,
  },
  dividerText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },

};

// Add keyframe styling inside the document head for CSS
const styleSheet = `
  .google-account-btn:hover {
    background: var(--gold-light) !important;
    border-color: var(--gold) !important;
  }
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(styleSheet));
  document.head.appendChild(style);
}

export default Login;
