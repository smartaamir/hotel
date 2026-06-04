import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Compass, ShieldCheck, Sparkles, MessageSquarePlus, Clock, ChefHat, Bell, XCircle } from 'lucide-react';
import '../styles/dashboard.css';

const UserDashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [bookings, setBookings] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Service Request Modal States
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [requestType, setRequestType] = useState('Room Service');
  const [requestDetails, setRequestDetails] = useState('');
  const [submittingService, setSubmittingService] = useState(false);

  const { updateUserProfileState } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('stays'); // 'stays', 'settings'

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'settings') {
      setActiveTab('settings');
    } else {
      setActiveTab('stays');
    }
  }, [location]);

  // Settings states
  const [profileName, setProfileName] = useState(user ? user.name : '');
  const [profileEmail, setProfileEmail] = useState(user ? user.email : '');
  const [profilePhone, setProfilePhone] = useState(user ? user.phone : '');
  const [profilePassword, setProfilePassword] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const bookingsRes = await fetch('/api/bookings/my-bookings', {
        headers: getAuthHeaders()
      });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }

      // Fetch service requests
      const servicesRes = await fetch('/api/services/my-requests', {
        headers: getAuthHeaders()
      });
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServiceRequests(servicesData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you absolutely sure you want to cancel this reservation? Your payment will be refunded.')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('Your reservation has been cancelled. Simulated refund of total amount has been authorized.');
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(`Failed to cancel: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to cancel stay', error);
    }
  };

  const openServiceModal = (booking) => {
    setSelectedBooking(booking);
    setShowRequestForm(true);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    if (!requestDetails.trim()) {
      alert('Please fill out request details.');
      return;
    }

    setSubmittingService(true);

    try {
      const response = await fetch('/api/services/request', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          type: requestType,
          details: requestDetails
        })
      });

      if (response.ok) {
        setShowRequestForm(false);
        setRequestDetails('');
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(`Failed to submit: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingService(false);
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
        setProfileError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError('Network error, please try again.');
    } finally {
      setSubmittingProfile(false);
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
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <span style={{ color: 'var(--gold)', fontWeight: '600', letterSpacing: '1px', fontSize: '0.8rem' }}>GUEST MEMBERSHIP</span>
            <h1 className="text-[1.6rem] sm:text-[2.2rem]" style={{ fontFamily: 'var(--font-title)', marginTop: '4px' }}>
              Welcome, {user ? user.name : 'Alexander'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Access your historical timelines, review stay invoices, and request amenities from the palm of your hand.
            </p>
          </div>
        </div>

        {/* Dashboard Tabs bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px' }} className="overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('stays')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              color: activeTab === 'stays' ? 'var(--gold)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'stays' ? '2px solid var(--gold)' : 'none',
              fontSize: '0.88rem',
              transition: 'var(--transition)'
            }}
          >
            Your Luxury Stays
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              color: activeTab === 'settings' ? 'var(--gold)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              borderBottom: activeTab === 'settings' ? '2px solid var(--gold)' : 'none',
              fontSize: '0.88rem',
              transition: 'var(--transition)'
            }}
          >
            Profile Settings
          </button>
        </div>

        {loading ? (
          <div style={styles.loader}>
            <div style={styles.spinner}></div>
            <span>Fetching secure stay registers...</span>
          </div>
        ) : activeTab === 'stays' ? (
          <div className="dashboard-grid">
            
            {/* Left Main bookings timeline */}
            <div className="dashboard-left">
              <h2 style={styles.sectionTitle}>Your Luxury Stays</h2>
              
              {bookings.length > 0 ? (
                <div style={styles.bookingTimeline}>
                  {bookings.map((booking) => {
                    const checkIn = new Date(booking.checkInDate);
                    const checkOut = new Date(booking.checkOutDate);
                    
                    return (
                      <div key={booking._id} className="glass-panel bg-[var(--bg-secondary)] p-4 md:p-[24px_30px] rounded-lg border border-[var(--border-color)] shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--border-color)] pb-3.5 mb-4">
                          <div>
                            <span className={`badge ${getStatusClass(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className="badge badge-success" style={{ marginLeft: '8px', background: 'rgba(212, 175, 55, 0.05)', color: 'var(--gold)', border: '1px solid var(--gold-glow)' }}>
                              {booking.paymentStatus}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Adjusted Fare</span>
                            <span style={styles.price}>Rs. {booking.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div style={styles.cardDetailCol}>
                            <span>Suite Category</span>
                            <h3>{booking.roomType}</h3>
                          </div>
                          
                          <div style={styles.cardDetailCol}>
                            <span>Dates of Immersion</span>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                              {checkIn.toLocaleDateString()} – {checkOut.toLocaleDateString()}
                            </p>
                          </div>

                          <div style={styles.cardDetailCol}>
                            <span>Assigned Sanctuary</span>
                            <p style={{ color: 'var(--gold)', fontWeight: '600' }}>
                              {booking.assignedRoom ? `Suite ${booking.assignedRoom.roomNumber}` : 'Pending Admin Assignment'}
                            </p>
                          </div>
                        </div>

                        {/* Dining & Amenities Details Row */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${booking.paymentProof ? '4' : '3'} gap-5 mt-4 pt-4 border-t border-dashed border-[var(--border-color)]`}>
                          <div style={styles.cardDetailCol}>
                            <span>🍽️ Dining Plan</span>
                            <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginTop: '2px' }}>
                              {booking.diningPlan || 'None'}
                            </p>
                          </div>
                          <div style={styles.cardDetailCol}>
                            <span>✨ Extra Amenities</span>
                            <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginTop: '2px' }}>
                              {booking.extraAmenities && booking.extraAmenities.length > 0
                                ? booking.extraAmenities.join(', ')
                                : 'None'}
                            </p>
                          </div>
                          <div style={styles.cardDetailCol}>
                            <span>💳 Payment Details</span>
                            <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginTop: '2px' }}>
                              {booking.paymentMethod} {booking.transactionId && `(${booking.transactionId})`}
                            </p>
                          </div>
                          {booking.paymentProof && (
                            <div style={styles.cardDetailCol}>
                              <span>📄 Payment Proof</span>
                              <button 
                                onClick={() => {
                                  const win = window.open();
                                  win.document.write(`<iframe src="${booking.paymentProof}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                }}
                                style={styles.viewProofBtn}
                              >
                                View Receipt Proof
                              </button>
                            </div>
                          )}
                        </div>

                        {booking.status === 'Checked In' && (
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 p-4 md:p-[18px] bg-[rgba(212,175,55,0.04)] border border-dashed border-gold rounded-lg shadow-sm">
                            <div style={{ textAlign: 'left' }}>
                              <h4 style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                🍔 Order Suite Room Service
                              </h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4', margin: '4px 0 0 0' }}>
                                Indulge in authentic royal delicacies from our kitchens! Order fresh hot breakfasts, Mughlai lunches, gourmet dinners, and chilled beverages delivered straight to Suite {booking.assignedRoom?.roomNumber || 'N/A'}.
                              </p>
                            </div>
                            <button 
                              onClick={() => navigate('/dining')}
                              className="btn-gold"
                              style={{ padding: '8px 18px', fontSize: '0.78rem', whiteSpace: 'nowrap', height: 'fit-content' }}
                            >
                              Order Food Now
                            </button>
                          </div>
                        )}

                        {booking.guestNotes && (
                          <div style={styles.notesBox}>
                            <strong>Your instructions:</strong> "{booking.guestNotes}"
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 mt-5 border-t border-[var(--border-color)] pt-4">
                          {/* Checked In controls */}
                          {booking.status === 'Checked In' && (
                            <button 
                              onClick={() => openServiceModal(booking)}
                              className="btn-gold" 
                              style={styles.actionBtn}
                            >
                              <MessageSquarePlus size={16} /> Request Guest Services
                            </button>
                          )}

                          {/* Cancellation conditions */}
                          {(booking.status === 'Pending Approval' || booking.status === 'Approved') && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="btn-outline"
                              style={{ ...styles.actionBtn, color: 'var(--rose)', borderColor: 'var(--rose-light)' }}
                            >
                              <XCircle size={16} /> Cancel Reservation
                            </button>
                          )}
                          
                          {booking.status === 'Checked Out' && (
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              Thank you for letting AuraStay curate your stay.
                            </span>
                          )}

                          {booking.status === 'Cancelled' && (
                            <span style={{ fontSize: '0.85rem', color: 'var(--rose)' }}>
                              Reservation Cancelled & Refunded.
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={styles.emptyState} className="glass-panel">
                  <Compass size={40} style={{ color: 'var(--text-muted)' }} />
                  <h3>No Historical Timelines</h3>
                  <p>You haven't reserved any luxury stays yet. Explore our premier suites and book a stay.</p>
                </div>
              )}
            </div>

            {/* Right side guest requests list */}
            <div className="dashboard-right">
              <h2 style={styles.sectionTitle}>Active Service Requests</h2>
              
              {serviceRequests.length > 0 ? (
                <div style={styles.requestsStack}>
                  {serviceRequests.map((req) => (
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
                      <div style={styles.requestFooter}>
                        <span>Suite {req.roomNumber}</span>
                        <span>{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyStateRight} className="glass-panel">
                  <Clock size={32} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
                  <p>No active room requests. Request room service or housekeeping while checked into your suite.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          // Settings Tab View
          <div style={{ maxWidth: '600px', margin: '0 auto' }} className="glass-panel">
            <div style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', marginBottom: '18px', color: 'var(--gold)' }}>
                Edit Personal Profile Settings
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Modify your resort registry details. Updates immediately synchronize with database profiles.
              </p>

              {profileError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '20px' }}>
                  {profileError}
                </div>
              )}

              {profileSuccess && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '12px 16px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '20px' }}>
                  ✓ Profile settings saved successfully!
                </div>
              )}

              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pakistani Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>New Password (leave blank if unchanged)</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', height: '45px', marginTop: '10px' }} disabled={submittingProfile}>
                  {submittingProfile ? 'Saving Ledger Details...' : 'Update Stay Profile'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Guest Request Modal Form */}
      {showRequestForm && selectedBooking && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} className="glass-panel dashboard-modal">
            <div style={styles.modalHeader}>
              <h3 style={{ fontFamily: 'var(--font-title)' }}>Request Guest Amenities</h3>
              <button onClick={() => setShowRequestForm(false)} style={styles.closeBtn}>×</button>
            </div>
            
            <form onSubmit={handleSubmitService} style={styles.modalForm}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Submitting request for <strong>{selectedBooking.roomType}</strong> (Suite {selectedBooking.assignedRoom?.roomNumber})
              </p>

              <div className="form-group">
                <label>Amenity/Service Type</label>
                <select 
                  className="form-control"
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                >
                  <option value="Room Service">Room Service (Food & Drink)</option>
                  <option value="Housekeeping">Housekeeping & Towels</option>
                  <option value="Spa Service">In-Room Spa Treatment</option>
                  <option value="Valet">Valet Parking</option>
                  <option value="Luggage Assistance">Luggage Assistance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Specify Your Request Details</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  placeholder="E.g., Fresh mint tea, Zamzam water and organic dates, or fresh cotton towels..."
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-gold" 
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={submittingService}
              >
                {submittingService ? 'Submitting Request...' : 'Send to Front Desk'}
              </button>
            </form>
          </div>
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
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '24px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  bookingTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  bookingCard: {
    padding: '24px 30px',
    background: 'var(--bg-secondary)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '14px',
    marginBottom: '16px',
  },
  price: {
    color: 'var(--gold)',
    fontWeight: '700',
    fontSize: '1.15rem',
  },
  cardMain: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  cardDetailCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '0.8rem',
  },
  cardDetailsRow: {
    display: 'grid',
    gap: '20px',
    marginTop: '16px',
    borderTop: '1px dashed var(--border-color)',
    paddingTop: '16px',
  },
  viewProofBtn: {
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid var(--gold)',
    color: 'var(--gold)',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '0.72rem',
    cursor: 'pointer',
    width: 'fit-content',
    fontWeight: '600',
    marginTop: '2px',
    transition: 'all 0.3s ease',
  },
  notesBox: {
    marginTop: '16px',
    background: 'var(--bg-tertiary)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    borderLeft: '2px solid var(--gold)',
  },
  cardFooter: {
    marginTop: '20px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    padding: '10px 20px',
    fontSize: '0.75rem',
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
    borderTop: '1px dashed var(--border-color)',
    paddingTop: '8px',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(5, 7, 12, 0.7)',
    backdropFilter: 'blur(8px)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '500px',
    background: 'var(--bg-secondary)',
    padding: '30px',
    borderRadius: 'var(--border-radius-lg)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '14px',
    marginBottom: '20px',
  },
  closeBtn: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'var(--text-muted)',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
};
export default UserDashboard;
