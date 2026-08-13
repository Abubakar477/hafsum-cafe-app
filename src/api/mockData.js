// ─── Mock Data – Products, Categories, Offers, Orders ────────────────────────
// Replace BASE_URL with your real API once the backend is ready.

export const BASE_URL = 'https://api.hafsum.com/v1';  // ← swap to real URL

// ─── Categories ──────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all',       name: 'All',       icon: '🍽️' },
  { id: 'coffee',    name: 'Coffee',    icon: '☕' },
  { id: 'cake',      name: 'Cake',      icon: '🎂' },
  { id: 'pastries',  name: 'Pastries',  icon: '🥐' },
  { id: 'shakes',    name: 'Shakes',    icon: '🥤' },
  { id: 'icecream',  name: 'Ice Cream', icon: '🍦' },
  { id: 'smoothies', name: 'Smoothies', icon: '🥭' },
  { id: 'beverages', name: 'Beverages', icon: '🧃' },

];

// ─── Products ─────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  // Coffee
  {
    id: 'p1', categoryId: 'coffee',
    name: 'Cappuccino', price: 3.50,
    description: 'Rich espresso topped with perfectly steamed micro-foam milk for a velvety, balanced coffee experience.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80',
    popular: true,
    sizes: [
      { id: 's', label: 'Small',  price: 3.00 },
      { id: 'm', label: 'Medium', price: 3.50 },
      { id: 'l', label: 'Large',  price: 4.00 },
    ],
    addons: [
      { id: 'extra-shot', label: 'Extra Shot', price: 0.50 },
      { id: 'oat-milk',   label: 'Oat Milk',   price: 0.70 },
      { id: 'vanilla',    label: 'Vanilla Syrup', price: 0.40 },
    ],
  },
  {
    id: 'p2', categoryId: 'coffee',
    name: 'Caramel Latte', price: 3.80,
    description: 'Smooth espresso with steamed milk and a drizzle of golden caramel sauce.',
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&q=80',
    popular: true,
    sizes: [
      { id: 's', label: 'Small',  price: 3.30 },
      { id: 'm', label: 'Medium', price: 3.80 },
      { id: 'l', label: 'Large',  price: 4.30 },
    ],
    addons: [
      { id: 'extra-shot', label: 'Extra Shot',    price: 0.50 },
      { id: 'oat-milk',   label: 'Oat Milk',      price: 0.70 },
      { id: 'caramel+',   label: 'Extra Caramel', price: 0.40 },
    ],
  },
  {
    id: 'p3', categoryId: 'coffee',
    name: 'Flat White', price: 3.60,
    description: 'Concentrated espresso with micro-foamed milk — strong, smooth and satisfying.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
    popular: false,
    sizes: [
      { id: 's', label: 'Small',  price: 3.10 },
      { id: 'm', label: 'Medium', price: 3.60 },
      { id: 'l', label: 'Large',  price: 4.10 },
    ],
    addons: [
      { id: 'extra-shot', label: 'Extra Shot', price: 0.50 },
    ],
  },
  {
    id: 'p4', categoryId: 'coffee',
    name: 'Espresso', price: 2.50,
    description: 'Classic single or double espresso shot — bold, intense and aromatic.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80',
    popular: false,
    sizes: [
      { id: 'single', label: 'Single', price: 2.50 },
      { id: 'double', label: 'Double', price: 3.00 },
    ],
    addons: [],
  },
  // Cake
  {
      id: 'p20', categoryId: 'cake',
      name: 'Lotus Cupcake', price: 4.20,
      description: 'Decadent layered chocolate cake with rich ganache frosting — the ultimate indulgence.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
      popular: true,
      sizes: [
        { id: 'slice', label: 'Slice',   price: 4.20 },
        { id: 'half',  label: 'Half',    price: 18.00 },
        { id: 'whole', label: 'Whole',   price: 32.00 },
      ],
      addons: [
        { id: 'ice-cream', label: 'Add Ice Cream', price: 1.50 },
        { id: 'candles',   label: 'Candles',       price: 0.00 },
      ],
    },
  {
    id: 'p5', categoryId: 'cake',
    name: 'Chocolate Cake', price: 4.20,
    description: 'Decadent layered chocolate cake with rich ganache frosting — the ultimate indulgence.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
    popular: true,
    sizes: [
      { id: 'slice', label: 'Slice',   price: 4.20 },
      { id: 'half',  label: 'Half',    price: 18.00 },
      { id: 'whole', label: 'Whole',   price: 32.00 },
    ],
    addons: [
      { id: 'ice-cream', label: 'Add Ice Cream', price: 1.50 },
      { id: 'candles',   label: 'Candles',       price: 0.00 },
    ],
  },
  {
    id: 'p6', categoryId: 'cake',
    name: 'Red Velvet Cake', price: 4.50,
    description: 'Velvety red layers with smooth cream cheese frosting — classic and gorgeous.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80',
    popular: false,
    sizes: [
      { id: 'slice', label: 'Slice', price: 4.50 },
      { id: 'whole', label: 'Whole', price: 34.00 },
    ],
    addons: [
      { id: 'ice-cream', label: 'Add Ice Cream', price: 1.50 },
    ],
  },
  {
    id: 'p7', categoryId: 'cake',
    name: 'Cheesecake', price: 4.00,
    description: 'Creamy New York–style cheesecake on a buttery graham cracker crust.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80',
    popular: false,
    sizes: [
      { id: 'slice', label: 'Slice', price: 4.00 },
      { id: 'whole', label: 'Whole', price: 30.00 },
    ],
    addons: [
      { id: 'berries',   label: 'Mixed Berries', price: 1.00 },
      { id: 'caramel',   label: 'Caramel Sauce', price: 0.50 },
    ],
  },
  // Pastries
  {
    id: 'p8', categoryId: 'pastries',
    name: 'Butter Croissant', price: 2.80,
    description: 'Flaky, golden and buttery — freshly baked every morning.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    popular: false,
    sizes: [],
    addons: [
      { id: 'jam',    label: 'Strawberry Jam', price: 0.30 },
      { id: 'butter', label: 'Extra Butter',   price: 0.20 },
    ],
  },
  {
    id: 'p9', categoryId: 'pastries',
    name: 'Cinnamon Roll', price: 3.20,
    description: 'Soft, warm cinnamon roll drizzled with cream cheese glaze.',
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&q=80',
    popular: false,
    sizes: [],
    addons: [],
  },
  // Shakes
  {
    id: 'p10', categoryId: 'shakes',
    name: 'Chocolate Shake', price: 4.50,
    description: 'Thick and creamy chocolate milkshake topped with whipped cream.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80',
    popular: false,
    sizes: [
      { id: 'm', label: 'Medium', price: 4.50 },
      { id: 'l', label: 'Large',  price: 5.50 },
    ],
    addons: [
      { id: 'whipped', label: 'Extra Whipped Cream', price: 0.50 },
    ],
  },
  {
    id: 'p11', categoryId: 'shakes',
    name: 'Vanilla Shake', price: 4.20,
    description: 'Classic creamy vanilla milkshake — simple, sweet and satisfying.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    popular: false,
    sizes: [
      { id: 'm', label: 'Medium', price: 4.20 },
      { id: 'l', label: 'Large',  price: 5.20 },
    ],
    addons: [],
  },
  // Ice Cream
  {
    id: 'p12', categoryId: 'icecream',
    name: 'Scoops of Joy', price: 3.00,
    description: 'Two generous scoops of premium ice cream — choose your favourite flavours.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
    popular: false,
    sizes: [
      { id: '1', label: '1 Scoop', price: 1.80 },
      { id: '2', label: '2 Scoops', price: 3.00 },
      { id: '3', label: '3 Scoops', price: 4.00 },
    ],
    addons: [
      { id: 'cone',    label: 'Waffle Cone', price: 0.50 },
      { id: 'syrup',   label: 'Chocolate Syrup', price: 0.40 },
      { id: 'sprinkles', label: 'Sprinkles', price: 0.20 },
    ],
  },
  // Smoothies
  {
    id: 'p13', categoryId: 'smoothies',
    name: 'Mango Smoothie', price: 4.00,
    description: 'Fresh mango blended with yoghurt and honey — tropical and refreshing.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80',
    popular: false,
    sizes: [
      { id: 'm', label: 'Medium', price: 4.00 },
      { id: 'l', label: 'Large',  price: 5.00 },
    ],
    addons: [],
  },
  {
    id: 'p14', categoryId: 'smoothies',
    name: 'Berry Blast', price: 4.20,
    description: 'Mixed berries, banana and low-fat yoghurt — packed with goodness.',
    image: 'https://images.unsplash.com/photo-1638176066959-e9c88b1e5dc4?w=400&q=80',
    popular: false,
    sizes: [
      { id: 'm', label: 'Medium', price: 4.20 },
      { id: 'l', label: 'Large',  price: 5.20 },
    ],
    addons: [],
  },
  // Beverages
  {
    id: 'p15', categoryId: 'beverages',
    name: 'Fresh Orange Juice', price: 3.50,
    description: 'Freshly squeezed oranges — pure, natural and full of vitamin C.',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
    popular: false,
    sizes: [
      { id: 'm', label: 'Medium', price: 3.50 },
      { id: 'l', label: 'Large',  price: 4.50 },
    ],
    addons: [],
  },
];

