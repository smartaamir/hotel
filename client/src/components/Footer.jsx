import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, X } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <footer style={styles.footer} className="glass-panel">
      <div className="container flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-6 flex flex-col gap-4 max-w-[450px]">
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🏰</span>
              <h3 style={styles.logoText}>AURA<span style={{ color: 'var(--gold)' }}>STAY</span></h3>
            </div>
            <p style={styles.desc}>
              An ultra-luxury private enclave of legendary suites and residences. Combining breathtaking locations, exquisite aesthetics, and bespoke 24/7 hospitality.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <h4 style={styles.sectionTitle}>Explore</h4>
            <ul style={styles.list}>
              <li><Link to="/" style={styles.link}>The Resort</Link></li>
              <li><Link to="/rooms" style={styles.link}>Suites & Penthouses</Link></li>
              <li><a href="/#services" style={styles.link}>Bespoke Services</a></li>
              <li><a href="/#testimonials" style={styles.link}>Guest Reviews</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <h4 style={styles.sectionTitle}>Contact & Location</h4>
            <ul style={styles.list}>
              <li style={styles.contactItem}>
                <MapPin size={16} style={styles.contactIcon} />
                <span>Margalla Hills Crest, Sector E-7, Islamabad, Pakistan</span>
              </li>
              <li style={styles.contactItem}>
                <Phone size={16} style={styles.contactIcon} />
                <span>+92 (51) 111-AURA-1</span>
              </li>
              <li style={styles.contactItem}>
                <Mail size={16} style={styles.contactIcon} />
                <span>concierge@aurastay.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-[30px] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)] text-center sm:text-left">
          <p>© {currentYear} AuraStay Luxury Resorts & Residences. All rights reserved.</p>
          <div className="flex gap-5">
            <button onClick={() => setShowPrivacyModal(true)} style={styles.bottomLinkBtn}>Privacy Policy</button>
            <button onClick={() => setShowTermsModal(true)} style={styles.bottomLinkBtn}>Terms of Luxury Stay</button>
          </div>
        </div>
      </div>

      {/* 1. Privacy Policy Modal */}
      {showPrivacyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} className="glass-panel">
            <div style={styles.modalHeader}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold)' }}>Privacy Policy & Data Security</h3>
              <button onClick={() => setShowPrivacyModal(false)} style={styles.closeBtn}><X size={20} /></button>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalText}>
                <strong>AuraStay Luxury Resorts & Residences</strong> respects your privacy and is committed to protecting your personal information. Under the Pakistan Digital Personal Data Protection guidelines, we guarantee:
              </p>
              <ul style={styles.modalBulletList}>
                <li><strong>Secured Stay Ledger Matrices</strong>: All checkout payment data, credit cards, bank transfer slips, and mobile wallet details are secured using robust SSL/TLS encryptions.</li>
                <li><strong>No Profile Mining</strong>: Google identity records are only utilized to register your primary profile name, email, and verified Pakistani phone registry.</li>
                <li><strong>Exclusive MERN Handshakes</strong>: Data is strictly handled internally and never sold or shared with foreign advertisement networks.</li>
              </ul>
              <p style={{ ...styles.modalText, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                Last revised: May 2026. For questions regarding data erasure, contact concierge@aurastay.com.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Terms of Luxury Stay Modal */}
      {showTermsModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} className="glass-panel">
            <div style={styles.modalHeader}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold)' }}>Terms of Luxury Stay</h3>
              <button onClick={() => setShowTermsModal(false)} style={styles.closeBtn}><X size={20} /></button>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalText}>
                By requesting reservations and booking a stay at AuraStay, you agree to our terms:
              </p>
              <ul style={styles.modalBulletList}>
                <li><strong>Strict Halal Environment</strong>: AuraStay maintains a 100% Halal environment. Importing or consuming alcohol, wine, or prohibited substances is strictly prohibited on the resort premises.</li>
                <li><strong>Resort Allocation Authority</strong>: Room numbers are strictly assigned by administration officers based on booking dates and real-time vacancies to prevent overlapping double reservations.</li>
                <li><strong>Refund & Cancellation</strong>: Customers can cancel bookings from their guest dashboard before check-in, triggering an immediate simulated refund authorization to the original payment channel (JazzCash, Easypaisa, Card, or HBL Bank).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: '80px',
    borderTop: '1px solid var(--border-color)',
    borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0',
    padding: '60px 0 30px 0',
    background: 'var(--bg-secondary)',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: 'none',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1.5fr',
    gap: '40px',
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '450px',
  },
  logo: {
    display: 'flex',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.3rem',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.7',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '8px',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    transition: 'var(--transition)',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  contactIcon: {
    color: 'var(--gold)',
    marginTop: '3px',
    flexShrink: 0,
  },
  bottom: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  bottomLinks: {
    display: 'flex',
    gap: '20px',
  },
  bottomLinkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(5, 7, 12, 0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 3000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '550px',
    background: 'var(--bg-secondary)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    padding: '30px',
    boxShadow: 'var(--shadow-lg)',
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
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  modalText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  modalBulletList: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    lineHeight: '1.5',
  },
};

// Add hover styling via CSS style block
const hoverStyle = `
footer button:hover {
  color: var(--gold) !important;
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(hoverStyle));
  document.head.appendChild(style);
}

export default Footer;
