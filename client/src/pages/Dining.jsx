import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Utensils, CheckCircle2, Phone, Landmark, AlertTriangle } from 'lucide-react';

const RESTAURANT_MENU = [
  {
    id: 'breakfast-1',
    category: 'Breakfast',
    name: 'Royal Halwa Puri Platter',
    price: 1500,
    description: 'Freshly puffed semolina puraye fried in premium oil, served with hot aromatic Lahori chana masala, soft sweet suji halwa, and local spicy pickles.',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80',
    tags: ['Traditional', 'Popular'],
    serves: 'Serves 1-2'
  },
  {
    id: 'breakfast-2',
    category: 'Breakfast',
    name: 'Lahori Murgh Cholay',
    price: 1800,
    description: 'Slow-simmered tender chicken pieces and whole organic chickpeas cooked in spicy traditional gravy, seasoned with black peppers, served with hot butter tandoori naan.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    tags: ['Spicy', 'Mughlai'],
    serves: 'Serves 2'
  },
  {
    id: 'breakfast-3',
    category: 'Breakfast',
    name: 'Classic Aura Cheese Omelette',
    price: 1200,
    description: 'Three fluffy organic farm eggs whipped with local herbs, cheddar cheese, bell peppers, onions, and green chillies, served with sourdough toast and hash browns.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    tags: ['Organic', 'Classic'],
    serves: 'Serves 1'
  },
  {
    id: 'breakfast-4',
    category: 'Breakfast',
    name: 'Royal Beef Shank Nihari',
    price: 3200,
    description: 'Aromatic beef shank slow-cooked overnight in traditional spices and bone marrow gravy, garnished with fresh ginger, lemon, and hot khamiri naan.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    tags: ['Desi Feast', 'Rich Gravy'],
    serves: 'Serves 2'
  },
  {
    id: 'breakfast-5',
    category: 'Breakfast',
    name: 'Aura Premium English Breakfast',
    price: 2100,
    description: 'Two eggs cooked to order, crisp golden hash browns, grilled vine tomatoes, sautéed garlic mushrooms, premium house sausage, artisanal butter, and toast.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
    tags: ['Continental', 'Premium'],
    serves: 'Serves 1'
  },
  {
    id: 'breakfast-6',
    category: 'Breakfast',
    name: 'Organic Honey & Saffron Oatmeal',
    price: 1100,
    description: 'Organic rolled oats slow-cooked in rich farm milk, infused with Kashmiri saffron, topped with wild honeycomb, organic seeds, and fresh berries.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    tags: ['Healthy', 'Organic'],
    serves: 'Serves 1'
  },
  {
    id: 'lunch-1',
    category: 'Lunch',
    name: 'Flame-Grilled Margalla Beef Steak',
    price: 5500,
    description: 'Prime cut aged beef tenderloin charcoal grilled, served with roasted seasonal rosemary potatoes, asparagus, and a rich pepper mushroom reduction sauce.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    tags: ['Signature', 'Premium Choice'],
    serves: 'Serves 1'
  },
  {
    id: 'lunch-2',
    category: 'Lunch',
    name: 'Imperial Seekh Kebab Platter',
    price: 3500,
    description: 'Succulent hand-minced beef and chicken seekh kebab skewers char-broiled over organic wood coals, served with refreshing mint chutney and butter naan.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
    tags: ['Hot Seller', 'Charcoal Grill'],
    serves: 'Serves 2'
  },
  {
    id: 'lunch-3',
    category: 'Lunch',
    name: 'Chicken Karahi Handi (Half)',
    price: 2900,
    description: 'Juicy chicken cuts simmered in a rich tomato base, green chillies, ginger slivers, and freshly ground secret spices, cooked in a traditional clay handi.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    tags: ['Desi Favorite', 'Spicy'],
    serves: 'Serves 2-3'
  },
  {
    id: 'lunch-4',
    category: 'Lunch',
    name: 'Hand-Pulled Peshawari Mutton Karahi',
    price: 4500,
    description: 'Tender local mutton cooked in fresh tomatoes, green chilies, ginger, black pepper, and animal fat in a traditional iron wok, served with hot naans.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
    tags: ['Traditional', 'Chef Special'],
    serves: 'Serves 2-3'
  },
  {
    id: 'lunch-5',
    category: 'Lunch',
    name: 'Royal Mughlai Murgh Korma',
    price: 3100,
    description: 'Succulent chicken simmered in a velvet golden yogurt gravy, scented with rosewater, caramelized onions, green cardamoms, and sliced almonds.',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80',
    tags: ['Royal', 'Mild Spice'],
    serves: 'Serves 2'
  },
  {
    id: 'lunch-6',
    category: 'Lunch',
    name: 'Charcoal Grilled Atlantic Salmon',
    price: 5800,
    description: 'Woodfire-grilled salmon fillet, brushed with citrus dill butter, served over a bed of saffron basmati pilaf and charred lemon.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    tags: ['Seafood', 'Luxury'],
    serves: 'Serves 1'
  },
  {
    id: 'dinner-1',
    category: 'Dinner',
    name: 'Royal Saffron Mutton Biryani',
    price: 4200,
    description: 'Aromatic basmati rice layered with premium tender mutton shank, infused with authentic saffron threads, dry plums, cardamom, and rose water, garnished with golden raisins.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    tags: ['Heritage Royal', 'Must Try'],
    serves: 'Serves 2'
  },
  {
    id: 'dinner-2',
    category: 'Dinner',
    name: 'Mughlai Butter Chicken',
    price: 3200,
    description: 'Boneless clay-oven roasted chicken tikka chunks cooked in an velvety butter, tomato, cashew paste, and fresh cream gravy, delicately flavored with sweet fenugreek.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    tags: ['Mughlai Classic', 'Mild Spice'],
    serves: 'Serves 2'
  },
  {
    id: 'dinner-3',
    category: 'Dinner',
    name: 'Slow-Cooked Beef Nihari',
    price: 3600,
    description: 'Mouth-watering beef shank slow-cooked overnight in a rich wheat-thickened spicy flour gravy, garnished with fresh ginger, coriander, lemon, and green chillies.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    tags: ['Traditional Feast', 'Rich Gravy'],
    serves: 'Serves 2'
  },
  {
    id: 'dinner-4',
    category: 'Dinner',
    name: 'Aura Grand Seafood Tawa Platter',
    price: 7500,
    description: 'An extravagant assortment of grilled tiger prawns, crispy tawa pomfret, and calamari rings, seasoned with local spices, garlic naan, and mint raita.',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=600&q=80',
    tags: ['Extravagant', 'Seafood'],
    serves: 'Serves 3-4'
  },
  {
    id: 'dinner-5',
    category: 'Dinner',
    name: 'Charcoal Smoked Chicken Sajji',
    price: 3900,
    description: 'Whole organic chicken marinated in wild Balochistan herbs, slow-roasted over firewood, served with aromatic spiced sajji rice.',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
    tags: ['Balochi', 'Traditional'],
    serves: 'Serves 2-3'
  },
  {
    id: 'dinner-6',
    category: 'Dinner',
    name: 'Wood-Fired Mutton Shank Dumpukht',
    price: 6200,
    description: 'Premium local lamb shank sealed in a clay pot and slow-cooked in its own steam for 8 hours with soft potatoes, seasoned with pink Himalayan salt.',
    image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=600&q=80',
    tags: ['Traditional', 'Slow Cooked'],
    serves: 'Serves 2'
  },
  {
    id: 'dessert-1',
    category: 'Desserts',
    name: 'Gold Leaf Pistachio Kulfi',
    price: 1500,
    description: 'Traditional slow-cooked condensed milk kulfi flavored with sweet saffron, heavily encrusted with crushed premium pistachios and draped in edible 24k gold foil.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    tags: ['Sweet Masterpiece', 'Luxury Touch'],
    serves: 'Serves 1'
  },
  {
    id: 'dessert-2',
    category: 'Desserts',
    name: 'Royal Shahi Tukray',
    price: 1400,
    description: 'Deep-fried golden bread slices soaked in cardamon-infused sugar syrup, topped with rich simmered milk rabri, pistachios, almonds, and pure silver leaf (Chandi Varq).',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80',
    tags: ['Traditional Sweet'],
    serves: 'Serves 1-2'
  },
  {
    id: 'dessert-3',
    category: 'Desserts',
    name: 'Aura Signature Saffron Ras Malai',
    price: 1100,
    description: 'Delicate poached cottage cheese dumplings soaked in sweet cardamom-spiced milk, chilled, and draped in pure saffron and crushed almonds.',
    image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=600&q=80',
    tags: ['Delicate', 'Chilled Sweet'],
    serves: 'Serves 1-2'
  },
  {
    id: 'dessert-4',
    category: 'Desserts',
    name: 'Warm Gajar Ka Halwa Supreme',
    price: 1350,
    description: 'Freshly grated carrots simmered for hours in sweetened milk fat and organic khoya, generously laden with ghee, roasted pistachios, and cashews.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    tags: ['Traditional', 'Winter Special'],
    serves: 'Serves 1-2'
  },
  {
    id: 'dessert-5',
    category: 'Desserts',
    name: 'Gourmet Baklava & Gelato Tower',
    price: 1600,
    description: 'Flaky, buttery layered filo pastry stuffed with Turkish pistachios, baked golden, drizzled with orange blossom honey, served with vanilla bean gelato.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80',
    tags: ['Premium', 'Turkish'],
    serves: 'Serves 1'
  },
  {
    id: 'drink-1',
    category: 'Beverages',
    name: 'Artisanal Zamzam Mint Mojito',
    price: 1200,
    description: 'Refreshing luxury beverage crafted with holy Zamzam water, freshly muddled local mint leaves, zesty lime wedges, organic sugar cane syrup, and crushed ice.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    tags: ['Mocktail', 'Organic'],
    serves: 'Serves 1'
  },
  {
    id: 'drink-2',
    category: 'Beverages',
    name: 'Fresh Pomegranate Juice',
    price: 900,
    description: 'Freshly cold-pressed sweet Kandahari pomegranates juice, lightly seasoned with pink Himalayan salt, serving as a rich, refreshing wellness elixir.',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
    tags: ['Fresh Press', 'Healthy Choice'],
    serves: 'Serves 1'
  },
  {
    id: 'drink-3',
    category: 'Beverages',
    name: 'Premium Cardamom Shahi Chai',
    price: 650,
    description: 'Rich pink Kashmiri tea or strong Karak cardamom tea slow-brewed with fresh farm milk, condensed and topped with crushed pistachios.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    tags: ['Traditional', 'Brewed'],
    serves: 'Serves 1-2'
  },
  {
    id: 'drink-4',
    category: 'Beverages',
    name: 'Organic Saffron & Almond Lassi',
    price: 950,
    description: 'Rich churned sweet yogurt drink, infused with chilled Kashmiri saffron strands, almond cream, and crushed ice.',
    image: 'https://images.unsplash.com/photo-1548695607-9c734351f26f?auto=format&fit=crop&w=600&q=80',
    tags: ['Creamy', 'Traditional'],
    serves: 'Serves 1'
  },
  {
    id: 'drink-5',
    category: 'Beverages',
    name: 'Blue Lagoon Aura Mocktail',
    price: 1100,
    description: 'An exotic sparkling blue curacao elixir, muddled with fresh keys limes, wild elderflower syrup, and club soda.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80',
    tags: ['Exotic', 'Premium'],
    serves: 'Serves 1'
  }
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

const Dining = () => {
  const { user, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  // Category selection tab state
  const [activeCategory, setActiveCategory] = useState('Breakfast');

  // Ordering & Checkout States
  const [orderItems, setOrderItems] = useState({}); // { itemId: quantity }
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [payMethod, setPayMethod] = useState('jazzcash');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bankReceiptRef, setBankReceiptRef] = useState('');
  const [paymentProof, setPaymentProof] = useState('');
  const [paymentProofName, setPaymentProofName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('none'); // 'none', 'form', 'processing', 'success'
  const [processingMsg, setProcessingMsg] = useState('');

  useEffect(() => {
    if (user && checkoutStep === 'form') {
      fetchCheckedInBookings();
    }
  }, [user, checkoutStep]);

  const fetchCheckedInBookings = async () => {
    setBookingLoading(true);
    try {
      const response = await fetch('/api/bookings/my-bookings', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        // User can order food if they have an active checked-in stay
        const activeStays = data.filter(b => b.status === 'Checked In');
        setBookings(activeStays);
        if (activeStays.length > 0) {
          setSelectedBookingId(activeStays[0]._id);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleToggleItemInCart = (itemId) => {
    setOrderItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId]) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = 1;
      }
      return newItems;
    });
  };

  const handleUpdateQty = (itemId, change) => {
    setOrderItems(prev => {
      const newItems = { ...prev };
      const currentQty = newItems[itemId] || 0;
      const nextQty = currentQty + change;
      if (nextQty <= 0) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = nextQty;
      }
      return newItems;
    });
  };

  const getOrderTotal = () => {
    return Object.entries(orderItems).reduce((sum, [itemId, qty]) => {
      const item = RESTAURANT_MENU.find(m => m.id === itemId);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const cartCount = Object.values(orderItems).reduce((a, b) => a + b, 0);
  const orderTotal = getOrderTotal();

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProofName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!user) {
      alert('Please sign in to order food directly to your suite.');
      navigate('/login');
      return;
    }

    if (bookings.length === 0) {
      setValidationError('You do not have any active Checked-In stays at AuraStay. direct food order payment features are strictly reserved for currently checked-in guests.');
      return;
    }

    if (!selectedBookingId) {
      setValidationError('Please select your active checked-in room booking.');
      return;
    }

    if (!paymentProof) {
      setValidationError('Please upload a screenshot of your transaction as payment proof.');
      return;
    }

    if (payMethod === 'jazzcash' || payMethod === 'easypaisa') {
      const walletRegex = /^03\d{9}$/;
      if (!walletRegex.test(mobileNumber)) {
        setValidationError('Please enter a valid 11-digit mobile wallet number starting with 03.');
        return;
      }
    } else if (payMethod === 'bank') {
      const refRegex = /^(FT|TX)-[A-Z0-9]{8,12}$/i;
      if (!refRegex.test(bankReceiptRef.trim())) {
        setValidationError('Invalid Reference. Must follow HBL bank standard FT-xxxxxx or TX-xxxxxx.');
        return;
      }
    }

    setCheckoutStep('processing');
    let messages = [
      { msg: 'Connecting with selected mobile billing gateway...', delay: 1000 },
      { msg: 'Processing manual transaction slip validations...', delay: 2500 },
      { msg: 'Creating Room Service request in resort mainframes...', delay: 4500 }
    ];

    messages.forEach((m) => {
      setTimeout(() => {
        setProcessingMsg(m.msg);
      }, m.delay);
    });

    // Post to Service Request Room Service pipeline in MongoDB
    setTimeout(async () => {
      const selectedDishDetails = Object.entries(orderItems).map(([itemId, qty]) => {
        const item = RESTAURANT_MENU.find(m => m.id === itemId);
        return item ? `${item.name} (x${qty})` : '';
      }).join(', ');

      const formattedDetails = `Room Service Order: ${selectedDishDetails}. Total Bill: Rs. ${orderTotal.toLocaleString()}. Paid via: ${payMethod.toUpperCase()}. Transaction Ref: ${payMethod === 'bank' ? bankReceiptRef : 'Wallet Number: ' + mobileNumber}.`;

      try {
        const response = await fetch('/api/services/request', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            bookingId: selectedBookingId,
            type: 'Room Service',
            details: formattedDetails,
            paymentProof: paymentProof
          })
        });

        if (response.ok) {
          setCheckoutStep('success');
          setOrderItems({});
        } else {
          const errData = await response.json();
          setValidationError(errData.message || 'Failed to place kitchen order.');
          setCheckoutStep('form');
        }
      } catch (err) {
        console.error(err);
        setValidationError('Connection error. Please try again.');
        setCheckoutStep('form');
      }
    }, 6000);
  };

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Beverages'];
  const filteredMenu = RESTAURANT_MENU.filter(item => item.category === activeCategory);
  return (
    <div style={styles.page}>
      
      {/* Banner - only show if checkoutStep is 'none' */}
      {checkoutStep === 'none' && (
        <div className="relative h-[220px] md:h-[350px] flex items-center mb-8 md:mb-[50px] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80")' }}>
          <div style={styles.bannerOverlay}></div>
          <div className="container" style={styles.bannerContent}>
            <span style={styles.bannerTag}>AURA DINING CONCEPTS</span>
            <h1 style={styles.bannerTitle} className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.5rem]">The Imperial Kitchens</h1>
            <p style={styles.bannerSubtitle}>Indulge in authentic Mughlai and Continental culinary mastery. Every plate tells a rich story of heritage and luxury.</p>
          </div>
        </div>
      )}

      {checkoutStep === 'none' ? (
        <div className={`container grid gap-[30px] transition-all duration-300 ${cartCount > 0 ? 'grid-cols-1 lg:grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
          
          <main>
            {/* Info Box */}
            <div style={styles.infoBox} className="glass-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Utensils size={32} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div>
                  <h3 style={{ color: 'var(--gold)', fontWeight: '600', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Direct Suite Delivery & Wallet Checkout
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    In-stay guests can select their favorite dishes directly from our categorized menus below, verify order bills, upload mobile wallet payment references, and place requests directly to the royal kitchens!
                  </p>
                </div>
              </div>
            </div>

            {/* Categorized Tabs */}
            <div style={styles.tabsWrapper}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    ...styles.categoryTabBtn,
                    borderBottom: activeCategory === cat ? '2px solid var(--gold)' : '2px solid transparent',
                    color: activeCategory === cat ? 'var(--gold)' : 'var(--text-secondary)',
                    fontWeight: activeCategory === cat ? '600' : '400',
                  }}
                >
                  {cat === 'Breakfast' && '🍳'}
                  {cat === 'Lunch' && '🍲'}
                  {cat === 'Dinner' && '🍛'}
                  {cat === 'Desserts' && '🍨'}
                  {cat === 'Beverages' && '🍹'}
                  <span style={{ marginLeft: '6px' }}>{cat}</span>
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-[30px]">
              {filteredMenu.map((item) => {
                const isAdded = !!orderItems[item.id];
                const qty = orderItems[item.id] || 0;
                
                return (
                  <div key={item.id} style={{
                    ...styles.menuCard,
                    border: isAdded ? '1px solid var(--gold)' : '1px solid var(--border-color)',
                    boxShadow: isAdded ? '0 0 15px rgba(212, 175, 55, 0.1)' : 'var(--shadow-sm)'
                  }} className="glass-panel">
                    <div style={styles.imageWrapper}>
                      <img src={item.image} alt={item.name} style={styles.itemImage} />
                      <span style={styles.servingsBadge}>{item.serves}</span>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.itemHeader}>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <strong style={styles.itemPrice}>Rs. {item.price.toLocaleString()}</strong>
                      </div>
                      <p style={styles.itemDescription}>{item.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={styles.tagsContainer}>
                          {item.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} style={styles.tagBadge}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Interactive Cart controls */}
                        {isAdded ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                            <button onClick={() => handleUpdateQty(item.id, -1)} style={styles.qtyBtn}>-</button>
                            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600', minWidth: '15px', textAlign: 'center' }}>{qty}</span>
                            <button onClick={() => handleUpdateQty(item.id, 1)} style={styles.qtyBtn}>+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleToggleItemInCart(item.id)}
                            className="btn-gold"
                            style={{ padding: '6px 16px', fontSize: '0.78rem', borderRadius: '20px' }}
                          >
                            Add Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* Right Sticky Cart Panel */}
          {cartCount > 0 && (
            <aside style={{ height: 'fit-content', position: 'sticky', top: '100px' }} className="glass-panel">
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gold)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-title)' }}>
                  🛒 Order cart summary
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '16px', border: '1px solid var(--border-color)', maxHeight: '200px', overflowY: 'auto' }}>
                  {Object.entries(orderItems).map(([itemId, qty]) => {
                    const item = RESTAURANT_MENU.find(m => m.id === itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <span>{item.name} <strong>x{qty}</strong></span>
                        <strong>Rs. {(item.price * qty).toLocaleString()}</strong>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <span>Subtotal</span>
                  <strong>Rs. {orderTotal.toLocaleString()}</strong>
                </div>

                <button
                  onClick={() => setCheckoutStep('form')}
                  className="btn-gold"
                  style={{ width: '100%', justifyContent: 'center', height: '42px', marginTop: '16px' }}
                >
                  Checkout order (Rs. {orderTotal.toLocaleString()})
                </button>
              </div>
            </aside>
          )}
        </div>
      ) : (
        /* Dedicated Full-Page Checkout Experience */
        <div className="container animate-fade-in" style={{ marginTop: '40px', maxWidth: '1000px', paddingBottom: '60px' }}>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-[30px]">
            {checkoutStep === 'form' && (
              <button 
                onClick={() => setCheckoutStep('none')}
                style={styles.backBtn}
              >
                ← Back to Royal Dining Menu
              </button>
            )}
            <div className="text-left sm:text-right sm:ml-auto">
              <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Gourmet Suite Dining</span>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', color: '#fff', marginTop: '2px' }}>Secure Dining Checkout</h2>
            </div>
          </div>

          <div className="glass-panel bg-[var(--bg-secondary)] rounded-[var(--border-radius-lg)] border border-[var(--border-color)] shadow-lg p-5 md:p-10 mb-[60px]">
            
            {checkoutStep === 'form' && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.15fr] gap-10">
                
                {/* Left Column: Order Bill details */}
                <div style={styles.leftCol}>
                  <h3 style={styles.subHeading}>Order Bill Details</h3>
                  
                  <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg p-4 md:p-6 flex flex-col gap-3 md:gap-[14px]">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '6px' }}>
                      {Object.entries(orderItems).map(([itemId, qty]) => {
                        const item = RESTAURANT_MENU.find(m => m.id === itemId);
                        if (!item) return null;
                        return (
                          <div key={itemId} style={styles.billRow}>
                            <span>{item.name} <strong style={{ color: 'var(--gold)' }}>x{qty}</strong></span>
                            <strong>Rs. {(item.price * qty).toLocaleString()}</strong>
                          </div>
                        );
                      })}
                    </div>
                    
                    <hr style={styles.hr} />
                    
                    <div style={styles.billRow}>
                      <span>Subtotal</span>
                      <strong>Rs. {orderTotal.toLocaleString()}</strong>
                    </div>
                    
                    <div style={styles.billRow}>
                      <span>Luxury Restaurant Tax (5%)</span>
                      <strong>Rs. {Math.round(orderTotal * 0.05).toLocaleString()}</strong>
                    </div>

                    <div style={styles.billRow}>
                      <span>Suite Delivery Service Charge</span>
                      <strong style={{ color: 'var(--emerald)' }}>FREE (Aura Privilege)</strong>
                    </div>

                    <hr style={styles.hr} />

                    <div style={styles.billRow}>
                      <span style={{ color: 'var(--gold)', fontWeight: '600' }}>Grand Total Due</span>
                      <strong style={{ color: 'var(--gold)', fontSize: '1.25rem' }}>
                        Rs. {Math.round(orderTotal * 1.05).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Right Column: Checkout Inputs & Form */}
                <div style={styles.rightCol}>
                  <h3 style={styles.subHeading}>Payment & Suite Selection</h3>
                  
                  <form onSubmit={handlePlaceOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {validationError && (
                      <div style={styles.errorAlert}>
                        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                        <span>{validationError}</span>
                      </div>
                    )}

                    {/* Active booking select */}
                    {bookingLoading ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Querying active guest logs...</span>
                    ) : bookings.length > 0 ? (
                      <div className="form-group">
                        <label style={styles.optionLabel}>Active Suite Stay *</label>
                        <select
                          className="form-control"
                          value={selectedBookingId}
                          onChange={(e) => setSelectedBookingId(e.target.value)}
                          required
                        >
                          {bookings.map(b => (
                            <option key={b._id} value={b._id}>
                              {b.roomType} (Suite {b.assignedRoom?.roomNumber || 'N/A'})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px dashed #ef4444', padding: '14px', borderRadius: '8px', fontSize: '0.82rem', color: '#ef4444' }}>
                        ⚠️ No Checked-In stays found! Dining order payments are restricted strictly to currently checked-in guests. Please verify your stay dashboard logs.
                      </div>
                    )}

                    {/* Payment Selection Tabs */}
                    <div>
                      <label style={styles.optionLabel}>Select Payment Wallet *</label>
                      <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-4 bg-[var(--bg-tertiary)] p-1 rounded-lg border border-[var(--border-color)]">
                        <button
                          type="button"
                          style={{
                            ...styles.tab,
                            background: payMethod === 'jazzcash' ? 'rgba(230, 28, 36, 0.15)' : 'transparent',
                            border: payMethod === 'jazzcash' ? '1px solid #E61C24' : '1px solid transparent',
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
                            background: payMethod === 'bank' ? 'rgba(0, 107, 84, 0.15)' : 'transparent',
                            border: payMethod === 'bank' ? '1px solid #006B54' : '1px solid transparent',
                            borderRadius: '6px',
                            opacity: payMethod === 'bank' ? 1 : 0.6
                          }}
                          onClick={() => setPayMethod('bank')}
                        >
                          <HBLLogo size={24} />
                        </button>
                      </div>
                    </div>

                    {/* Account details inputs */}
                    {(payMethod === 'jazzcash' || payMethod === 'easypaisa') ? (
                      <div className="form-group">
                        <label style={styles.optionLabel}>{payMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} Account Number *</label>
                        <div style={{ position: 'relative' }}>
                          <Phone size={16} style={styles.inputIcon} />
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="e.g. 03001234567"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                            style={{ paddingLeft: '40px' }}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={styles.bankDetailBox}>
                          <div style={styles.bankDetailRow}><span>Bank:</span> <strong>HBL</strong></div>
                          <div style={styles.bankDetailRow}><span>Account Number:</span> <strong>1234-79010203-03</strong></div>
                          <div style={styles.bankDetailRow}><span>Total Due:</span> <strong>Rs. {Math.round(orderTotal * 1.05).toLocaleString()}</strong></div>
                        </div>
                        <div className="form-group">
                          <label style={styles.optionLabel}>Deposit Receipt / Transaction Ref *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., FT261479830PK"
                            value={bankReceiptRef}
                            onChange={(e) => setBankReceiptRef(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload proof */}
                    <div className="form-group">
                      <label style={styles.optionLabel}>Upload Payment screenshot Proof *</label>
                      <input
                        type="file"
                        id="orderReceiptUpload"
                        accept="image/*"
                        onChange={handleProofUpload}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="orderReceiptUpload"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px',
                          border: '1px dashed var(--gold)',
                          background: 'rgba(212, 175, 55, 0.05)',
                          borderRadius: '8px',
                          color: 'var(--gold)',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          fontWeight: '600'
                        }}
                      >
                        📷 {paymentProofName ? 'Change Slip Proof' : 'Choose Slip Proof'}
                      </label>
                      {paymentProofName && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{paymentProofName}</span>
                          <img src={paymentProof} alt="Receipt Preview" style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '4px' }} />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn-gold"
                      style={{ height: '48px', justifyContent: 'center', fontWeight: '600', marginTop: '10px' }}
                      disabled={bookings.length === 0}
                    >
                      Pay & Place Kitchen Order
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* Step 2: Processing */}
            {checkoutStep === 'processing' && (
              <div style={styles.loaderBox}>
                <div style={styles.spinner}></div>
                <h3 style={styles.processingTitle}>Authorizing Order Payment</h3>
                <p style={styles.processingSubtitle}>{processingMsg}</p>
              </div>
            )}

            {/* Step 3: Success */}
            {checkoutStep === 'success' && (
              <div style={styles.successBox}>
                <CheckCircle2 size={54} style={{ color: 'var(--emerald)' }} />
                <h3 style={styles.successTitle}>Kitchen Order Dispatched</h3>
                <p style={styles.successSubtitle}>
                  Your payment has been successfully recorded and the royal kitchens are preparing your Mughlai feast! Details have been logged in your Guest Dashboard.
                </p>
                <button
                  onClick={() => {
                    setCheckoutStep('none');
                    navigate('/dashboard');
                  }}
                  className="btn-gold"
                  style={{ width: '100%', maxWidth: '300px', justifyContent: 'center', height: '42px', marginTop: '30px' }}
                >
                  Go to Guest Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

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
    backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80")',
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
  infoBox: {
    padding: '24px 30px',
    background: 'var(--bg-secondary)',
    marginBottom: '40px',
    borderLeft: '4px solid var(--gold)',
  },
  tabsWrapper: {
    display: 'flex',
    gap: '20px',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '30px',
    overflowX: 'auto',
    paddingBottom: '2px',
  },
  categoryTabBtn: {
    background: 'transparent',
    border: 'none',
    padding: '12px 16px',
    fontSize: '0.92rem',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '30px',
  },
  menuCard: {
    background: 'var(--bg-secondary)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'all 0.3s ease',
  },
  imageWrapper: {
    position: 'relative',
    height: '220px',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  servingsBadge: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(5, 7, 12, 0.8)',
    border: '1px solid var(--gold)',
    color: 'var(--gold)',
    fontSize: '0.72rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '4px',
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '10px',
  },
  itemName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    fontFamily: 'var(--font-title)',
    color: '#fff',
  },
  itemPrice: {
    fontSize: '1.15rem',
    color: 'var(--gold)',
    fontWeight: '700',
  },
  itemDescription: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '18px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tagBadge: {
    fontSize: '0.68rem',
    background: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    padding: '3px 8px',
    borderRadius: '4px',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--gold)',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '0 8px',
    outline: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(5, 7, 12, 0.85)',
    backdropFilter: 'blur(12px)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '520px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--border-radius-lg)',
    border: '1px solid var(--border-color)',
    padding: '30px',
    boxShadow: 'var(--shadow-lg)',
    maxHeight: '90vh',
    overflowY: 'auto',
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
  optionLabel: {
    display: 'block',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    marginBottom: '8px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
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
    padding: '10px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  bankDetailBox: {
    padding: '16px',
    background: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  bankDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
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
    fontSize: '0.82rem',
  },
  loaderBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
    textAlign: 'center',
  },
  spinner: {
    width: '45px',
    height: '45px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--gold)',
    borderRadius: '50%',
    animation: 'spin 1s infinite linear',
  },
  processingTitle: {
    fontSize: '1.2rem',
    fontFamily: 'var(--font-title)',
    marginTop: '20px',
    color: '#fff',
  },
  processingSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '8px',
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 0',
    textAlign: 'center',
  },
  successTitle: {
    fontSize: '1.4rem',
    fontFamily: 'var(--font-title)',
    color: '#fff',
    marginTop: '16px',
  },
  successSubtitle: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    marginTop: '10px',
    lineHeight: '1.5',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: 0,
    outline: 'none',
    transition: 'color 0.3s ease',
  },
  checkoutPanel: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--border-radius-lg)',
    border: '1px solid var(--border-color)',
    padding: '40px',
    boxShadow: 'var(--shadow-lg)',
    marginBottom: '60px',
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
    gridTemplateColumns: '1.1fr 1.15fr',
    gap: '40px',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  billDetails: {
    background: 'var(--bg-tertiary)',
    padding: '24px',
    borderRadius: '8px',
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
    alignItems: 'center',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid var(--border-color)',
    margin: '10px 0',
  },
};

export default Dining;
