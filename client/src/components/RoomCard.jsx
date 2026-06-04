import React, { useState } from 'react';
import { Users, Wifi, Tv, Coffee, Sparkles, Wind, MessageSquare, ChevronDown, ChevronUp, Star } from 'lucide-react';

const amenityIcons = {
  'High-speed Wi-Fi': <Wifi size={14} />,
  'Smart TV': <Tv size={14} />,
  'Espresso Machine': <Coffee size={14} />,
  'Nespresso Coffee Library': <Coffee size={14} />,
  'Room Service Tablet': <Sparkles size={14} />,
  'Air Conditioning': <Wind size={14} />,
};

// Custom Pakistani reviews/comments for each room category
const pakistaniComments = {
  'Single Room': [
    { name: 'Bilal Khan', city: 'Lahore', rating: 5, text: 'Excellent value! Spent 3 nights for a business summit in Islamabad. Fast Wi-Fi and HBL bank transfer checkout was very convenient.' },
    { name: 'Hamza Naeem', city: 'Peshawar', rating: 4, text: 'Very clean and minimalist single room. The marble shower is high-end. Ideal for corporate travelers.' }
  ],
  'Double Room': [
    { name: 'Ayesha Siddiqui', city: 'Karachi', rating: 5, text: 'Margalla Hills sunset views from this balcony are just stunning. The room service was quick, and we loved the breakfast.' },
    { name: 'Kashif Mahmood', city: 'Faisalabad', rating: 5, text: 'Very comfortable queen bed and professional front desk. Smooth JazzCash mobile payments. Fully recommend!' }
  ],
  'Deluxe Suite': [
    { name: 'Zainab Shah', city: 'Islamabad', rating: 5, text: 'Royal treatment! The butler service was so quick to dispatch housekeeping. Easypaisa payment confirmed immediately. Breathtaking garden terrace.' },
    { name: 'Dr. Fahad Malik', city: 'Multan', rating: 5, text: 'A massive, gorgeous suite. The private terrace and pillow menu were fantastic. Will visit again next season.' }
  ],
  'Presidential Suite': [
    { name: 'Farhan & Sana', city: 'Karachi', rating: 5, text: 'Unmatched luxury in Pakistan! The infinity plunge pool overlooking the pine valleys was out of this world. Worth every single rupee!' },
    { name: 'Mian Mansha Jr.', city: 'Lahore', rating: 5, text: 'Best penthouse stay. Fully secure, private chef, and state-of-the-art room automation. Dedicated VIP shuttle transfers.' }
  ]
};

