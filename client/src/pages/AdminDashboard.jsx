import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { 
  DollarSign, Hotel, CalendarCheck, ShieldAlert, 
  Check, UserCheck, RefreshCw, Sparkles, ChefHat, Bell, AlertTriangle
} from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/room-grid.css';

const AdminDashboard = () => {
  const { user, getAuthHeaders, updateUserProfileState } = useAuth();
  const location = useLocation();

  // Primary Data States
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Available room selections for pending approvals
  const [availableRoomsMap, setAvailableRoomsMap] = useState({});
  const [selectedRoomsForAssign, setSelectedRoomsForAssign] = useState({});

  // Matrix Filter and Analytics Timeline States
  const [matrixFilter, setMatrixFilter] = useState('All'); // 'All', 'Vacant', 'Occupied', 'Cleaning', 'Maintenance'
  const [analyticsPeriod, setAnalyticsPeriod] = useState('annually'); // 'weekly', 'monthly', 'annually'
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'settings'

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'settings') {
      setActiveTab('settings');
    } else {
      setActiveTab('analytics');
    }
  }, [location]);

  // Admin Profile settings states
  const [profileName, setProfileName] = useState(user ? user.name : '');
  const [profileEmail, setProfileEmail] = useState(user ? user.email : '');
  const [profilePhone, setProfilePhone] = useState(user ? user.phone : '');
  const [profilePassword, setProfilePassword] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Admin Account Management Console States
  const [adminsList, setAdminsList] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [submittingNewAdmin, setSubmittingNewAdmin] = useState(false);
  const [newAdminError, setNewAdminError] = useState('');
  const [newAdminSuccess, setNewAdminSuccess] = useState(false);

  // Operational Simulation toggles
  const [autoAllocateRecommend, setAutoAllocateRecommend] = useState(true);
  const [maintenanceAutoAlert, setMaintenanceAutoAlert] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isReceiptFullScreen, setIsReceiptFullScreen] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Quietly auto-refresh booking list and service requests every 8 seconds in the background
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAdminData(true);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminsList = async () => {
    setAdminsLoading(true);
    try {
      const response = await fetch('/api/auth/admins', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAdminsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch admins list', err);
    } finally {
      setAdminsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchAdminsList();
    }
  }, [activeTab]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setNewAdminError('');
    setNewAdminSuccess(false);
    setSubmittingNewAdmin(true);

    const cleanPhone = newAdminPhone.replace(/[-\s()]/g, '');
    const pakPhoneRegex = /^(?:(?:\+92|92)?3\d{9}|03\d{9})$/;
    if (!pakPhoneRegex.test(cleanPhone)) {
      setNewAdminError('Please enter a valid Pakistani mobile number (e.g. 03001234567).');
      setSubmittingNewAdmin(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/admins', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newAdminName,
          email: newAdminEmail,
          phone: cleanPhone,
          password: newAdminPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNewAdminSuccess(true);
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPhone('');
        setNewAdminPassword('');
        fetchAdminsList();
      } else {
        setNewAdminError(data.message || 'Failed to create administrative account.');
      }
    } catch (err) {
      setNewAdminError('Network error, please try again.');
    } finally {
      setSubmittingNewAdmin(false);
    }
  };

  const handleRemoveAdmin = async (adminId, adminName) => {
    if (adminId === user._id) {
      alert('Security Protocol: You cannot terminate your own active console session.');
      return;
    }

    if (!window.confirm(`Are you absolutely sure you want to terminate administrative access for "${adminName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/admins/${adminId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('Administrator account removed successfully.');
        fetchAdminsList();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove administrative operator.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during deletion.');
    }
  };

  const fetchAdminData = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      // 1. Fetch Rooms
      const roomsRes = await fetch('/api/rooms');
      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      } else {
        setRooms([]);
      }

      // 2. Fetch Bookings
      const bookingsRes = await fetch('/api/bookings/all-bookings', {
        headers: getAuthHeaders()
      });
      let bookingsData = [];
      if (bookingsRes.ok) {
        bookingsData = await bookingsRes.json();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } else {
        setBookings([]);
      }

      // 3. Fetch Service Requests
      const requestsRes = await fetch('/api/services/all-requests', {
        headers: getAuthHeaders()
      });
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(Array.isArray(requestsData) ? requestsData : []);
      } else {
        setRequests([]);
      }

      // 4. Pre-fetch available rooms for all pending bookings
      const pending = Array.isArray(bookingsData) ? bookingsData.filter((b) => b.status === 'Pending Approval') : [];
      const roomMap = {};
      for (const b of pending) {
        try {
          const availRes = await fetch(`/api/bookings/${b._id}/available-rooms`, {
            headers: getAuthHeaders()
          });
          if (availRes.ok) {
            const availRooms = await availRes.json();
            roomMap[b._id] = Array.isArray(availRooms) ? availRooms : [];
          }
        } catch (err) {
          console.error(err);
        }
      }
      setAvailableRoomsMap(roomMap);

    } catch (error) {
      console.error('Failed to load admin logs', error);
      setRooms([]);
      setBookings([]);
      setRequests([]);
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  // Calculations based on filtered bookings
  const periodBookings = Array.isArray(bookings) ? bookings.filter((b) => {
    if (b.status === 'Cancelled') return false;
    const bDate = new Date(b.createdAt || b.checkInDate);
    const now = new Date();
    const diffTime = now - bDate; // Time difference in ms
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (analyticsPeriod === 'weekly') {
      return diffDays >= 0 && diffDays <= 7;
    } else if (analyticsPeriod === 'monthly') {
      return diffDays >= 0 && diffDays <= 30;
    } else {
      return diffDays >= 0 && diffDays <= 365; // Annually
    }
  }) : [];

  const periodRevenue = periodBookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const periodReservationsCount = periodBookings.length;

  const occupancyRate = (Array.isArray(rooms) && rooms.length > 0)
    ? Math.round((rooms.filter((r) => r.status === 'Occupied').length / rooms.length) * 100) 
    : 0;

  const pendingApprovals = Array.isArray(bookings) ? bookings.filter((b) => b.status === 'Pending Approval').length : 0;
  const activeServiceRequests = Array.isArray(requests) ? requests.filter((r) => r.status !== 'Completed').length : 0;

  const filteredRooms = Array.isArray(rooms) ? rooms.filter((room) => {
    if (matrixFilter === 'All') return true;
    return room.status === matrixFilter;
  }) : [];

  // Dynamic Charting Data based on selected period
  const getChartData = () => {
    const now = new Date();
    const dataPoints = [];
    const labels = [];
    
    if (analyticsPeriod === 'weekly') {
      // Past 7 Days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateKey = d.toDateString();
        
        const dayRevenue = bookings
          .filter(b => b.paymentStatus === 'Paid' && b.status !== 'Cancelled')
          .filter(b => {
            const bDate = new Date(b.createdAt || b.checkInDate);
            return bDate.toDateString() === dateKey;
          })
          .reduce((sum, b) => sum + b.totalPrice, 0);
          
        dataPoints.push(dayRevenue);
        labels.push(dayStr);
      }
    } else if (analyticsPeriod === 'monthly') {
      // Past 4 Weeks
      for (let i = 3; i >= 0; i--) {
        const start = new Date();
        start.setDate(now.getDate() - (i + 1) * 7);
        const end = new Date();
        end.setDate(now.getDate() - i * 7);
        
        const label = `Wk ${4 - i}`;
        const weekRevenue = bookings
          .filter(b => b.paymentStatus === 'Paid' && b.status !== 'Cancelled')
          .filter(b => {
            const bDate = new Date(b.createdAt || b.checkInDate);
            return bDate >= start && bDate < end;
          })
          .reduce((sum, b) => sum + b.totalPrice, 0);
          
        dataPoints.push(weekRevenue);
        labels.push(label);
      }
    } else {
      // Annually - Past 6 Months
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(now.getMonth() - i);
        const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
        const monthVal = d.getMonth();
        const yearVal = d.getFullYear();
        
        const monthRevenue = bookings
          .filter(b => b.paymentStatus === 'Paid' && b.status !== 'Cancelled')
          .filter(b => {
            const bDate = new Date(b.createdAt || b.checkInDate);
            return bDate.getMonth() === monthVal && bDate.getFullYear() === yearVal;
          })
          .reduce((sum, b) => sum + b.totalPrice, 0);
          
        dataPoints.push(monthRevenue);
        labels.push(monthStr);
      }
    }
    
    const maxVal = Math.max(...dataPoints, 10000); // minimum scale is 10k PKR
    const scaledPoints = dataPoints.map(val => {
      const percentage = val / maxVal;
      return 125 - (percentage * 105);
    });
    
    return { dataPoints, labels, scaledPoints, maxVal };
  };

  const { dataPoints, labels, scaledPoints, maxVal } = getChartData();

  const getSvgPaths = () => {
    if (scaledPoints.length === 0) return { points: [], polylinePoints: '', areaPath: '' };
    
    const xStep = (380 - 20) / (scaledPoints.length - 1);
    const points = scaledPoints.map((y, index) => {
      const x = 20 + index * xStep;
      return { x, y };
    });
    
    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const areaPath = `M${firstX},125 ` + points.map(p => `L${p.x},${p.y}`).join(' ') + ` L${lastX},125 Z`;
    
    return { points, polylinePoints, areaPath };
  };

  const { points: svgPoints, polylinePoints, areaPath } = getSvgPaths();

  const formatCompactPKR = (value) => {
    if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(1)}L`; // Lakhs
    } else if (value >= 1000) {
      return `Rs. ${(value / 1000).toFixed(0)}k`;
    }
    return `Rs. ${value}`;
  };

  const getCategoryDemandData = () => {
    const counts = {
      'Single Room': 0,
      'Double Room': 0,
      'Deluxe Suite': 0,
      'Presidential Suite': 0
    };
    
    periodBookings.forEach(b => {
      if (counts[b.roomType] !== undefined) {
        counts[b.roomType]++;
      }
    });
    
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    
    const percentages = {};
    if (total === 0) {
      percentages['Single Room'] = 45;
      percentages['Double Room'] = 60;
      percentages['Deluxe Suite'] = 75;
      percentages['Presidential Suite'] = 85;
    } else {
      Object.keys(counts).forEach(key => {
        percentages[key] = Math.round((counts[key] / total) * 100);
      });
    }
    
    return percentages;
  };

  const categoryPercentages = getCategoryDemandData();

  const getBarCoords = (percent) => {
    const height = (percent / 100) * 105;
    const y = 125 - height;
    return { y, height };
  };

  // Toggle Physical Room Status Quickly
  const handleRoomStatusChange = async (roomId, newStatus) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAdminData();
      } else {
        alert('Failed to update room status.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Assign Room & Approve
  const handleAssignAndApprove = async (bookingId) => {
    const roomId = selectedRoomsForAssign[bookingId];
    if (!roomId) {
      alert('Please select an available physical room number.');
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/assign-approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ roomId })
      });

      if (response.ok) {
        alert('Reservation approved and room assigned successfully!');
        fetchAdminData();
      } else {
        const errorData = await response.json();
        alert(`Failed to approve: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Manage Stay Controls (Check-in, Check-out, Cancel)
  const handleCheckIn = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/check-in`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        alert('Guest marked as Checked-In. Suite status set to Occupied.');
        fetchAdminData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/check-out`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        alert('Guest marked as Checked-Out. Suite status set to Cleaning.');
        fetchAdminData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Manage Guest Services
  const handleServiceStatusChange = async (requestId, nextStatus) => {
    try {
      const response = await fetch(`/api/services/${requestId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);
    setSubmittingProfile(true);

    const cleanPhone = profilePhone.replace(/[-\s()]/g, '');
    const pakPhoneRegex = /^((\+92)|(92))?3\d{9}$|^03\d{9}$/;
    if (!pakPhoneRegex.test(cleanPhone)) {
      setProfileError('Please enter a valid Pakistani mobile number (e.g. 03001234567).');
      setSubmittingProfile(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
          phone: cleanPhone,
          password: profilePassword || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        updateUserProfileState({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone
        }, data.token);
        setProfileSuccess(true);
        setProfilePassword('');
      } else {
        setProfileError(data.message || 'Failed to update admin profile.');
      }
    } catch (err) {
      setProfileError('Network error, please try again.');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const getRoomClass = (status) => {
    switch (status) {
      case 'Vacant': return 'room-vacant';
      case 'Occupied': return 'room-occupied';
      case 'Cleaning': return 'room-cleaning';
      case 'Maintenance': return 'room-maintenance';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending Approval': return 'badge-pending';
      case 'Approved': return 'badge-success';
      case 'Checked In': return 'badge-success';
      case 'Checked Out': return 'badge-success';
      case 'Cancelled': return 'badge-danger';
      default: return '';
    }
  };

  return (
    <div className="dashboard-page auth-container">
      <div className="container" style={{ marginTop: '50px' }}>
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <span style={{ color: 'var(--gold)', fontWeight: '600', letterSpacing: '1px', fontSize: '0.8rem' }}>COMMAND CENTER</span>
            <h1 className="text-[1.6rem] sm:text-[2.2rem]" style={{ fontFamily: 'var(--font-title)', marginTop: '4px' }}>
              Administrative Operator Console
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Audit resort earnings, assign physical room allocations, toggle suite cleanliness, and process active stay workflows.
            </p>
          </div>
          <button onClick={fetchAdminData} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', height: '42px' }}>
            <RefreshCw size={14} /> Sync Systems
          </button>
        </div>

        {/* Admin Dashboard Tab Selector */}
        <div className="flex gap-6 border-b border-[var(--border-color)] mb-8 mt-2.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button 
            onClick={() => setActiveTab('analytics')}
            style={{
              ...styles.tabBtn,
              borderBottom: activeTab === 'analytics' ? '3px solid var(--gold)' : '3px solid transparent',
              color: activeTab === 'analytics' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'analytics' ? '600' : '400'
            }}
          >
            Analytics & Operations
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            style={{
              ...styles.tabBtn,
              borderBottom: activeTab === 'settings' ? '3px solid var(--gold)' : '3px solid transparent',
              color: activeTab === 'settings' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'settings' ? '600' : '400'
            }}
          >
            Console Settings
          </button>
        </div>

        {loading ? (
          <div style={styles.loader}>
            <div style={styles.spinner}></div>
            <span>Synchronizing ledger matrices...</span>
          </div>
        ) : (
          <>
            {activeTab === 'analytics' ? (
              <>
                {/* Period Selectors */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Ledger filter: <strong style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{analyticsPeriod} range</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <button 
                      onClick={() => setAnalyticsPeriod('weekly')}
                      className={`period-btn ${analyticsPeriod === 'weekly' ? 'active' : ''}`}
                      style={{
                        background: analyticsPeriod === 'weekly' ? 'var(--gold-gradient)' : 'transparent',
                        color: analyticsPeriod === 'weekly' ? '#000' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '6px 14px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Weekly
                    </button>
                    <button 
                      onClick={() => setAnalyticsPeriod('monthly')}
                      className={`period-btn ${analyticsPeriod === 'monthly' ? 'active' : ''}`}
                      style={{
                        background: analyticsPeriod === 'monthly' ? 'var(--gold-gradient)' : 'transparent',
                        color: analyticsPeriod === 'monthly' ? '#000' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '6px 14px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setAnalyticsPeriod('annually')}
                      className={`period-btn ${analyticsPeriod === 'annually' ? 'active' : ''}`}
                      style={{
                        background: analyticsPeriod === 'annually' ? 'var(--gold-gradient)' : 'transparent',
                        color: analyticsPeriod === 'annually' ? '#000' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '6px 14px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Annually
                    </button>
                  </div>
                </div>

                {/* 1. Statistics Cards */}
                <div className="admin-stats-row">
                  <div style={styles.statCard} className="glass-panel">
                    <div style={styles.statHeader}>
                      <span style={styles.statLabel}>Revenue ({analyticsPeriod})</span>
                      <DollarSign size={20} style={styles.statIcon} />
                    </div>
                    <div style={styles.statVal}>Rs. {periodRevenue.toLocaleString()}</div>
                  </div>

                  <div style={styles.statCard} className="glass-panel">
                    <div style={styles.statHeader}>
                      <span style={styles.statLabel}>Period Reservations</span>
                      <CalendarCheck size={20} style={styles.statIcon} />
                    </div>
                    <div style={styles.statVal}>{periodReservationsCount}</div>
                  </div>

                  <div style={styles.statCard} className="glass-panel">
                    <div style={styles.statHeader}>
                      <span style={styles.statLabel}>Occupancy Rate</span>
                      <Hotel size={20} style={styles.statIcon} />
                    </div>
                    <div style={styles.statVal}>{occupancyRate}%</div>
                  </div>

                  <div style={styles.statCard} className="glass-panel">
                    <div style={styles.statHeader}>
                      <span style={styles.statLabel}>Pending Approvals</span>
                      <ShieldAlert size={20} style={styles.statIcon} />
                    </div>
                    <div style={{ ...styles.statVal, color: pendingApprovals > 0 ? 'var(--amber)' : 'var(--text-primary)' }}>
                      {pendingApprovals}
                    </div>
                  </div>
                </div>

                {/* 2. Visual Analytics Charts */}
                <div className="admin-charts-row">
                  {/* Earnings Trend Area chart */}
                  <div className="chart-card glass-panel">
                    <div style={styles.chartHeader}>
                      <h3 style={styles.chartTitle}>Resort Earnings Trend</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {analyticsPeriod === 'weekly' ? 'Past 7 Days' : analyticsPeriod === 'monthly' ? 'Past 4 Weeks' : 'Past 6 Months'}
                      </span>
                    </div>
                    <div className="chart-svg-container">
                      <svg viewBox="0 0 400 150" width="100%" height="100%" style={{ overflow: 'visible' }}>
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35"/>
                            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        {/* Grid Lines */}
                        <line x1="0" y1="25" x2="400" y2="25" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="0" y1="75" x2="400" y2="75" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="0" y1="125" x2="400" y2="125" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4 4" />
                        
                        {/* Dynamic Path & Fill */}
                        {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
                        {polylinePoints && <polyline points={polylinePoints} fill="none" stroke="var(--gold)" strokeWidth="2.5" />}
                        
                        {/* Dynamic Circles and PKR badges */}
                        {svgPoints.map((pt, idx) => (
                          <g key={idx}>
                            <circle cx={pt.x} cy={pt.y} r="3.5" fill="var(--bg-secondary)" stroke="var(--gold)" strokeWidth="2" />
                            {dataPoints[idx] > 0 && (
                              <text 
                                x={pt.x} 
                                y={pt.y - 8} 
                                fontSize="7" 
                                fill="var(--gold)" 
                                textAnchor="middle"
                                fontWeight="600"
                              >
                                {formatCompactPKR(dataPoints[idx])}
                              </text>
                            )}
                          </g>
                        ))}
                        
                        {/* Dynamic X-Axis Labels */}
                        {labels.map((lbl, idx) => {
                          const xStep = (380 - 20) / (labels.length - 1);
                          const x = 20 + idx * xStep;
                          return (
                            <text key={idx} x={x} y="145" fontSize="8" fill="var(--text-muted)" textAnchor="middle">
                              {lbl}
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Occupancy bar chart */}
                  <div className="chart-card glass-panel">
                    <div style={styles.chartHeader}>
                      <h3 style={styles.chartTitle}>Demand By Category</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {analyticsPeriod} share
                      </span>
                    </div>
                    <div className="chart-svg-container">
                      <svg viewBox="0 0 400 150" width="100%" height="100%" style={{ overflow: 'visible' }}>
                        {/* Bar 1 (Single) */}
                        {(() => {
                          const p = categoryPercentages['Single Room'];
                          const coords = getBarCoords(p);
                          return (
                            <>
                              <rect x="30" y={coords.y} width="30" height={coords.height} rx="3" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                              <text x="45" y={coords.y - 6} fontSize="9" fill="var(--text-secondary)" textAnchor="middle">{p}%</text>
                              <text x="45" y="140" fontSize="8" fill="var(--text-muted)" textAnchor="middle">Single</text>
                            </>
                          );
                        })()}

                        {/* Bar 2 (Double) */}
                        {(() => {
                          const p = categoryPercentages['Double Room'];
                          const coords = getBarCoords(p);
                          return (
                            <>
                              <rect x="130" y={coords.y} width="30" height={coords.height} rx="3" fill="var(--bg-tertiary)" stroke="var(--border-color)" />
                              <text x="145" y={coords.y - 6} fontSize="9" fill="var(--text-secondary)" textAnchor="middle">{p}%</text>
                              <text x="145" y="140" fontSize="8" fill="var(--text-muted)" textAnchor="middle">Double</text>
                            </>
                          );
                        })()}

                        {/* Bar 3 (Deluxe Suite) */}
                        {(() => {
                          const p = categoryPercentages['Deluxe Suite'];
                          const coords = getBarCoords(p);
                          return (
                            <>
                              <rect x="230" y={coords.y} width="30" height={coords.height} rx="3" fill="var(--gold-light)" stroke="var(--gold-glow)" />
                              <rect x="230" y={coords.y} width="30" height={coords.height} rx="3" fill="none" stroke="var(--gold)" strokeWidth="1" />
                              <text x="245" y={coords.y - 6} fontSize="9" fill="var(--gold)" textAnchor="middle" fontWeight="600">{p}%</text>
                              <text x="245" y="140" fontSize="8" fill="var(--text-muted)" textAnchor="middle">Deluxe</text>
                            </>
                          );
                        })()}

                        {/* Bar 4 (Presidential Suite) */}
                        {(() => {
                          const p = categoryPercentages['Presidential Suite'];
                          const coords = getBarCoords(p);
                          return (
                            <>
                              <rect x="330" y={coords.y} width="30" height={coords.height} rx="3" fill="var(--gold-gradient)" />
                              <text x="345" y={coords.y - 6} fontSize="9" fill="var(--gold)" textAnchor="middle" fontWeight="700">{p}%</text>
                              <text x="345" y="140" fontSize="8" fill="var(--text-muted)" textAnchor="middle">Presidential</text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3. Physical Room Grid Status Map */}
                <div className="table-card glass-panel" style={{ marginBottom: '40px' }}>
                  <div style={styles.chartHeader}>
                    <div>
                      <h3 style={styles.chartTitle}>Physical Suite Matrix Map</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Showing {filteredRooms.length} of {rooms.length} Suites ({matrixFilter} Filter Active)
                      </div>
                    </div>
                    <div style={styles.legend}>
                      <button 
                        onClick={() => setMatrixFilter('All')} 
                        className={`legend-btn ${matrixFilter === 'All' ? 'active' : ''}`}
                        style={{
                          ...styles.legendBtn,
                          border: matrixFilter === 'All' ? '1px solid var(--gold)' : '1px solid var(--border-color)',
                          background: matrixFilter === 'All' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        }}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setMatrixFilter('Vacant')} 
                        className={`legend-btn ${matrixFilter === 'Vacant' ? 'active' : ''}`}
                        style={{
                          ...styles.legendBtn,
                          border: matrixFilter === 'Vacant' ? '1px solid #10b981' : '1px solid var(--border-color)',
                          background: matrixFilter === 'Vacant' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                        }}
                      >
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginRight: '6px' }}></span> Vacant
                      </button>
                      <button 
                        onClick={() => setMatrixFilter('Occupied')} 
                        className={`legend-btn ${matrixFilter === 'Occupied' ? 'active' : ''}`}
                        style={{
                          ...styles.legendBtn,
                          border: matrixFilter === 'Occupied' ? '1px solid #f43f5e' : '1px solid var(--border-color)',
                          background: matrixFilter === 'Occupied' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                        }}
                      >
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', marginRight: '6px' }}></span> Occupied
                      </button>
                      <button 
                        onClick={() => setMatrixFilter('Cleaning')} 
                        className={`legend-btn ${matrixFilter === 'Cleaning' ? 'active' : ''}`}
                        style={{
                          ...styles.legendBtn,
                          border: matrixFilter === 'Cleaning' ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                          background: matrixFilter === 'Cleaning' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                        }}
                      >
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginRight: '6px' }}></span> Cleaning
                      </button>
                      <button 
                        onClick={() => setMatrixFilter('Maintenance')} 
                        className={`legend-btn ${matrixFilter === 'Maintenance' ? 'active' : ''}`}
                        style={{
                          ...styles.legendBtn,
                          border: matrixFilter === 'Maintenance' ? '1px solid #64748b' : '1px solid var(--border-color)',
                          background: matrixFilter === 'Maintenance' ? 'rgba(100, 116, 139, 0.15)' : 'transparent',
                        }}
                      >
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#64748b', marginRight: '6px' }}></span> Maintaining
                      </button>
                    </div>
                  </div>

                  {filteredRooms.length > 0 ? (
                    <div className="room-matrix-grid">
                      {filteredRooms.map((room) => (
                        <div key={room._id} className={`room-box ${getRoomClass(room.status)}`}>
                          <div style={styles.roomNoText}>{room.roomNumber}</div>
                          <div style={styles.roomTypeMini}>{room.type.split(' ')[0]}</div>
                          
                          {/* Status inline quick toggler */}
                          <select
                            className="room-status-select"
                            value={room.status}
                            onChange={(e) => handleRoomStatusChange(room._id, e.target.value)}
                          >
                            <option value="Vacant">Vacant</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Maintenance">Maintenance</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                      No suites currently registered in the "{matrixFilter}" state category.
                    </div>
                  )}
                </div>

                {/* 4. Split Dashboard Panel (Approvals vs Services) */}
                <div className="dashboard-grid" style={{ marginBottom: '40px' }}>
                  {/* Left Side: Booking Approval list */}
                  <div className="dashboard-left">
                    <h2 style={styles.sectionTitle}>Room Assignment Approval Queue</h2>
                    
                    {bookings.filter((b) => b.status === 'Pending Approval').length > 0 ? (
                      bookings.filter((b) => b.status === 'Pending Approval').map((booking) => {
                        const checkIn = new Date(booking.checkInDate);
                        const checkOut = new Date(booking.checkOutDate);
                        const available = availableRoomsMap[booking._id] || [];

                        return (
                          <div key={booking._id} className="approval-card glass-panel">
                            <div className="approval-top">
                              <div className="approval-client">
                                <h4>{booking.customer?.name || 'Alexander'}</h4>
                                <span>{booking.customer?.email} | {booking.customer?.phone || 'No phone'}</span>
                              </div>
                              <span style={styles.price}>Rs. {booking.totalPrice.toLocaleString()}</span>
                            </div>

                            <div className="approval-dates">
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Category:</span> <strong style={{ color: 'var(--text-primary)' }}>{booking.roomType}</strong>
                              </div>
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Dates:</span> <strong>{checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}</strong>
                              </div>
                            </div>

                            {/* Dining, Amenities and Payment Proof Row */}
                            <div className={`admin-booking-card-details grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${booking.paymentProof ? '4' : '3'} gap-[15px] mt-3.5 mb-3.5 border-t border-dashed border-[var(--border-color)] pt-3.5 text-[0.82rem]`}>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🍽️ Dining Plan</span>
                                <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>{booking.diningPlan || 'None'}</strong>
                              </div>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>✨ Amenities</span>
                                <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>
                                  {booking.extraAmenities && booking.extraAmenities.length > 0
                                    ? booking.extraAmenities.join(', ')
                                    : 'None'}
                                </strong>
                              </div>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💳 Payment Method</span>
                                <strong style={{ color: 'var(--gold)', display: 'block', marginTop: '2px' }}>
                                  {booking.paymentMethod} {booking.transactionId && `(${booking.transactionId})`}
                                </strong>
                              </div>
                              {booking.paymentProof && (
                                <div>
                                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>📄 Receipt Proof</span>
                                  <button
                                    onClick={() => setPreviewImage(booking.paymentProof)}
                                    style={styles.viewProofBtn}
                                    type="button"
                                  >
                                    Verify Receipt
                                  </button>
                                </div>
                              )}
                            </div>

                            {booking.guestNotes && (
                              <div style={styles.notesBox}>
                                <strong>Guest Notes:</strong> "{booking.guestNotes}"
                              </div>
                            )}

                            <div className="approval-actions">
                              <div className="approval-select-wrapper">
                                <label>Vacant physical Room Allocations</label>
                                <select
                                  className="form-control"
                                  value={selectedRoomsForAssign[booking._id] || ''}
                                  onChange={(e) => setSelectedRoomsForAssign({
                                    ...selectedRoomsForAssign,
                                    [booking._id]: e.target.value
                                  })}
                                >
                                  <option value="">Select vacant room number...</option>
                                  {available.map((r) => (
                                    <option key={r._id} value={r._id}>
                                      Room {r.roomNumber} ({r.status})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <button
                                onClick={() => handleAssignAndApprove(booking._id)}
                                className="btn-gold"
                                style={{ height: '45px', padding: '0 20px', marginTop: '22px' }}
                                disabled={!selectedRoomsForAssign[booking._id]}
                              >
                                <Check size={16} /> Approve & Assign
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={styles.emptyState} className="glass-panel">
                        <Check size={40} style={{ color: 'var(--emerald)' }} />
                        <h3>Approval Queue Clear</h3>
                        <p>There are currently no customer bookings awaiting room assignment or authorization.</p>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Active Service Requests */}
                  <div className="dashboard-right">
                    <h2 style={styles.sectionTitle}>In-Stay Service Orders</h2>
                    
                    {requests.filter((r) => r.status !== 'Completed').length > 0 ? (
                      <div style={styles.requestsStack}>
                        {requests.filter((r) => r.status !== 'Completed').map((req) => (
                          <div key={req._id} style={styles.requestCard} className="glass-panel">
                            <div style={styles.requestCardHeader}>
                              <div style={styles.requestType}>
                                {req.type === 'Room Service' ? <ChefHat size={16} /> : <Bell size={16} />}
                                <strong>{req.type}</strong>
                              </div>
                              <span className={`badge ${req.status === 'Pending' ? 'badge-pending' : 'badge-success'}`}>
                                {req.status}
                              </span>
                            </div>
                            <p style={styles.requestDetails}>"{req.details}"</p>
                            <div style={{ ...styles.requestFooter, borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
                              <span>Suite <strong>{req.roomNumber}</strong></span>
                              <span>Guest: {req.customer?.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                              {req.paymentProof && (
                                <button
                                  onClick={() => setPreviewImage(req.paymentProof)}
                                  className="btn-outline"
                                  style={{ padding: '6px 12px', fontSize: '0.7rem', color: 'var(--gold)', borderColor: 'var(--gold)' }}
                                >
                                  📷 Verify Receipt
                                </button>
                              )}
                              {req.status === 'Pending' && (
                                <button
                                  onClick={() => handleServiceStatusChange(req._id, 'In Progress')}
                                  className="btn-outline"
                                  style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                                >
                                  Dispatch
                                </button>
                              )}
                              <button
                                onClick={() => handleServiceStatusChange(req._id, 'Completed')}
                                className="btn-gold"
                                style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                              >
                                Complete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={styles.emptyStateRight} className="glass-panel">
                        <Sparkles size={32} style={{ color: 'var(--emerald)', marginBottom: '10px' }} />
                        <p>Guest request queue clear. Live service requests from in-stay guests will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Stay Registers Ledger */}
                <div className="table-card glass-panel">
                  <h3 style={styles.chartTitle}>Stay Registers Ledger</h3>
                  
                  {bookings.length > 0 ? (
                    <div className="table-wrapper">
                      <table className="luxury-table">
                        <thead>
                          <tr>
                            <th>Guest</th>
                            <th>Suite Category</th>
                            <th>Dates</th>
                            <th>Allocation</th>
                            <th>Status</th>
                            <th>Action Workflow</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((b) => {
                            const checkIn = new Date(b.checkInDate);
                            const checkOut = new Date(b.checkOutDate);

                            return (
                              <tr key={b._id}>
                                <td>
                                  <strong>{b.customer?.name || 'Alexander'}</strong>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customer?.email}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>💳 {b.paymentMethod}</span>
                                    {b.paymentProof && (
                                      <button 
                                        onClick={() => setPreviewImage(b.paymentProof)}
                                        style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.72rem', textDecoration: 'underline', padding: '0' }}
                                        type="button"
                                      >
                                        (View Receipt)
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <strong>{b.roomType}</strong>
                                  {b.diningPlan && b.diningPlan !== 'None' && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginTop: '4px' }}>
                                      🍽️ {b.diningPlan}
                                    </div>
                                  )}
                                  {b.extraAmenities && b.extraAmenities.length > 0 && (
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                      ✨ {b.extraAmenities.join(', ')}
                                    </div>
                                  )}
                                </td>
                                <td>{checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}</td>
                                <td>
                                  {b.assignedRoom ? (
                                    <strong style={{ color: 'var(--gold)' }}>Suite {b.assignedRoom.roomNumber}</strong>
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>None Assigned</span>
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${getStatusClass(b.status)}`}>
                                    {b.status}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    {b.status === 'Approved' && (
                                      <button
                                        onClick={() => handleCheckIn(b._id)}
                                        className="table-action-btn btn-gold"
                                      >
                                        Check-In
                                      </button>
                                    )}
                                    
                                    {b.status === 'Checked In' && (
                                      <button
                                        onClick={() => handleCheckOut(b._id)}
                                        className="table-action-btn btn-outline"
                                      >
                                        Check-Out
                                      </button>
                                    )}

                                    {(b.status === 'Pending Approval' || b.status === 'Approved') && (
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending stay date</span>
                                    )}

                                    {b.status === 'Checked Out' && (
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed Stay</span>
                                    )}

                                    {b.status === 'Cancelled' && (
                                      <span style={{ fontSize: '0.75rem', color: 'var(--rose)' }}>Cancelled</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)' }}>No stays registered.</div>
                  )}
                </div>
              </>
            ) : (
              /* Settings View */
              <>
                <div className="admin-settings-container grid grid-cols-1 md:grid-cols-2 gap-[30px] mb-10">
                  {/* Profile Form Card */}
                  <div className="glass-panel" style={{ padding: '30px' }}>
                    <h3 style={{ ...styles.chartTitle, marginBottom: '20px' }}>Admin Profile Settings</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                      Modify your administrative console identity, notification preferences, and password.
                    </p>
                    
                    {profileSuccess && (
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '12px', borderRadius: '6px', color: '#10b981', fontSize: '0.85rem', marginBottom: '16px' }}>
                        Profile updated successfully! Console credentials re-synchronized.
                      </div>
                    )}
                    {profileError && (
                      <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', padding: '12px', borderRadius: '6px', color: '#f43f5e', fontSize: '0.85rem', marginBottom: '16px' }}>
                        {profileError}
                      </div>
                    )}

                    <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Operator Username</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          required
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Contact Number (PKR Localized)</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          required
                          style={{ width: '100%' }}
                          placeholder="e.g. 03001234567"
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Change Access Password</label>
                        <input 
                          type="password" 
                          className="form-control" 
                          value={profilePassword}
                          onChange={(e) => setProfilePassword(e.target.value)}
                          placeholder="Leave blank to retain current password"
                          style={{ width: '100%' }}
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn-gold" 
                        style={{ marginTop: '10px', width: '100%', height: '45px' }}
                        disabled={submittingProfile}
                      >
                        {submittingProfile ? 'Saving...' : 'Update Console Profile'}
                      </button>
                    </form>
                  </div>

                  {/* System Toggles Card */}
                  <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ ...styles.chartTitle }}>Console Preferences</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Configure automation scripts and interactive dashboard components.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <input 
                          type="checkbox" 
                          id="autoAllocate" 
                          checked={autoAllocateRecommend}
                          onChange={(e) => setAutoAllocateRecommend(e.target.checked)}
                          style={{ 
                            marginTop: '4px', 
                            cursor: 'pointer', 
                            accentColor: 'var(--gold)',
                            width: '18px',
                            height: '18px',
                            WebkitAppearance: 'checkbox',
                            appearance: 'checkbox'
                          }}
                        />
                        <label htmlFor="autoAllocate" style={{ cursor: 'pointer' }}>
                          <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            Auto-Room Allocations Recommendation Engine
                          </strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Use algorithmic vacancy metrics to automatically select the optimal suite number for guest check-ins.
                          </span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <input 
                          type="checkbox" 
                          id="maintenanceAlert" 
                          checked={maintenanceAutoAlert}
                          onChange={(e) => setMaintenanceAutoAlert(e.target.checked)}
                          style={{ 
                            marginTop: '4px', 
                            cursor: 'pointer', 
                            accentColor: 'var(--gold)',
                            width: '18px',
                            height: '18px',
                            WebkitAppearance: 'checkbox',
                            appearance: 'checkbox'
                          }}
                        />
                        <label htmlFor="maintenanceAlert" style={{ cursor: 'pointer' }}>
                          <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            Under-Maintenance Auto Alerts
                          </strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Automatically dispatch automated notifications if an assigned guest room is toggled into maintenance state.
                          </span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <input 
                          type="checkbox" 
                          id="halalStrict" 
                          defaultChecked={true}
                          disabled={true}
                          style={{ 
                            marginTop: '4px', 
                            cursor: 'not-allowed', 
                            accentColor: 'var(--gold)',
                            width: '18px',
                            height: '18px',
                            WebkitAppearance: 'checkbox',
                            appearance: 'checkbox'
                          }}
                        />
                        <label htmlFor="halalStrict" style={{ cursor: 'not-allowed' }}>
                          <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)', opacity: 0.8 }}>
                            Strict Halal Booking Compliance Layer (Enforced)
                          </strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', opacity: 0.8 }}>
                            Enforce localized booking preferences, non-alcoholic inventories, and dynamic prayer alignment times.
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 'auto', background: 'rgba(212, 175, 55, 0.05)', border: '1px dashed var(--border-color)', padding: '16px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', color: 'var(--gold)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                        <AlertTriangle size={16} /> Operational Alert
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Console operational preferences are stored in the active administrator's local browser context and apply dynamically to all database requests.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Administrator Account Management Console Panel */}
                <div className="admin-management-panel glass-panel" style={{ padding: '30px', marginBottom: '50px' }}>
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                    <h3 style={{ ...styles.chartTitle, fontSize: '1.15rem' }}>🛡️ Administrator Account Management</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                      Authorize new administrative operators or revoke console access for existing administrators securely.
                    </p>
                  </div>

                  <div className="admin-manage-grid grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-[30px]">
                    {/* Admins List Table */}
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--gold)', marginBottom: '16px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Active Console Operators ({adminsList.length})
                      </h4>

                      {adminsLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0', color: 'var(--text-muted)', gap: '10px' }}>
                          <div style={styles.spinner}></div>
                          <span>Querying active operator logs...</span>
                        </div>
                      ) : (
                        <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead>
                              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Operator</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Email</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Phone</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', textAlign: 'right' }}>Security Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminsList.map((adm) => (
                                <tr key={adm._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.3s' }}>
                                  <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '50%',
                                      background: adm._id === user._id ? 'var(--gold-gradient)' : 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                                      color: adm._id === user._id ? '#000' : '#fff',
                                      fontWeight: '700',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.8rem',
                                    }}>
                                      {adm.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontWeight: '500' }}>
                                      {adm.name} {adm._id === user._id && <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>(You)</span>}
                                    </span>
                                  </td>
                                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{adm.email}</td>
                                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{adm.phone || 'N/A'}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                    {adm._id === user._id ? (
                                      <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '600', paddingRight: '8px' }}>
                                        Active Operator
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => handleRemoveAdmin(adm._id, adm.name)}
                                        className="table-action-btn btn-outline"
                                        style={{ borderColor: 'var(--rose)', color: 'var(--rose)', background: 'transparent', padding: '6px 12px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                                      >
                                        Revoke Access
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Add Admin Form */}
                    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--gold)', marginBottom: '16px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Authorize New Admin
                      </h4>

                      {newAdminSuccess && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '12px', borderRadius: '6px', color: '#10b981', fontSize: '0.85rem', marginBottom: '16px' }}>
                          Administrative credentials provisioned and active!
                        </div>
                      )}
                      {newAdminError && (
                        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', padding: '12px', borderRadius: '6px', color: '#f43f5e', fontSize: '0.85rem', marginBottom: '16px' }}>
                          {newAdminError}
                        </div>
                      )}

                      <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Operator Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            required
                            placeholder="Lord Bilal Khan"
                            style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            required
                            placeholder="admin@aurastay.com"
                            style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Contact Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={newAdminPhone}
                            onChange={(e) => setNewAdminPhone(e.target.value)}
                            required
                            placeholder="03001234567"
                            style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '500' }}>Access Password *</label>
                          <input
                            type="password"
                            className="form-control"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            required
                            placeholder="Minimum 6 characters"
                            style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem' }}
                            minLength={6}
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn-gold"
                          style={{ marginTop: '8px', width: '100%', height: '42px', justifyContent: 'center' }}
                          disabled={submittingNewAdmin}
                        >
                          {submittingNewAdmin ? 'Authorizing...' : 'Provision Admin Operator'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

      </div>

      {previewImage && (
        <div 
          style={{
            ...styles.modalOverlay,
            background: isReceiptFullScreen ? 'rgba(0, 0, 0, 0.98)' : 'rgba(5, 7, 12, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000
          }} 
          onClick={() => {
            setPreviewImage(null);
            setIsReceiptFullScreen(false);
          }}
        >
          {isReceiptFullScreen ? (
            /* Full Screen Mode */
            <div 
              style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={previewImage} 
                alt="Payment Proof Fullscreen" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain',
                  cursor: 'zoom-out'
                }} 
                onClick={() => setIsReceiptFullScreen(false)}
              />
              <div style={{ position: 'absolute', top: '20px', right: '30px', display: 'flex', gap: '12px', zIndex: 3100 }}>
                <button 
                  onClick={() => setIsReceiptFullScreen(false)}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: '#fff', cursor: 'pointer' }}
                >
                  🗗 Exit Full Screen
                </button>
                <button 
                  onClick={() => {
                    setPreviewImage(null);
                    setIsReceiptFullScreen(false);
                  }}
                  className="btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          ) : (
            /* Normal Popup Modal Mode */
            <div style={styles.previewModal} className="glass-panel" onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)', fontSize: '1.2rem' }}>Payment Proof Verification</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    onClick={() => setIsReceiptFullScreen(true)}
                    className="btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.72rem', color: 'var(--gold)', borderColor: 'var(--gold)', cursor: 'pointer' }}
                  >
                    🗖 Full Screen
                  </button>
                  <button 
                    onClick={() => {
                      setPreviewImage(null);
                      setIsReceiptFullScreen(false);
                    }} 
                    style={styles.closeBtn}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', padding: '15px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <img src={previewImage} alt="Payment Proof" style={{ maxWidth: '100%', maxHeight: '65vh', borderRadius: '4px', objectFit: 'contain' }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    marginBottom: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    color: 'var(--text-secondary)',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--gold)',
    borderRadius: '50%',
    animation: 'spin 1s infinite linear',
  },
  statCard: {
    padding: '24px 20px',
    background: 'var(--bg-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'var(--text-muted)',
  },
  statIcon: {
    color: 'var(--gold)',
  },
  statVal: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  chartTitle: {
    fontSize: '1.05rem',
    fontWeight: '600',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '24px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  price: {
    color: 'var(--gold)',
    fontWeight: '700',
    fontSize: '1.15rem',
  },
  notesBox: {
    background: 'var(--bg-tertiary)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    borderLeft: '2px solid var(--gold)',
  },
  emptyState: {
    padding: '60px 40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    background: 'var(--bg-secondary)',
  },
  emptyStateRight: {
    padding: '40px 20px',
    textAlign: 'center',
    background: 'var(--bg-secondary)',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
  },
  requestsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  requestCard: {
    padding: '18px 20px',
    background: 'var(--bg-secondary)',
  },
  requestCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  requestType: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
  },
  requestDetails: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  },
  requestFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '12px',
    paddingTop: '8px',
  },
  legend: {
    display: 'flex',
    gap: '10px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '500',
  },
  legendBtn: {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '4px 10px',
    fontSize: '0.72rem',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  tabContainer: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '32px',
    marginTop: '10px'
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '12px 8px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  roomNoText: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
  },
  roomTypeMini: {
    fontSize: '0.65rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(5, 7, 12, 0.85)',
    backdropFilter: 'blur(12px)',
    zIndex: 3000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  previewModal: {
    width: '100%',
    maxWidth: '700px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--border-radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    padding: '30px',
    boxShadow: 'var(--shadow-lg)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  closeBtn: {
    color: 'var(--text-muted)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
  },
  viewProofBtn: {
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid var(--gold)',
    color: 'var(--gold)',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '0.72rem',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

export default AdminDashboard;
