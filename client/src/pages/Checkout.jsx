import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Wallet, Landmark, AlertTriangle, CheckCircle2, Phone, Calendar, Sparkles } from 'lucide-react';

const RESTAURANT_MENU = [
  { id: 'steak', name: 'Flame-Grilled Margalla Beef Steak', price: 5500, icon: '🥩' },
  { id: 'kebab', name: 'Imperial Seekh Kebab Platter', price: 3500, icon: '🍢' },
  { id: 'biryani', name: 'Royal Saffron Mutton Biryani', price: 4200, icon: '🍛' },
  { id: 'paneer', name: 'Shahi Paneer Handi', price: 2800, icon: '🍲' },
  { id: 'zamzam', name: 'Artisanal Zamzam Mint Mojito', price: 1200, icon: '🍹' },
  { id: 'kulfi', name: 'Gold Leaf Pistachio Kulfi', price: 1500, icon: '🍨' }
];

const JazzCashLogo = ({ size = 20 }) => (
  <svg width={size * 2.5} height={size} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', borderRadius: '4px' }}>
    <rect width="100" height="40" rx="6" fill="#000000" />
    <rect x="1.5" y="1.5" width="97" height="37" rx="5.5" fill="#E61C24" stroke="#FFE600" strokeWidth="1" />
    {/* Overlapping gold and red circles mimicking the authentic brand mark */}
    <circle cx="21" cy="20" r="9" fill="#FFE600" />
    <circle cx="29" cy="20" r="9" fill="#E61C24" opacity="0.85" />
    <text x="43" y="25" fill="#FFFFFF" fontFamily="'Montserrat', 'Arial Black', sans-serif" fontSize="13" fontWeight="900" letterSpacing="-0.5">Jazz</text>
    <text x="73" y="25" fill="#FFE600" fontFamily="'Montserrat', 'Arial Black', sans-serif" fontSize="10" fontWeight="900">Cash</text>
  </svg>
);

const EasypaisaLogo = ({ size = 20 }) => (
  <svg width={size * 2.5} height={size} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', borderRadius: '4px' }}>
    <rect width="100" height="40" rx="6" fill="#000000" />
    <rect x="1.5" y="1.5" width="97" height="37" rx="5.5" fill="#00A859" stroke="#90E0EF" strokeWidth="1" />
    {/* Circular emblem with white tick/leaf shape */}
    <g transform="translate(10, 8)">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10.2 16.6L6.6 13L8 11.6L10.2 13.8L15.6 8.4L17 9.8L10.2 16.6Z" fill="#FFFFFF" />
    </g>
    <text x="38" y="24" fill="#FFFFFF" fontFamily="'Montserrat', 'Arial Black', sans-serif" fontSize="10" fontWeight="900" letterSpacing="-0.2">easy</text>
    <text x="65" y="24" fill="#8AE83A" fontFamily="'Montserrat', 'Arial Black', sans-serif" fontSize="9" fontWeight="900" letterSpacing="-0.2">paisa</text>
  </svg>
);

