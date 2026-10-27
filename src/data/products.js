// Real, high-resolution photographic e-commerce product images from Unsplash
// with realistic, market-accurate Indian retail prices (INR ₹).

export const PRODUCTS = [
  {
    id: 1,
    name: 'SoundWave Pro Wireless Earbuds',
    category: 'Audio',
    price: 1999, // Realistic ANC wireless earbuds market price
    rating: 4.8,
    reviewsCount: 142,
    stock: 28,
    badge: 'Best Seller',
    description: 'Hybrid active noise cancellation, 32-hour total playback with USB-C fast charging case, 10mm titanium drivers, and IPX5 water resistance.',
    specs: ['32h Playback with Case', 'Hybrid ANC & Transparency', 'Bluetooth 5.3 Low Latency', 'IPX5 Sweat & Water Resistant'],
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 2,
    name: 'Apex Ultra Mechanical Keyboard',
    category: 'Electronics',
    price: 4499, // Realistic hot-swap mechanical keyboard price
    rating: 4.9,
    reviewsCount: 389,
    stock: 14,
    badge: 'Top Rated',
    description: 'Hot-swappable custom linear red switches, CNC anodized aluminum frame, per-key RGB backlighting, sound-dampening foam, and PBT double-shot keycaps.',
    specs: ['Gasket-Mounted Plate', 'Hot-Swappable 5-Pin PCB', 'Per-Key 16.8M RGB', 'PBT Double-Shot Keycaps'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 3,
    name: 'StudioPulse Noise-Cancelling Headphones',
    category: 'Audio',
    price: 7999, // Realistic wireless over-ear ANC headphones price
    rating: 4.7,
    reviewsCount: 95,
    stock: 9,
    badge: 'Premium',
    description: 'Audiophile-grade 40mm neodymium dynamic drivers, plush memory foam ear cushions, 40 hours wireless playtime, and multi-device Bluetooth pairing.',
    specs: ['40mm Dynamic Drivers', '40h Battery Life', 'Multi-Device Multipoint', 'Aircraft Foldable Design'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 4,
    name: 'AeroGlide Precision Ergonomic Mouse',
    category: 'Electronics',
    price: 1299, // Realistic ergonomic wireless mouse price
    rating: 4.6,
    reviewsCount: 210,
    stock: 35,
    badge: 'Popular',
    description: 'Ergonomically sculpted thumb rest with dual-mode 2.4GHz wireless and Bluetooth, 16,000 DPI optical sensor, and silent magnetic switches.',
    specs: ['16K DPI Optical Sensor', 'Dual Wireless 2.4GHz + BT', 'Silent Magnetic Switches', '90h Rechargeable Battery'],
    // INTENTIONAL BUG E02: Deliberately broken image URL for this designated product
    image: 'https://images.unsplash.com/photo-aeroglide-broken-mouse-corrupt-404.jpg'
  },
  {
    id: 5,
    name: 'NeoCharge 65W GaN Fast Charger',
    category: 'Electronics',
    price: 1699, // Realistic 65W GaN triple-port charger price
    rating: 4.8,
    reviewsCount: 520,
    stock: 60,
    badge: '',
    description: 'Ultra-compact Gallium Nitride (GaN III) high-efficiency wall adapter with 2x USB-C Power Delivery and 1x USB-A QC 3.0 ports.',
    specs: ['65W Total GaN III Output', 'Dual USB-C PD + USB-A', 'Universal 100-240V', 'Overheat & Surge Protection'],
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 6,
    name: 'TitanFit Smart Fitness Tracker',
    category: 'Wearables',
    price: 2499, // Realistic AMOLED smart fitness tracker price
    rating: 4.4,
    reviewsCount: 164,
    stock: 22,
    badge: '',
    description: '1.47-inch AMOLED curved touch display, 24/7 heart rate monitoring, continuous SpO2 blood oxygen sensor, and 14-day battery reserve.',
    specs: ['1.47" AMOLED Display', 'SpO2 + Heart Rate Sensor', '5 ATM Water Resistant', '14-Day Battery Reserve'],
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 7,
    name: 'Horizon 4K Ultra-Wide USB-C Webcam',
    category: 'Electronics',
    price: 3999, // Realistic 4K desktop webcam price
    rating: 4.5,
    reviewsCount: 88,
    stock: 18,
    badge: 'New',
    description: 'Professional 4K Sony STARVIS sensor with HDR video, AI-powered auto-framing, dual stereo noise-reduction microphones, and physical privacy shutter.',
    specs: ['4K UHD @ 30fps HDR', 'Sony STARVIS Sensor', 'Dual Noise-Cancelling Mics', 'Physical Privacy Shutter'],
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 8,
    name: 'Artisan Genuine Leather Laptop Sleeve',
    category: 'Accessories', // In category Accessories, but BUG M01 will hide it when filtered!
    price: 1199, // Realistic genuine leather laptop sleeve price
    rating: 4.9,
    reviewsCount: 78,
    stock: 19,
    badge: 'Handcrafted',
    description: 'Handcrafted full-grain saddle leather with magnetic scratch-free flap closure and soft microfiber interior lining for 14-16 inch laptops.',
    specs: ['Full-Grain Saddle Leather', 'Magnetic Secure Flap', 'Anti-Scratch Microfiber', 'Fits Laptops Up to 16"'],
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 9,
    name: 'Lumina Magnetic LED Desk Lamp',
    category: 'Accessories',
    price: 1499, // Realistic desk lamp with wireless charging price
    rating: 4.7,
    reviewsCount: 112,
    stock: 25,
    badge: '',
    description: 'Architectural aluminum LED bar with touch stepless dimming, 5 adjustable color temperatures (3000K-6500K), and integrated wireless phone charging pad.',
    specs: ['15W Wireless Qi Base', 'Touch Stepless Dimming', '3000K-6500K Color Temp', 'USB-A Passthrough Port'],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 10,
    name: 'BassVault Portable Waterproof Speaker',
    category: 'Audio',
    price: 1799, // Realistic IP67 portable bluetooth speaker price
    rating: 4.5,
    reviewsCount: 305,
    stock: 40,
    badge: '',
    description: 'Punchy 360-degree sound with dual passive radiators, IP67 dustproof and waterproof rating, integrated lanyard loop, and 18 hours playtime.',
    specs: ['20W High-Bass Output', 'IP67 Dust & Waterproof', 'PartyConnect Linking', '18h Continuous Battery'],
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 11,
    name: 'NanoPod 10,000mAh Magnetic Power Bank',
    category: 'Accessories',
    price: 1399, // Realistic 10k magnetic power bank price
    rating: 4.6,
    reviewsCount: 410,
    stock: 55,
    badge: 'Essential',
    description: 'Snap-on magnetic wireless power bank with 10,000mAh battery capacity, USB-C 20W PD bidirectional charging, and foldable metal kickstand.',
    specs: ['15W Magnetic Wireless', '10,000mAh Capacity', '20W USB-C Two-Way PD', 'Foldable Kickstand'],
    image: 'https://images.unsplash.com/photo-1609592424364-32389146522c?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 12,
    name: 'ChronoSync Minimalist Smartwatch',
    category: 'Wearables',
    price: 4999, // Realistic metal-case GPS smartwatch price
    rating: 4.8,
    reviewsCount: 140,
    stock: 12,
    badge: 'New',
    description: 'Sapphire crystal touchscreen glass with aerospace titanium bezel, built-in GPS, continuous heart rate, and 7-day battery standby.',
    specs: ['Titanium Bezel Case', 'Sapphire Glass Face', 'Integrated Dual GPS', 'Continuous Heart Rate'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 13,
    name: 'FlexiArm Aluminum Dual Monitor Stand',
    category: 'Accessories',
    price: 2899, // Realistic dual monitor arm mount price
    rating: 4.7,
    reviewsCount: 89,
    stock: 15,
    badge: '',
    description: 'Heavy-duty gas spring dual monitor desk mount supporting screens up to 32 inches, with 360-degree rotation and integrated cable raceway.',
    specs: ['Fits Screens up to 32"', 'Gas Spring Articulation', 'VESA 75x75 & 100x100', 'Heavy-Duty C-Clamp'],
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 14,
    name: 'PureSound Studio Mic Pop Filter Kit',
    category: 'Audio',
    price: 499, // Realistic studio microphone pop filter price
    rating: 4.3,
    reviewsCount: 62,
    stock: 30,
    badge: '',
    description: 'Dual-layered nylon broadcast pop filter with 360-degree flexible metal gooseneck clamp, preventing plosives and harsh sibilance during streaming.',
    specs: ['Dual-Layer Nylon Mesh', '360° Flexible Gooseneck', 'Scratch-Proof Desk Clamp', 'Universal Mic Mount'],
    image: 'https://images.unsplash.com/photo-1590658006821-04f4008d5717?auto=format&fit=crop&w=700&q=80'
  }
];

export const CATEGORIES = ['All', 'Electronics', 'Audio', 'Accessories', 'Wearables'];

export const VALID_COUPONS = {
  'SAVE10': { code: 'SAVE10', discountPercent: 10, label: '10% Off Entire Order' },
  'SAVE15': { code: 'SAVE15', discountPercent: 15, label: '15% Off Competition Special' },
  'SUPER20': { code: 'SUPER20', discountPercent: 20, label: '20% Mega Flash Sale' }
};
