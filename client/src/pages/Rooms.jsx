import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import { Calendar, Compass, Filter } from 'lucide-react';

const roomCategoriesMock = [
  {
    type: 'Single Room',
    pricePerNight: 15000,
    capacity: 1,
    description: 'A cozy, minimalist room equipped with a plush twin-sized mattress, sleek modern workspace, ambient smart lighting, Qibla compass direction indicator, and luxurious marble walk-in shower. Perfect for single corporate travelers and business nomads.',
    amenities: ['High-speed Wi-Fi', 'Smart TV', 'Prayer Mat & Qibla Compass', 'Espresso Machine', 'Luxury Robes & Slippers'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    type: 'Double Room',
    pricePerNight: 28000,
    capacity: 2,
    description: 'A modern sanctuary featuring a generous plush queen-sized bed, premium audio setup, bespoke wood furnishings, Qibla arrow, marble-top vanity, and floor-to-ceiling windows looking out over the city skyline.',
    amenities: ['High-speed Wi-Fi', '55" 4K Smart TV', 'Zamzam Water & Organic Dates Console', 'Mini Fridge', 'Rain Shower', 'Room Service Tablet'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    type: 'Deluxe Suite',
    pricePerNight: 55000,
    capacity: 4,
    description: 'A sprawling executive suite boasting a separate opulent living room, master bedroom with California King bed, dynamic smart control center, luxury deep-soaking bathtub, private garden terrace, prayer rugs, and 24/7 dedicated butler call service.',
    amenities: ['High-speed Wi-Fi', '65" Smart TV & Soundbar', 'Complimentary Zamzam Water & Fresh Dates', 'Deep Soaking Tub', 'Private Veranda', 'Prayer Mats & Holy Quran Copy', '24/7 Butler Access'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    type: 'Presidential Suite',
    pricePerNight: 120000,
    capacity: 6,
    description: 'The ultimate statement of absolute prestige. A magnificent multi-room penthouse retreat featuring a private heated infinity plunge pool, full dining room, private library and prayer room, master steam shower, and stunning panoramic 360-degree ocean views.',
    amenities: ['Private Infinity Plunge Pool', 'Full Dining Room & Fresh Beverage Console', 'Steam Shower & Dry Sauna', 'Personal Concierge & Private Chef', 'Private Elevator Key', 'Prayer Mats & Holy Quran Copies', 'Complimentary Airport Premium Transfer'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

const Rooms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getAuthHeaders } = useAuth();

  // Load params from Home redirection state
  const homeState = location.state || {};

  // Form Booking States
  const [checkIn, setCheckIn] = useState(
    homeState.checkIn || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Tomorrow
  );
  const [checkOut, setCheckOut] = useState(
    homeState.checkOut || new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 4 days from now
  );
  const [guestsFilter, setGuestsFilter] = useState(homeState.guests || 1);
  const [categoryFilter, setCategoryFilter] = useState(homeState.roomType || 'All');
  const [maxPrice, setMaxPrice] = useState(150000);


  // Filter Rooms
  const filteredSuites = roomCategoriesMock.filter((r) => {
    if (categoryFilter !== 'All' && r.type !== categoryFilter) return false;
    if (r.pricePerNight > maxPrice) return false;
    if (r.capacity < guestsFilter) return false;
    return true;
  });

  const handleBookRequest = (suite) => {
    if (!user) {
      alert('You must be signed in to request a reservation.');
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please fill out check-in and check-out dates.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    navigate('/checkout', {
      state: {
        roomType: suite.type,
        pricePerNight: suite.pricePerNight,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests: guestsFilter
      }
    });
  };

  return (
    <div style={styles.page}>
      
      {/* Search Header banner */}
      <div className="relative h-[220px] md:h-[350px] flex items-center mb-8 md:mb-[50px] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80")' }}>
        <div style={styles.bannerOverlay}></div>
        <div className="container" style={styles.bannerContent}>
          <span style={styles.bannerTag}>BESPOKE APARTMENTS</span>
          <h1 style={styles.bannerTitle} className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.5rem]">Luxurious Stays & Suites</h1>
          <p style={styles.bannerSubtitle}>Select your dates, filter your capacity limits, and book absolute comfort.</p>
        </div>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-[30px] mb-10">
        {/* Dynamic Left Filter Panel */}
        <aside style={styles.sidebar} className="glass-panel">
          <h3 style={styles.sidebarTitle}><Filter size={18} style={{ color: 'var(--gold)' }} /> Stay Filters</h3>
          
          <div className="form-group" style={styles.sidebarGroup}>
            <label><Calendar size={14} style={styles.filterIcon} /> Check-In</label>
            <input
              type="date"
              className="form-control"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group" style={styles.sidebarGroup}>
            <label><Calendar size={14} style={styles.filterIcon} /> Check-Out</label>
            <input
              type="date"
              className="form-control"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group" style={styles.sidebarGroup}>
            <label>Suite Category</label>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Single Room">Single Room</option>
              <option value="Double Room">Double Room</option>
              <option value="Deluxe Suite">Deluxe Suite</option>
              <option value="Presidential Suite">Presidential Suite</option>
            </select>
          </div>

          <div className="form-group" style={styles.sidebarGroup}>
            <label>Guests Capacity</label>
            <select
              className="form-control"
              value={guestsFilter}
              onChange={(e) => setGuestsFilter(parseInt(e.target.value))}
            >
              <option value={1}>1+ Guest</option>
              <option value={2}>2+ Guests</option>
              <option value={4}>4+ Guests</option>
              <option value={6}>6 Guests</option>
            </select>
          </div>

          <div className="form-group" style={styles.sidebarGroup}>
            <div style={styles.priceRow}>
              <label>Nightly Limit</label>
              <strong style={{ color: 'var(--gold)' }}>Rs. {maxPrice.toLocaleString()}</strong>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        </aside>

        {/* Dynamic Right Room Grid */}
        <main style={styles.mainGrid}>
          {filteredSuites.length > 0 ? (
            <div className="grid-2">
              {filteredSuites.map((suite, idx) => (
                <RoomCard 
                  key={idx} 
                  room={suite} 
                  onSelect={() => handleBookRequest(suite)} 
                />
              ))}
            </div>
          ) : (
            <div style={styles.noRooms} className="glass-panel">
              <Compass size={48} style={{ color: 'var(--text-muted)' }} />
              <h3 style={{ marginTop: '16px' }}>No Suites Available</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
                We couldn't find suites that match your filter parameters. Please widen your price limit or select other suite types.
              </p>
            </div>
          )}
        </main>
      </div>



    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    paddingBottom: '80px',
  },
  banner: {
    position: 'relative',
    height: '350px',
    backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '50px',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(5, 7, 12, 0.4) 0%, rgba(5, 7, 12, 0.8) 100%)',
    zIndex: 1,
  },
  bannerContent: {
    position: 'relative',
    zIndex: 2,
    marginTop: '60px',
  },
  bannerTag: {
    color: 'var(--gold)',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: '2.5rem',
    fontFamily: 'var(--font-title)',
    color: '#fff',
    marginTop: '10px',
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '0.95rem',
    marginTop: '8px',
    maxWidth: '550px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '30px',
  },
  sidebar: {
    padding: '30px 24px',
    height: 'fit-content',
    background: 'var(--bg-secondary)',
  },
  sidebarTitle: {
    fontSize: '1.15rem',
    fontWeight: '600',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
  },
  sidebarGroup: {
    marginBottom: '18px',
  },
  filterIcon: {
    color: 'var(--gold)',
    marginRight: '6px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    accentColor: 'var(--gold)',
    cursor: 'pointer',
    marginTop: '6px',
  },
  mainGrid: {
    display: 'flex',
    flexDirection: 'column',
  },
  noRooms: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    textAlign: 'center',
  },
};



export default Rooms;