const RoomCard = ({ room, onSelect }) => {
  const { type, pricePerNight, capacity, description, amenities, images } = room;
  const [showReviews, setShowReviews] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const reviews = pakistaniComments[type] || [];

  return (
    <div style={styles.card} className="glass-panel room-card-container">
      <div style={styles.imageContainer}>
        <img src={images && images.length > 0 ? images[activeImgIdx] : 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'} alt={type} style={styles.image} />
        
        {images && images.length > 1 && (
          <>
            <button 
              type="button" 
              onClick={prevImage} 
              style={styles.carouselLeftBtn}
              className="carousel-nav-btn"
            >
              ‹
            </button>
            <button 
              type="button" 
              onClick={nextImage} 
              style={styles.carouselRightBtn}
              className="carousel-nav-btn"
            >
              ›
            </button>
            <div style={styles.carouselDots}>
              {images.map((_, i) => (
                <span 
                  key={i} 
                  style={{
                    ...styles.dot,
                    background: i === activeImgIdx ? 'var(--gold)' : 'rgba(255,255,255,0.4)'
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div style={styles.priceBadge}>
          <span style={styles.price}>Rs. {pricePerNight.toLocaleString()}</span>
          <span style={styles.perNight}>/ night</span>
        </div>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{type}</h3>
        
        <div style={styles.capacityRow}>
          <Users size={16} style={{ color: 'var(--gold)' }} />
          <span>Accommodates up to <strong>{capacity} {capacity === 1 ? 'Guest' : 'Guests'}</strong></span>
        </div>

        <p style={styles.description}>{description}</p>

        {/* Amenities section */}
        <div style={styles.amenities}>
          {amenities && (showAllAmenities ? amenities : amenities.slice(0, 4)).map((amenity, index) => (
            <span key={index} style={styles.amenityBadge} className="badge">
              {amenityIcons[amenity] || <Sparkles size={14} />}
              {amenity}
            </span>
          ))}
          {amenities && amenities.length > 4 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowAllAmenities(!showAllAmenities);
              }} 
              style={styles.amenityToggleBtn}
              className="amenity-toggle-badge"
              type="button"
            >
              {showAllAmenities ? 'Show less' : `+${amenities.length - 4} more`}
            </button>
          )}
        </div>

        {/* Localized reviews dropdown trigger */}
        <div style={styles.reviewTriggerRow}>
          <button 
            type="button" 
            onClick={() => setShowReviews(!showReviews)} 
            style={styles.reviewToggleBtn}
          >
            <MessageSquare size={14} style={{ color: 'var(--gold)' }} /> 
            <span>Guest Comments ({reviews.length})</span> 
            {showReviews ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Expandable comments list */}
        {showReviews && (
          <div style={styles.reviewsList} className="glass-panel">
            {reviews.map((rev, idx) => (
              <div key={idx} style={styles.reviewItem}>
                <div style={styles.reviewMeta}>
                  <strong>{rev.name}</strong> <span style={{ color: 'var(--text-muted)' }}>({rev.city})</span>
                  <div style={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        fill={i < rev.rating ? 'var(--gold)' : 'none'} 
                        stroke="var(--gold)" 
                      />
                    ))}
                  </div>
                </div>
                <p style={styles.reviewText}>"{rev.text}"</p>
              </div>
            ))}
          </div>
        )}

        <button onClick={onSelect} className="btn-gold" style={styles.bookBtn}>
          Request Reservation
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    transition: 'all 0.4s ease',
    border: '1px solid var(--glass-border)',
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    height: '240px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  priceBadge: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    background: 'rgba(10, 14, 23, 0.88)',
    backdropFilter: 'blur(8px)',
    border: '1px solid var(--gold-glow)',
    padding: '8px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
  },
  price: {
    color: 'var(--gold)',
    fontWeight: '700',
    fontSize: '1.2rem',
    fontFamily: 'var(--font-sans)',
  },
  perNight: {
    fontSize: '0.72rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  content: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexGrow: 1,
  },
  title: {
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  capacityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
  },
  description: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    flexGrow: 1,
  },
  amenities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  },
  amenityBadge: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid var(--border-color)',
  },
  plusMore: {
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
    color: 'var(--gold)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.72rem',
  },
  amenityToggleBtn: {
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    color: 'var(--gold)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewTriggerRow: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '12px',
    marginTop: '4px',
  },
  reviewToggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    textAlign: 'left',
    padding: '4px 0',
    transition: 'var(--transition)',
    fontWeight: '500',
  },
  reviewsList: {
    background: 'var(--bg-tertiary)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid var(--border-color)',
    animation: 'slideDown 0.3s ease-out',
  },
  reviewItem: {
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '8px',
  },
  reviewMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    marginBottom: '4px',
  },
  stars: {
    display: 'flex',
    gap: '2px',
    marginLeft: 'auto',
  },
  reviewText: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    lineHeight: '1.5',
  },
  bookBtn: {
    width: '100%',
    justifyContent: 'center',
    marginTop: '10px',
  },
  carouselLeftBtn: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(10, 14, 23, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'var(--transition)',
  },
  carouselRightBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(10, 14, 23, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'var(--transition)',
  },
  carouselDots: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    display: 'flex',
    gap: '6px',
    zIndex: 10,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
};

// Inject elegant styles for CSS effects
const cardStyles = `
  .room-card-container {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease !important;
  }
  .room-card-container:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg), var(--shadow-glow) !important;
    border-color: var(--gold-glow) !important;
  }
  .room-card-container:hover img {
    transform: scale(1.03);
  }
  .room-card-container button:hover span {
    color: var(--gold);
  }
  .carousel-nav-btn {
    opacity: 0.7;
  }
  .carousel-nav-btn:hover {
    opacity: 1 !important;
    background: var(--gold-gradient) !important;
    color: #000 !important;
    border-color: var(--gold) !important;
  }
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cardStyles));
  document.head.appendChild(style);
}

export default RoomCard;
