import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components & Common UI
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Dining from './pages/Dining';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Guard for Normal Customer Pages
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={styles.spinnerBox}>
        <div style={styles.spinner}></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Guard for Admin-only Pages
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.spinnerBox}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function AppContent() {
  return (
    <Router>
      <ScrollToTop />
      <div style={styles.appContainer}>
        <Navbar />
        <main style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Guest Protected Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Guest Protected Checkout */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />

            {/* Admin Command Center */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  mainContent: {
    flexGrow: 1,
  },
  spinnerBox: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'var(--bg-primary)',
  },
  spinner: {
    width: '45px',
    height: '45px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--gold)',
    borderRadius: '50%',
    animation: 'spin 1s infinite linear',
  },
};