const HBLLogo = ({ size = 20 }) => (
  <svg width={size * 2.5} height={size} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', borderRadius: '4px' }}>
    <rect width="100" height="40" rx="6" fill="#000000" />
    <rect x="1.5" y="1.5" width="97" height="37" rx="5.5" fill="#006B54" stroke="#00E676" strokeWidth="1" />
    {/* 3D diamond symbol */}
    <path d="M22 6L33 17L22 28L11 17L22 6Z" fill="#00A88F" />
    <path d="M22 10L30 17L22 24L14 17L22 10Z" fill="#FFFFFF" opacity="0.9" />
    <path d="M22 14L27 17L22 20L17 17L22 14Z" fill="#006B54" />
    <text x="44" y="25" fill="#FFFFFF" fontFamily="'Montserrat', 'Arial Black', sans-serif" fontSize="15" fontWeight="900" letterSpacing="0.8">HBL</text>
  </svg>
);

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getAuthHeaders } = useAuth();
  
  const bookingDetails = location.state;

  useEffect(() => {
    if (!bookingDetails) {
      navigate('/rooms');
    }
  }, [bookingDetails, navigate]);

  if (!bookingDetails) {
    return null;
  }

  const { roomType, checkInDate, checkOutDate, pricePerNight, guests } = bookingDetails;
  
  // Stay Duration
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)));

  // Restaurant & Dining Options States
  const [diningPlan, setDiningPlan] = useState('none'); // 'none', 'breakfast', 'half', 'full'
  const diningRate = diningPlan === 'none' ? 0 : (diningPlan === 'breakfast' ? 2500 : (diningPlan === 'half' ? 6000 : 11000));
  
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const menuCost = selectedMenuItems.reduce((sum, itemId) => sum + (RESTAURANT_MENU.find(m => m.id === itemId)?.price || 0), 0);
  const diningCost = (diningRate * (guests || 1) * nights) + menuCost;

  const handleToggleMenuItem = (itemId) => {
    if (selectedMenuItems.includes(itemId)) {
      setSelectedMenuItems(selectedMenuItems.filter(id => id !== itemId));
    } else {
      setSelectedMenuItems([...selectedMenuItems, itemId]);
    }
  };

  // Bespoke Amenities States
  const [extraMattress, setExtraMattress] = useState(false);
  const [premiumMinibar, setPremiumMinibar] = useState(false);
  const [vipLounge, setVipLounge] = useState(false);
  const [prayerKit, setPrayerKit] = useState(false);

  const mattressCost = extraMattress ? (3000 * nights) : 0;
  const minibarCost = premiumMinibar ? (1500 * nights) : 0;
  const loungeCost = vipLounge ? (5000 * nights) : 0;
  const prayerCost = prayerKit ? 1000 : 0;
  const amenitiesCost = mattressCost + minibarCost + loungeCost + prayerCost;

  // Calculations
  const subtotal = (pricePerNight * nights) + diningCost + amenitiesCost;
  const tax = Math.round(subtotal * 0.12); // 12% Luxury Tax & Resort Fees
  const grandTotal = subtotal + tax;

  // Checkout States
  const [payMethod, setPayMethod] = useState('jazzcash'); // 'jazzcash', 'easypaisa', 'bank'
  const [guestNotes, setGuestNotes] = useState('');

  // Mobile Wallet Account States
  const [mobileNumber, setMobileNumber] = useState('');

  // Bank Transfer States
  const [bankReceiptRef, setBankReceiptRef] = useState('');
  
  // Payment Proof File Upload States
  const [paymentProof, setPaymentProof] = useState('');
  const [paymentProofName, setPaymentProofName] = useState('');

  // Payment processing states
  const [step, setStep] = useState('form'); // 'form' -> 'processing' -> 'success'
  const [processingMsg, setProcessingMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProofName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result); // Base64 representation of image file
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setMobileNumber(value);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setValidationError('');

    // Screenshot Proof Verification is mandatory for manual PK channels
    if (!paymentProof) {
      setValidationError('Please select and upload a receipt screenshot of your payment as proof of payment.');
      return;
    }

    if (payMethod === 'jazzcash' || payMethod === 'easypaisa') {
      // 11 digits, starts with 03
      const walletRegex = /^03\d{9}$/;
      if (!walletRegex.test(mobileNumber)) {
        setValidationError(`Invalid Mobile Account. Please enter a valid 11-digit Pakistani ${payMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} number starting with 03 (e.g. 03001234567).`);
        return;
      }
    } else if (payMethod === 'bank') {
      // Starts with FT- or TX- followed by 8 to 12 alphanumeric characters
      const refRegex = /^(FT|TX)-[A-Z0-9]{8,12}$/i;
      if (!refRegex.test(bankReceiptRef.trim())) {
        setValidationError('Invalid Receipt Reference. Must be in FT-xxxxxx or TX-xxxxxx format (8 to 12 letters/digits following the prefix, e.g. FT-12938401).');
        return;
      }
    }

    setStep('processing');
    
    // Simulate PK payment gateway stages
    let stages = [];
    if (payMethod === 'jazzcash') {
      stages = [
        { msg: 'Initiating JazzCash Mobile Wallet payment request...', delay: 1000 },
        { msg: `Pushing secure USSD/App payment request to ${mobileNumber}...`, delay: 2000 },
        { msg: 'Awaiting customer MPIN authentication on mobile device...', delay: 3500 },
        { msg: 'JazzCash transaction approved! Syncing ledger codes...', delay: 4800 }
      ];
    } else if (payMethod === 'easypaisa') {
      stages = [
        { msg: 'Connecting to Telenor Microfinance banking core...', delay: 1000 },
        { msg: `Sending payment approval alert to Easypaisa Account ${mobileNumber}...`, delay: 2200 },
        { msg: 'Waiting for guest wallet authentication confirmation...', delay: 3500 },
        { msg: 'Easypaisa API transaction authorized successfully...', delay: 4800 }
      ];
    } else if (payMethod === 'bank') {
      stages = [
        { msg: 'Submitting deposit details to corporate billing desk...', delay: 1000 },
        { msg: `Verifying receipt reference ${bankReceiptRef} with HBL portal...`, delay: 2500 },
        { msg: 'Receipt check complete. Registering pending bank clearance...', delay: 4500 }
      ];
    }

    stages.forEach((s) => {
      setTimeout(() => {
        setProcessingMsg(s.msg);
      }, s.delay);
    });

    // Complete transaction
    setTimeout(() => {
      setStep('success');
    }, 6000);
  };

  const handleDone = async () => {
    const prefix = payMethod === 'bank' ? 'FT_HBL_' : 'TX_' + payMethod.toUpperCase() + '_';
    const simulatedTx = prefix + Math.random().toString(36).substring(2, 11).toUpperCase();
    
    let methodLabel = payMethod === 'jazzcash' ? 'JazzCash' : (payMethod === 'easypaisa' ? 'Easypaisa' : 'Bank Transfer');
    
    let diningLabel = diningPlan === 'none' ? 'None' : (diningPlan === 'breakfast' ? 'Breakfast Buffet' : (diningPlan === 'half' ? 'Half-Board' : 'Full-Board'));
    if (selectedMenuItems.length > 0) {
      const selectedDishNames = selectedMenuItems.map(id => RESTAURANT_MENU.find(m => m.id === id)?.name).join(', ');
      diningLabel = diningLabel === 'None' ? selectedDishNames : `${diningLabel} + Custom Order: ${selectedDishNames}`;
    }
    
    const activeAmenities = [];
    if (extraMattress) activeAmenities.push('Extra Mattress');
    if (premiumMinibar) activeAmenities.push('Premium Minibar');
    if (vipLounge) activeAmenities.push('VIP Lounge Access');
    if (prayerKit) activeAmenities.push('Prayer Kit Pro');

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          roomType,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          totalPrice: grandTotal,
          guestNotes,
          transactionId: simulatedTx,
          paymentMethod: methodLabel,
          diningPlan: diningLabel,
          extraAmenities: activeAmenities,
          paymentProof
        })
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to book stay', error);
      alert('A network error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <div className="container" style={{ marginTop: '40px' }}>
        
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-[30px]">
          <Link to="/rooms" style={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Rooms & Suites
          </Link>
          <div className="text-left sm:text-right">
            <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Secure checkout</span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: '#fff', marginTop: '2px' }}>Curate Your Royal stay</h2>
          </div>
        </div>

        <div className="glass-panel bg-[var(--bg-secondary)] rounded-[var(--border-radius-lg)] border border-[var(--border-color)] shadow-lg p-5 md:p-10 mb-10">
          
          {step === 'form' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10">
              
              {/* Left Column: Bill Invoice Summary */}
              <div style={styles.leftCol}>
                <h3 style={styles.subHeading}>Stay Invoice Summary</h3>
                <div style={styles.billDetails}>
                  <div style={styles.billRow}>
                    <span>Suite Category</span>
                    <strong>{roomType}</strong>
                  </div>
                  <div style={styles.billRow}>
                    <span>Nightly Rate</span>
                    <strong>Rs. {pricePerNight.toLocaleString()}</strong>
                  </div>
                  <div style={styles.billRow}>
                    <span>Total Duration</span>
                    <strong>{nights} {nights === 1 ? 'Night' : 'Nights'}</strong>
                  </div>
                  <div style={styles.billRow}>
                    <span>Check-In Date</span>
                    <strong>{checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </div>
                  <div style={styles.billRow}>
                    <span>Check-Out Date</span>
                    <strong>{checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </div>
                  
                  <hr style={styles.hr} />

                  <div style={styles.billRow}>
                    <span>Room Base Rental</span>
                    <span>Rs. {(pricePerNight * nights).toLocaleString()}</span>
                  </div>
                  {(diningRate * (guests || 1) * nights) > 0 && (
                    <div style={styles.billRow}>
                      <span>Dining Plan ({diningPlan === 'breakfast' ? 'Breakfast' : diningPlan === 'half' ? 'Half-Board' : 'Full-Board'})</span>
                      <span>Rs. {(diningRate * (guests || 1) * nights).toLocaleString()}</span>
                    </div>
                  )}
                  {menuCost > 0 && (
                    <div style={styles.billRow}>
                      <span>Gourmet Restaurant Order</span>
                      <span>Rs. {menuCost.toLocaleString()}</span>
                    </div>
                  )}
                  {amenitiesCost > 0 && (
                    <div style={styles.billRow}>
                      <span>Bespoke Amenities</span>
                      <span>Rs. {amenitiesCost.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <hr style={styles.hr} />

                  <div style={styles.billRow}>
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div style={styles.billRow}>
                    <span>Resort Fees & Luxury Taxes (12%)</span>
                    <span>Rs. {tax.toLocaleString()}</span>
                  </div>
                  
                  <hr style={styles.hr} />
                  
                  <div style={{ ...styles.billRow, fontSize: '1.15rem' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: '600' }}>Amount Due</span>
                    <strong style={{ color: 'var(--gold)', fontSize: '1.25rem' }}>Rs. {grandTotal.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label>Special Instructions & Guest Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="E.g., Margalla hill sunset view, high floor room, extra pillow preferences..."
                    value={guestNotes}
                    onChange={(e) => setGuestNotes(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Restaurant Dining Tab Selector */}
                <div style={{ marginTop: '20px' }}>
                  <label style={styles.optionLabel}>🍽️ Restaurant & Dining Options</label>
                  <div className="flex flex-wrap sm:flex-nowrap gap-1 md:gap-[6px] bg-[var(--bg-tertiary)] p-1 rounded-lg border border-[var(--border-color)]">
                    <button
                      type="button"
                      style={diningPlan === 'none' ? styles.activeDiningTab : styles.diningTab}
                      onClick={() => setDiningPlan('none')}
                    >
                      None
                    </button>
                    <button
                      type="button"
                      style={diningPlan === 'breakfast' ? styles.activeDiningTab : styles.diningTab}
                      onClick={() => setDiningPlan('breakfast')}
                    >
                      Breakfast
                    </button>
                    <button
                      type="button"
                      style={diningPlan === 'half' ? styles.activeDiningTab : styles.diningTab}
                      onClick={() => setDiningPlan('half')}
                    >
                      Half-Board
                    </button>
                    <button
                      type="button"
                      style={diningPlan === 'full' ? styles.activeDiningTab : styles.diningTab}
                      onClick={() => setDiningPlan('full')}
                    >
                      Full-Board
                    </button>
                  </div>
                  {diningPlan !== 'none' && (
                    <span style={{ ...styles.optionHelp, display: 'block', marginTop: '8px', lineHeight: '1.4' }}>
                      {diningPlan === 'breakfast' && "🍳 Breakfast Buffet (Rs. 2,500/guest/night): Traditional Halal Buffet, fresh organic juices, and eggs cooked to order."}
                      {diningPlan === 'half' && "🍱 Half-Board (Rs. 6,000/guest/night): Includes a rich Breakfast Buffet plus a multi-cuisine evening Dinner Buffet."}
                      {diningPlan === 'full' && "👑 Full-Board (Rs. 11,000/guest/night): Ultimate dining package. Includes Breakfast Buffet, Lunch, afternoon Hi-Tea, and Dinner Buffet."}
                    </span>
                  )}
                </div>

                {/* Gourmet Custom Order Menu */}
                <div style={{ marginTop: '20px' }}>
                  <label style={styles.optionLabel}>🍛 Customize Stay Dining (Gourmet Menu Orders)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
                    {RESTAURANT_MENU.map((item) => (
                      <label key={item.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-tertiary)',
                        border: selectedMenuItems.includes(item.id) ? '1px solid var(--gold)' : '1px solid var(--border-color)',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'all 0.3s ease'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedMenuItems.includes(item.id)}
                          onChange={() => handleToggleMenuItem(item.id)}
                          style={{
                            cursor: 'pointer',
                            accentColor: 'var(--gold)',
                            width: '15px',
                            height: '15px',
                            WebkitAppearance: 'checkbox',
                            appearance: 'checkbox'
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.icon} {item.name}</span>
                          <strong style={{ color: 'var(--gold)', marginTop: '2px', fontSize: '0.78rem' }}>Rs. {item.price.toLocaleString()}</strong>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Extra Amenities Section */}
                <div style={{ marginTop: '20px' }}>
                  <label style={styles.optionLabel}>✨ Bespoke Stay Amenities</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
                    <label style={styles.amenityLabel}>
                      <input
                        type="checkbox"
                        checked={extraMattress}
                        onChange={(e) => setExtraMattress(e.target.checked)}
                        style={styles.checkbox}
                      />
                      <span>Extra Mattress (Rs. 3000/n)</span>
                    </label>
                    <label style={styles.amenityLabel}>
                      <input
                        type="checkbox"
                        checked={premiumMinibar}
                        onChange={(e) => setPremiumMinibar(e.target.checked)}
                        style={styles.checkbox}
                      />
                      <span>Premium Minibar (Rs. 1500/n)</span>
                    </label>
                    <label style={styles.amenityLabel}>
                      <input
                        type="checkbox"
                        checked={vipLounge}
                        onChange={(e) => setVipLounge(e.target.checked)}
                        style={styles.checkbox}
                      />
                      <span>VIP Lounge (Rs. 5000/n)</span>
                    </label>
                    <label style={styles.amenityLabel}>
                      <input
                        type="checkbox"
                        checked={prayerKit}
                        onChange={(e) => setPrayerKit(e.target.checked)}
                        style={styles.checkbox}
                      />
                      <span>Prayer Kit Pro (Rs. 1000 flat)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Form and Methods Selector */}
              <div style={styles.rightCol}>
                <h3 style={styles.subHeading}>Select Pakistani Payment Method</h3>

                {validationError && (
                  <div style={styles.errorAlert}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span>{validationError}</span>
                  </div>
                )}
                
                {/* Payment Methods Selection Tabs */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-6 bg-[var(--bg-tertiary)] p-1 rounded-lg border border-[var(--border-color)]">
                  <button
                    type="button"
                    style={{
                      ...styles.tab,
                      background: payMethod === 'jazzcash' ? 'rgba(211, 47, 47, 0.15)' : 'transparent',
                      border: payMethod === 'jazzcash' ? '1px solid #D32F2F' : '1px solid transparent',
                      borderRadius: '6px',
                      opacity: payMethod === 'jazzcash' ? 1 : 0.6
                    }}
                    onClick={() => setPayMethod('jazzcash')}
                  >
                    <JazzCashLogo size={24} />
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.tab,
                      background: payMethod === 'easypaisa' ? 'rgba(0, 168, 89, 0.15)' : 'transparent',
                      border: payMethod === 'easypaisa' ? '1px solid #00A859' : '1px solid transparent',
                      borderRadius: '6px',
                      opacity: payMethod === 'easypaisa' ? 1 : 0.6
                    }}
                    onClick={() => setPayMethod('easypaisa')}
                  >
                    <EasypaisaLogo size={24} />
                  </button>
                  <button
                    type="button"
                    style={{
                      ...styles.tab,
                      background: payMethod === 'bank' ? 'rgba(0, 106, 78, 0.15)' : 'transparent',
                      border: payMethod === 'bank' ? '1px solid #006A4E' : '1px solid transparent',
                      borderRadius: '6px',
                      opacity: payMethod === 'bank' ? 1 : 0.6
                    }}
                    onClick={() => setPayMethod('bank')}
                  >
                    <HBLLogo size={24} />
                  </button>
                </div>

                <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  
                  {/* Method 1 & 2: JazzCash / Easypaisa Wallet */}
                  {(payMethod === 'jazzcash' || payMethod === 'easypaisa') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div style={styles.walletBox} className="glass-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ ...styles.walletCircle, background: payMethod === 'jazzcash' ? '#e62e2d' : '#00a651' }}>
                            <Wallet size={20} color="#fff" />
                          </div>
                          <div>
                            <h4 style={{ textTransform: 'capitalize', color: '#fff' }}>{payMethod} Instant Checkout</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              Pay securely using your registered mobile account. You will receive an instant payment prompt / USSD dialog on your phone to complete authentication.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>{payMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} Mobile Account Number</label>
                        <div style={{ position: 'relative' }}>
                          <Phone size={16} style={styles.inputIcon} />
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="e.g. 03001234567"
                            value={mobileNumber}
                            onChange={handleMobileNumberChange}
                            style={{ paddingLeft: '40px' }}
                            required
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Enter 11-digit mobile wallet number starting with 03.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Method 3: Direct Bank Transfer */}
                  {payMethod === 'bank' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={styles.bankDetailBox}>
                        <h4 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Official HBL Account Details</h4>
                        <div style={styles.bankDetailRow}><span>Bank:</span> <strong>Habib Bank Limited (HBL)</strong></div>
                        <div style={styles.bankDetailRow}><span>Account Title:</span> <strong>AuraStay Luxury Resorts</strong></div>
                        <div style={styles.bankDetailRow}><span>Account Number:</span> <strong>1234-79010203-03</strong></div>
                        <div style={styles.bankDetailRow}><span>IBAN:</span> <strong>PK77 HABB 0012 3479 0102 0303</strong></div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                          Please transfer the exact invoice amount to this HBL account and enter your transfer deposit transaction reference slip number below.
                        </p>
                      </div>

                      <div className="form-group">
                        <label>Deposit Receipt / Transaction Ref Slip Number</label>
                        <div style={{ position: 'relative' }}>
                          <Landmark size={16} style={styles.inputIcon} />
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., FT261479830PK"
                            value={bankReceiptRef}
                            onChange={(e) => setBankReceiptRef(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Receipt Screenshot Upload Field for Manual Transfer Methods */}
                  <div className="form-group" style={{ marginTop: '14px', marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      Upload Payment Receipt Screenshot *
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                      <input
                        type="file"
                        id="receiptUpload"
                        accept="image/*"
                        onChange={handleProofUpload}
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor="receiptUpload" 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '10px 14px',
                          border: '1px dashed var(--gold)',
                          background: 'rgba(212, 175, 55, 0.05)',
                          borderRadius: '8px',
                          color: 'var(--gold)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          textAlign: 'center',
                          transition: 'var(--transition)'
                        }}
                      >
                        📷 {paymentProofName ? 'Change Receipt Screenshot' : 'Choose Receipt Screenshot'}
                      </label>
                      {paymentProofName && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{paymentProofName}</span>
                          <img src={paymentProof} alt="Receipt Preview" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <button type="submit" className="btn-gold" style={styles.payBtn}>
                    Confirm & Reserve stay
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* Phase 2: Processing Authorization */}
          {step === 'processing' && (
            <div style={styles.loaderBox}>
              <div style={styles.spinner}></div>
              <h3 style={styles.processingTitle}>Authorizing PK Ledger</h3>
              <p style={styles.processingSubtitle}>{processingMsg || 'Syncing transaction grids...'}</p>
            </div>
          )}

          {/* Phase 3: Successful screen */}
          {step === 'success' && (
            <div style={styles.successBox}>
              <CheckCircle2 size={64} style={{ color: 'var(--emerald)' }} />
              <h3 style={styles.successTitle}>Payment Verified</h3>
              <p style={styles.successSubtitle}>
                Your stay payment has been successfully recorded. Your booking is registered and currently pending room assignment and final administrator confirmation.
              </p>
              
              <div style={styles.receiptBox}>
                <div style={styles.receiptRow}>
                  <span>Billing Status</span>
                  <span className="badge badge-success">PAID</span>
                </div>
                <div style={styles.receiptRow}>
                  <span>Payment Mode</span>
                  <span style={{ textTransform: 'uppercase', fontWeight: '600', color: 'var(--gold)' }}>{payMethod}</span>
                </div>
                
                <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '8px 0' }} />
                
                <div style={styles.receiptRow}>
                  <span>Base Room Rent ({nights} {nights === 1 ? 'Night' : 'Nights'})</span>
                  <span>Rs. {(pricePerNight * nights).toLocaleString()}</span>
                </div>
                {(diningRate * (guests || 1) * nights) > 0 && (
                  <div style={styles.receiptRow}>
                    <span>Dining Plan ({diningPlan === 'breakfast' ? 'Breakfast' : diningPlan === 'half' ? 'Half-Board' : 'Full-Board'})</span>
                    <span>Rs. {(diningRate * (guests || 1) * nights).toLocaleString()}</span>
                  </div>
                )}
                {menuCost > 0 && (
                  <div style={styles.receiptRow}>
                    <span>Gourmet Restaurant Order</span>
                    <span>Rs. {menuCost.toLocaleString()}</span>
                  </div>
                )}
                {amenitiesCost > 0 && (
                  <div style={styles.receiptRow}>
                    <span>Bespoke Amenities</span>
                    <span>Rs. {amenitiesCost.toLocaleString()}</span>
                  </div>
                )}
                <div style={styles.receiptRow}>
                  <span>Luxury Taxes & Fees (12%)</span>
                  <span>Rs. {tax.toLocaleString()}</span>
                </div>
                
                <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '8px 0' }} />

                <div style={styles.receiptRow}>
                  <span style={{ color: 'var(--gold)', fontWeight: '600' }}>Adjusted Room Rent Fare</span>
                  <strong style={{ color: 'var(--gold)', fontSize: '1.15rem' }}>Rs. {grandTotal.toLocaleString()}</strong>
                </div>
                <div style={styles.receiptRow}>
                  <span>Transaction Ref</span>
                  <code>TX_PKR_SIMULATED_AURA_OK</code>
                </div>
              </div>

              <button onClick={handleDone} className="btn-gold" style={styles.doneBtn}>
                Access Guest Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    paddingBottom: '80px',
    background: 'var(--bg-primary)',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  checkoutPanel: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--border-radius-lg)',
    border: '1px solid var(--border-color)',
    padding: '40px',
    boxShadow: 'var(--shadow-lg)',
  },
  subHeading: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '20px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-title)',
  },
  split: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.05fr',
    gap: '40px',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  billDetails: {
    background: 'var(--bg-tertiary)',
    padding: '24px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  billRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid var(--border-color)',
    margin: '4px 0',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    background: 'var(--bg-tertiary)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  activeTab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: 'var(--gold-gradient)',
    border: 'none',
    color: '#000',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)',
  },
  walletBox: {
    padding: '18px',
    background: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  walletCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankDetailBox: {
    padding: '20px',
    background: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  bankDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    borderBottom: '1px dashed var(--border-color)',
    paddingBottom: '8px',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  payBtn: {
    marginTop: 'auto',
    width: '100%',
    height: '50px',
    fontSize: '0.95rem',
    justifyContent: 'center',
    fontWeight: '600',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #ef4444',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '0.85rem',
    marginBottom: '20px',
  },
  loaderBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    textAlign: 'center',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--gold)',
    borderRadius: '50%',
    animation: 'spin 1s infinite linear',
  },
  processingTitle: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-title)',
    marginTop: '20px',
    color: '#fff',
  },
  processingSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '8px',
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    textAlign: 'center',
    maxWidth: '550px',
    margin: '0 auto',
  },
  successTitle: {
    fontSize: '1.6rem',
    fontFamily: 'var(--font-title)',
    color: '#fff',
    marginTop: '20px',
  },
  successSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '12px',
    lineHeight: '1.6',
  },
  receiptBox: {
    width: '100%',
    background: 'var(--bg-tertiary)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    padding: '24px',
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
  },
  doneBtn: {
    width: '100%',
    height: '48px',
    justifyContent: 'center',
    fontWeight: '600',
  },
  optionLabel: {
    display: 'block',
    fontSize: '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    marginBottom: '8px',
  },
  diningTabs: {
    display: 'flex',
    gap: '6px',
    background: 'var(--bg-tertiary)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  diningTab: {
    flex: 1,
    padding: '8px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.78rem',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
  },
  activeDiningTab: {
    flex: 1,
    padding: '8px',
    background: 'var(--gold-gradient)',
    border: 'none',
    color: '#000',
    fontSize: '0.78rem',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  optionHelp: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    marginTop: '6px',
    display: 'block',
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '10px',
  },
  amenityLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
  checkbox: {
    cursor: 'pointer',
    accentColor: 'var(--gold)',
    width: '16px',
    height: '16px',
    WebkitAppearance: 'checkbox',
    appearance: 'checkbox',
  }
};



export default Checkout;