// ─── Promo Banners ────────────────────────────────────────────────────────────
export const BANNERS = [
  {
    id: 'b1',
    title: 'Special Combo',
    subtitle: 'Coffee & Cake\n20% OFF',
    cta: 'Order Now',
    bg: '#2E1540',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
  },
  {
    id: 'b2',
    title: 'New Arrival',
    subtitle: 'Mango Smoothie\nNow Available!',
    cta: 'Try Now',
    bg: '#1A3A2A',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80',
  },
  {
    id: 'b3',
    title: 'Weekend Special',
    subtitle: 'Buy 2 Cakes\nGet 1 Free',
    cta: 'Grab Deal',
    bg: '#3A2010',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  },
];

// ─── Mock Orders ──────────────────────────────────────────────────────────────
export const MOCK_ORDERS = [
  {
    id: 'HFS-10241',
    date: '2026-08-10T08:30:00Z',
    status: 'completed',
    items: [
      { name: 'Cappuccino', qty: 2, price: 3.50 },
      { name: 'Chocolate Cake', qty: 1, price: 4.20 },
    ],
    subtotal: 11.20,
    deliveryFee: 2.00,
    total: 13.20,
    type: 'delivery',
    address: '12 Al Olaya Street, Riyadh',
  },
  {
    id: 'HFS-10242',
    date: '2026-08-11T10:00:00Z',
    status: 'preparing',
    items: [
      { name: 'Caramel Latte', qty: 1, price: 3.80 },
      { name: 'Butter Croissant', qty: 2, price: 2.80 },
    ],
    subtotal: 9.40,
    deliveryFee: 0,
    total: 9.40,
    type: 'pickup',
    address: '',
  },
];

// ─── Branches ─────────────────────────────────────────────────────────────────
export const BRANCHES = [
  {
    id: 'br1',
    name: 'Hafsum – Olaya Branch',
    address: '12 Al Olaya Street, Riyadh',
    hours: 'Mon–Sun  07:00 – 23:00',
    phone: '+966 11 234 5678',
    pickup: true,
  },
  {
    id: 'br2',
    name: 'Hafsum – Tahlia Branch',
    address: '45 Tahlia Street, Riyadh',
    hours: 'Mon–Sun  07:30 – 23:30',
    phone: '+966 11 876 5432',
    pickup: true,
  },
];
