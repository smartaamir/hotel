import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, ArrowRight, ShieldCheck, Sparkles, MapPin, Coffee, Utensils } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search States
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('Deluxe Suite');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert('Please select both Check-In and Check-Out dates.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert('Check-Out date must be after Check-In date.');
      return;
    }

    // Direct to Rooms page with parameters
    navigate('/rooms', {
      state: { checkIn, checkOut, roomType, guests }
    });
  };

  return (
    <div style={styles.page}>
      
      {/* 1. Luxurious Hero Section */}
      <header className="relative min-h-[80vh] lg:h-[95vh] py-20 lg:py-0 flex items-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80")' }}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent} className="container">
          <h1 style={styles.heroTitle} className="text-[2.2rem] sm:text-[3.2rem] lg:text-[3.8rem] !leading-[1.2]">A Sanctuary of <br /><span className="luxury-text-gradient">Absolute Splendor</span></h1>
          <p style={styles.heroSubtitle}>
            Immerse yourself in breathtaking coastal architectures, private infinity plunge pools, and tailored 24/7 butler attention. Welcome to AuraStay.
          </p>

          {/* Elegant Search/Booking Bar or Admin Quick Access */}
          {user && user.role === 'admin' ? (
            <div style={styles.adminWelcomeBox} className="glass-panel">
              <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>AuraStay Administrative Hub</span>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-title)', margin: '10px 0', color: '#fff' }}>Welcome Back, System Operator</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: '1.6', maxWidth: '650px' }}>
                You are currently authenticated as an Administrative Operator. Guest reservation interfaces are hidden. Use the primary control link below to access the ledger registries, suite cleanliness matrix, and booking analytics.
              </p>
              <button onClick={() => navigate('/admin')} className="btn-gold" style={{ height: '45px', padding: '0 24px' }}>
                Go to Admin Command Center <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSearch} style={styles.searchBar} className="glass-panel">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
              <div style={styles.searchCol}>
                <label style={styles.searchLabel}><Calendar size={14} style={styles.searchIcon} /> Check-In</label>
                <input
                  type="date"
                  style={styles.searchInput}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div style={styles.searchCol}>
                <label style={styles.searchLabel}><Calendar size={14} style={styles.searchIcon} /> Check-Out</label>
                <input
                  type="date"
                  style={styles.searchInput}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div style={styles.searchCol}>
                <label style={styles.searchLabel}><Sparkles size={14} style={styles.searchIcon} /> Category</label>
                <select
                  style={styles.searchInput}
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="Single Room">Single Room</option>
                  <option value="Double Room">Double Room</option>
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>

              <div style={styles.searchCol}>
                <label style={styles.searchLabel}><Users size={14} style={styles.searchIcon} /> Guests</label>
                <select
                  style={styles.searchInput}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests</option>
                </select>
              </div>

              <button type="submit" className="btn-gold" style={styles.searchBtn}>
                Book Stay <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>

      {/* 2. Premium Features / Amenities */}
      <section style={{ padding: '80px 0' }} className="container">
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTag}>EXCLUSIVE HAVENS</span>
          <h2 style={styles.sectionTitle}>The AuraStay Experience</h2>
          <p style={styles.sectionDesc}>Every detail is meticulously refined to ensure your complete alignment with absolute relaxation, ease, and comfort.</p>
        </div>

        <div className="grid-3" style={{ marginTop: '50px' }}>
          <div style={styles.featureCard} className="glass-panel">
            <div style={styles.featureIconBox}><MapPin size={24} /></div>
            <h3 style={styles.featureTitle}>Unrivaled Locations</h3>
            <p style={styles.featureText}>Perched amidst the peaceful Margalla Hills of Islamabad and scenic Hunza Valley, offering breathtaking morning views of pristine mountains and valleys.</p>
          </div>

          <div style={styles.featureCard} className="glass-panel">
            <div style={styles.featureIconBox}><Coffee size={24} /></div>
            <h3 style={styles.featureTitle}>Bespoke Concierge</h3>
            <p style={styles.featureText}>A dedicated personalized butler service ready 24/7 to organize private chef dining, spa packages, or sunset yacht tours.</p>
          </div>

          <div style={styles.featureCard} className="glass-panel">
            <div style={styles.featureIconBox}><Utensils size={24} /></div>
            <h3 style={styles.featureTitle}>Michelin Gastronomy</h3>
            <p style={styles.featureText}>Taste legendary cuisine curated by world-class culinary artists, served directly to your private patio or candlelit shoreline table.</p>
            <button 
              onClick={() => navigate('/dining')} 
              className="btn-gold" 
              style={{ marginTop: '12px', padding: '6px 16px', fontSize: '0.78rem', width: 'fit-content' }}
            >
              Explore Royal Menu
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Suite Promos (Visual Carousels) */}
      <section style={styles.suitesPromo}>
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
          <div style={styles.promoContent}>
            <span style={styles.sectionTag}>LUXURY PENTHOUSES</span>
            <h2 style={styles.promoTitle}>Unveiling Our Presidential Penthouse</h2>
            <p style={styles.promoText}>
              Stretching over the entire crest top floor, our Presidential Suite is the absolute crown jewel. Outfitted with private outdoor hot tubs, multi-room dining salons, baby grand pianos, and wrap-around sun decks. 
            </p>
            <div style={styles.checkLists}>
              <div style={styles.checkItem}><ShieldCheck size={18} style={{ color: 'var(--gold)' }} /> Breathtaking Panoramic Mountain & Valley Vistas</div>
              <div style={styles.checkItem}><ShieldCheck size={18} style={{ color: 'var(--gold)' }} /> Dedicated Personal Butler & Fresh Beverage Station</div>
              <div style={styles.checkItem}><ShieldCheck size={18} style={{ color: 'var(--gold)' }} /> Helicopter Arrival & Luxury Chauffeur</div>
            </div>
            {(!user || user.role !== 'admin') && (
              <button onClick={() => navigate('/rooms')} className="btn-gold" style={{ marginTop: '30px' }}>
                Explore Suites
              </button>
            )}
          </div>
          <div className="h-[250px] sm:h-[350px] lg:h-[420px] rounded-[var(--border-radius-lg)] overflow-hidden shadow-lg border border-[var(--border-color)]">
            <img 
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80" 
              alt="Presidential Penthouse View" 
              style={styles.promoImage} 
            />
          </div>
        </div>
      </section>

      {/* 4. Elegant Guest Reviews Banner */}
      <section id="testimonials" style={{ padding: '80px 0' }} className="container">
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTag}>GUEST LEGACIES</span>
          <h2 style={styles.sectionTitle}>What Our Patrons Say</h2>
        </div>

        <div className="grid-2" style={{ marginTop: '50px' }}>
          <div style={styles.testimonialCard} className="glass-panel">
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialQuote}>
              "An absolutely unparalleled experience. The Halal-certified dining, private family pools, and secure admin room assignment made our family stay spectacular. The staff was extremely respectful and professional."
            </p>
            <div style={styles.patron}>
              <strong>Mian Rizwan</strong>
              <span>Lahore, Pakistan</span>
            </div>
          </div>

          <div style={styles.testimonialCard} className="glass-panel">
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialQuote}>
              "AuraStay has redefined modern luxury stays. Ordering Zamzam water and organic fresh dates directly from our guest portal was so seamless. The privacy and quiet prayer room made our stay blessed."
            </p>
            <div style={styles.patron}>
              <strong>Zainab Fatima</strong>
              <span>Islamabad, Pakistan</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
  },
  hero: {
    position: 'relative',
    height: '95vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(5, 7, 12, 0.4) 0%, rgba(5, 7, 12, 0.8) 100%)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    marginTop: '60px',
  },
  heroTitle: {
    fontFamily: 'var(--font-title)',
    color: '#fff',
    fontWeight: '400',
    marginBottom: '20px',
    textShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.1rem',
    maxWidth: '650px',
    lineHeight: '1.8',
    marginBottom: '40px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  searchBar: {
    width: '100%',
    padding: '24px 30px',
    background: 'rgba(10, 14, 23, 0.6)',
  },
  searchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr) auto',
    gap: '20px',
    alignItems: 'end',
  },
  searchCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  searchLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  searchIcon: {
    color: 'var(--gold)',
  },
  searchInput: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '12px 14px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    transition: 'var(--transition)',
    cursor: 'pointer',
  },
  searchBtn: {
    height: '45px',
    padding: '0 30px',
    fontSize: '0.85rem',
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto',
  },
  sectionTag: {
    color: 'var(--gold)',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: '2rem',
    color: 'var(--text-primary)',
    marginTop: '10px',
    marginBottom: '16px',
  },
  sectionDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  featureCard: {
    padding: '40px 30px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  featureIconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'var(--gold-light)',
    color: 'var(--gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    border: '1px solid var(--border-color)',
  },
  featureTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  featureText: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  suitesPromo: {
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--border-color)',
    padding: '100px 0',
  },
  splitGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.8fr',
    gap: '60px',
    alignItems: 'center',
  },
  promoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  promoTitle: {
    fontSize: '2.2rem',
    color: 'var(--text-primary)',
    lineHeight: '1.3',
  },
  promoText: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  },
  checkLists: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  promoImageWrapper: {
    borderRadius: 'var(--border-radius-lg)',
    overflow: 'hidden',
    height: '420px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-color)',
  },
  promoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  testimonialCard: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  stars: {
    color: 'var(--gold)',
    letterSpacing: '2px',
    fontSize: '1rem',
  },
  testimonialQuote: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.8',
    fontStyle: 'italic',
  },
  patron: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  adminWelcomeBox: {
    padding: '30px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    textAlign: 'left',
  },
};

export default Home;
