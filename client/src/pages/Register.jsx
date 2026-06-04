import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Shield } from 'lucide-react';
import '../styles/auth.css';

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

const Register = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Google OAuth Auto-Registration Simulation
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
    // Dynamic integration of the Google Identity Services SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '109283019283-abcdef.apps.googleusercontent.com',
          callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn-container'),
          { theme: 'outline', size: 'large', width: Math.min(380, window.innerWidth - 80).toString(), shape: 'pill' }
        );
      }
    };
    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        // Safe check in case component unmounts after script loads
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return setError('Please fill in all required fields (Name, Email, Password).');
    }

    // Pakistani mobile number regex validation:
    const cleanPhone = phone.replace(/[-\s()]/g, ''); // strip visual spacings
    if (cleanPhone) {
      const pakPhoneRegex = /^((\+92)|(92))?3\d{9}$|^03\d{9}$/;
      if (!pakPhoneRegex.test(cleanPhone)) {
        return setError('Please enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567).');
      }
    } else {
      return setError('Phone number is required to register stay registries.');
    }

    setError('');
    setSubmitting(true);

    const role = isAdmin ? 'admin' : 'customer';
    const result = await register(name, email, password, phone, role);

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

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Begin your immersion in absolute comfort and bespoke hospitality</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={styles.inputIcon} />
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Bilal Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="bilal.khan@haven.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Mobile Number *</label>
            <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <Phone size={16} style={styles.inputIcon} />
              <input
                id="phone"
                type="tel"
                className="form-control"
                maxLength={11}
                placeholder="0300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Supports mobile formats like 03001234567 or +923001234567.
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Admin Evaluation Checkbox */}
          <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0', cursor: 'pointer' }}>
            <input
              id="isAdmin"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--gold)',
                cursor: 'pointer',
                WebkitAppearance: 'checkbox',
                appearance: 'checkbox'
              }}
            />
            <label htmlFor="isAdmin" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gold)', userSelect: 'none' }}>
              <Shield size={14} /> Register as Administrative Operator (For Evaluation)
            </label>
          </div>

          <button type="submit" className="btn-gold btn-auth-submit" disabled={submitting}>
            {submitting ? 'Registering...' : 'Submit Credentials'}
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
          Already registered? <Link to="/login">Sign In instead</Link>
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
export default Register;
