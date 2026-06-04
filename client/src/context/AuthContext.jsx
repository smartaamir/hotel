import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set default auth headers
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      verifyToken(token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async (authToken) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token expired or invalid
        logout();
      }
    } catch (error) {
      console.error('Failed to verify token', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
        });
        return { success: true, role: data.role };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error, please try again' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
        });
        return { success: true, role: data.role };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error, please try again' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (email, name, googleId, phone) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, googleId, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
        });
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Google authentication failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error, please try again' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUserProfileState = (userData, newToken) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('token', newToken);
    }
    setUser(userData);
  };

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout, getAuthHeaders, updateUserProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
