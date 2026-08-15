// src/api/mockData.js

export const images = {
  assortedBiscuits: require('../../assets/images/Assorted Biscuits.jpeg'),
  cadburryDonut: require('../../assets/images/Cadburry Donut.jpeg'),
  blueberryCheesecake: require('../../assets/images/cake_blueberry_cheesecake.jpg'),
  caramelCheesecake: require('../../assets/images/cake_caramel_cheesecake.jpg'),
  caramelCoffeeCake: require('../../assets/images/cake_caramel_coffee.jpg'),
  chocolateAlmondCake: require('../../assets/images/cake_chocolate_almond.jpg'),
  chocolateMousseCake: require('../../assets/images/cake_chocolate_mousse.jpg'),
  chocolateRosetteCake: require('../../assets/images/cake_chocolate_rosette.jpg'),
  chocolateShavingsCake: require('../../assets/images/cake_chocolate_shavings.jpg'),
  chocolateTruffleCake: require('../../assets/images/cake_chocolate_truffle.jpg'),
  coffeeCake: require('../../assets/images/cake_coffee.jpg'),
  darkChocolateCake: require('../../assets/images/cake_dark_chocolate.jpg'),
  lotusBiscoffCake: require('../../assets/images/cake_lotus_biscoff.jpg'),
  mangoCake: require('../../assets/images/cake_mango.jpg'),
  mixedDryFruitCake: require('../../assets/images/cake_mixed_dry_fruit.jpg'),
  oreoChocolateCake: require('../../assets/images/cake_oreo_chocolate.jpg'),
  pineappleCake: require('../../assets/images/cake_pineapple.jpg'),
  pistachioCake: require('../../assets/images/cake_pistachio.jpg'),
  raffaelloCake: require('../../assets/images/cake_raffaello.jpg'),
  redVelvetCake: require('../../assets/images/cake_red_velvet.jpg'),
  snickerBarCake: require('../../assets/images/cake_snicker_bar.jpg'),
  stickyToffeeCake: require('../../assets/images/cake_sticky_toffee.jpg'),
  tiramisuCake: require('../../assets/images/cake_tiramisu.jpg'),
  caramelCrunch: require('../../assets/images/Caramel Crunch.jpeg'),
  caramelDonut: require('../../assets/images/caramel donut.jpeg'),
  caramelEclair: require('../../assets/images/caramel eclair.jpeg'),
  cheesyPasta: require('../../assets/images/Cheesy pasta.jpeg'),
  chickenPotatoPatties: require('../../assets/images/Chicken and Potato Patties.jpeg'),
  chickenBread: require('../../assets/images/Chicken Bread.jpeg'),
  chickenSaladSandwich: require('../../assets/images/Chicken salad snadwich.jpeg'),
  chocolateCaramelDonut: require('../../assets/images/Chocolate Caramel DOnut.jpeg'),
  chocolateEclair: require('../../assets/images/chocolate eclair.jpeg'),
  chocolateFilledCupCake: require('../../assets/images/Chocolate filled cup cake.jpeg'),
  chocolateMatilda: require('../../assets/images/Chocolate Matilda.jpeg'),
  chocolateMousseSundae: require('../../assets/images/Chocolate Mousse Sundae.png'),
  chocolateMuffin: require('../../assets/images/Chocolate muffin.jpeg'),
  chocolatePastry: require('../../assets/images/Chocolate Pastry.jpeg'),
  chocolateSudnae: require('../../assets/images/Chocolate Sudnae.jpg'),
  chocolateTart: require('../../assets/images/Chocolate tart.jpeg'),
  dannishPastry: require('../../assets/images/Dannish Pastry.jpeg'),
  lasangna: require('../../assets/images/Lasangna.jpeg'),
  lotusCupCake: require('../../assets/images/Lotus cup cake.jpeg'),
  lotusSundae: require('../../assets/images/Lotus Sundae.jpg'),
  marbleCake: require('../../assets/images/marble cake.jpeg'),
  marbleMuffin: require('../../assets/images/marble muffin.jpeg'),
  milkyBread: require('../../assets/images/Milky Bread.jpeg'),
  milkyMaltBrownie: require('../../assets/images/Milky malt brownie.jpeg'),
  miniApplePie: require('../../assets/images/mini apple pie.jpeg'),
  miniLemonTart: require('../../assets/images/Mini lemon tart.jpeg'),
  miniPizza: require('../../assets/images/Mini Pizza.jpeg'),
  multiGrainBread: require('../../assets/images/Multi Grain bread.jpeg'),
  sourDough: require('../../assets/images/Sour dough 1.jpeg'),
  walnutPie: require('../../assets/images/Walnut pie.jpeg'),
};

export const CATEGORIES = [
  { id: 'all',          name: 'All',                  icon: '🍽️' },
  { id: 'cakes',        name: 'Cakes',                icon: '🎂' },
  { id: 'cheesecakes',  name: 'Cheesecakes',          icon: '🍰' },
  { id: 'pastries',     name: 'Pastries & Eclairs',   icon: '🥐' },
  { id: 'savories',     name: 'Savories',             icon: '🍗' },
  { id: 'pasta',        name: 'Pasta',                icon: '🍝' },
  { id: 'sandwiches',   name: 'Cold Sandwiches',      icon: '🥪' },
  { id: 'pies',         name: 'Pies & Tarts',         icon: '🥧' },
  { id: 'bread',        name: 'Bread & Croissant',    icon: '🍞' },
  { id: 'cupcakes',     name: 'Cupcakes',             icon: '🧁' },
  { id: 'brownies',     name: 'Brownies & Cookies',   icon: '🍪' },
  { id: 'donuts',       name: 'Donuts',               icon: '🍩' },
  { id: 'sundaes',      name: 'Sundae\'s',            icon: '🍨' },
  { id: 'muffins',      name: 'Muffins',              icon: '🧁' },
  { id: 'hot-coffee',   name: 'Hot Coffee',           icon: '☕' },
  { id: 'cold-coffee',  name: 'Cold Coffee',          icon: '🥤' },
];

export const PRODUCTS = [
  // ── SPECIAL ITEMS (HOME SCREEN - BIG SIZE) ──
  {
    id: 'sp-1',
    name: 'Oreo Chocolate Cheesecake',
    categoryId: 'cheesecakes',
    price: 6500,
    slicePrice: 825,
    image: images.oreoChocolateCake,
    description: 'Creamy cheesecake blended with Oreo chunks on a dark chocolate crust.',
    isSpecial: true,
  },
  {
    id: 'sp-2',
    name: 'Chocolate Truffle Cheesecake',
    categoryId: 'cheesecakes',
    price: 6500,
    slicePrice: 825,
    image: images.chocolateTruffleCake,
    description: 'Rich dark chocolate ganache layered over a velvet cheesecake base.',
    isSpecial: true,
  },
  {
    id: 'sp-3',
    name: 'New York Cheesecake',
    categoryId: 'cheesecakes',
    price: 6500,
    slicePrice: 825,
    image: images.caramelCheesecake,
    description: 'Classic dense and creamy New York style cheesecake.',
    isSpecial: true,
  },
  {
    id: 'sp-4',
    name: 'San Sebastian Cheesecake',
    categoryId: 'cheesecakes',
    price: 6500,
    slicePrice: 825,
    image: images.caramelCoffeeCake, // Matching asset
    description: 'The famous burnt Basque cheesecake with a creamy molten center.',
    isSpecial: true,
  },
  {
    id: 'sp-5',
    name: 'Blueberry Cheese Cake',
    categoryId: 'cheesecakes',
    price: 6500,
    slicePrice: 825,
    image: images.blueberryCheesecake,
    description: 'Smooth cheesecake topped with fresh house-made blueberry compote.',
    isSpecial: true,
  },

  // ── CAKES ──
  { id: 'c-1', name: 'Tres Leches Lotus Cake', categoryId: 'cakes', price: 3250, image: images.lotusBiscoffCake, description: 'Milk-soaked sponge with creamy Lotus Biscoff.' },
  { id: 'c-2', name: 'Belgian Chocolate Cake', categoryId: 'cakes', price: 3200, image: images.darkChocolateCake, description: 'Rich Belgian chocolate sponge.' },
  { id: 'c-3', name: 'Red Velvet Cake', categoryId: 'cakes', price: 2999, image: images.redVelvetCake, description: 'Classic red velvet sponge.' },
  { id: 'c-4', name: 'Chocolate Fudge Cake', categoryId: 'cakes', price: 2999, image: images.chocolateTruffleCake, description: 'Dense, fudgy chocolate sponge.' },
  { id: 'c-5', name: 'German Fudge Cake', categoryId: 'cakes', price: 2999, image: images.chocolateShavingsCake, description: 'A twist on the classic fudge cake.' },
  { id: 'c-6', name: 'Coffee Cake', categoryId: 'cakes', price: 2999, image: images.coffeeCake, description: 'Rich espresso flavored sponge.' },
  { id: 'c-7', name: 'Mango Cake', categoryId: 'cakes', price: 2400, image: images.mangoCake, description: 'Seasonal fresh mango cream cake.' },
  { id: 'c-8', name: 'Pineapple Cake', categoryId: 'cakes', price: 2400, image: images.pineappleCake, description: 'Classic pineapple cream delight.' },
  { id: 'c-9', name: 'Mixed Dry Fruit Cake', categoryId: 'cakes', price: 2999, image: images.mixedDryFruitCake, description: 'Rich fruit cake with assorted nuts.' },
  { id: 'c-10', name: 'Chocolate Almond Cake', categoryId: 'cakes', price: 3200, image: images.chocolateAlmondCake, description: 'Chocolate cake with crunchy almonds.' },
  { id: 'c-11', name: 'Chocolate Mousse Cake', categoryId: 'cakes', price: 3200, image: images.chocolateMousseCake, description: 'Light airy mousse cake.' },
  { id: 'c-12', name: 'Chocolate Rosette Cake', categoryId: 'cakes', price: 3200, image: images.chocolateRosetteCake, description: 'Beautifully decorated cake.' },
  { id: 'c-13', name: 'Sticky Toffee Cake', categoryId: 'cakes', price: 1800, image: images.stickyToffeeCake, description: 'Soft date sponge with toffee.' },
  { id: 'c-14', name: 'Tiramisu Cake', categoryId: 'cakes', price: 2100, image: images.tiramisuCake, description: 'Italian coffee classic.' },
  { id: 'c-15', name: 'Marble Cake', categoryId: 'cakes', price: 1200, image: images.marbleCake, description: 'Vanilla and chocolate swirl cake.' },
  { id: 'c-16', name: 'Caramel Coffee Cake', categoryId: 'cakes', price: 1800, image: images.caramelCoffeeCake, description: 'Soft coffee and caramel cake.' },
  { id: 'c-17', name: 'Pistachio Cake', categoryId: 'cakes', price: 3400, image: images.pistachioCake, description: 'Elegant pistachio sponge.' },
  { id: 'c-18', name: 'Raffaello Cake', categoryId: 'cakes', price: 3200, image: images.raffaelloCake, description: 'White chocolate and coconut.' },
  { id: 'c-19', name: 'Snicker Bar Cake', categoryId: 'cakes', price: 3400, image: images.snickerBarCake, description: 'Peanuts and caramel delight.' },

  // ── SAVORIES ──
  { id: 's-1', name: 'Chicken Bread', categoryId: 'savories', price: 499, image: images.chickenBread, description: 'Soft bread filled with chicken.' },
  { id: 's-2', name: 'Chicken & Potato Patties', categoryId: 'savories', price: 325, image: images.chickenPotatoPatties, description: 'Crispy fried snack.' },
  { id: 's-3', name: 'Mini Pizza', categoryId: 'savories', price: 500, image: images.miniPizza, description: 'Individual sized pizza.' },

  // ── PASTA ──
  { id: 'pa-1', name: 'Lasagna', categoryId: 'pasta', price: 1199, image: images.lasangna, description: 'Layered meat and pasta bake.' },
  { id: 'pa-2', name: 'Cheesy Pasta Bake', categoryId: 'pasta', price: 1250, image: images.cheesyPasta, description: 'Rich white sauce cheesy pasta.' },

  // ── COLD SANDWICHES ──
  { id: 'cs-1', name: 'Chicken Salad Sandwich', categoryId: 'sandwiches', price: 550, image: images.chickenSaladSandwich, description: 'Fresh chicken salad filling.' },

  // ── PASTRIES & ECLAIRS ──
  { id: 'pas-1', name: 'Chocolate Eclairs', categoryId: 'pastries', price: 250, image: images.chocolateEclair, description: 'Classic chocolate cream pastry.' },
  { id: 'pas-2', name: 'Caramel Eclairs', categoryId: 'pastries', price: 250, image: images.caramelEclair, description: 'Cream filled caramel pastry.' },
  { id: 'pas-3', name: 'Chocolate Pastry', categoryId: 'pastries', price: 350, image: images.chocolatePastry, description: 'Dark chocolate pastry slice.' },
  { id: 'pas-4', name: 'Dannish Pastry', categoryId: 'pastries', price: 350, image: images.dannishPastry, description: 'Flaky seasonal pastry.' },
  { id: 'pas-5', name: 'Matilda Chocolate Heaven', categoryId: 'pastries', price: 999, image: images.chocolateMatilda, description: 'Extra moist chocolate slice.' },

  // ── PIES & TARTS ──
  { id: 'pie-1', name: 'Mini Apple Pie', categoryId: 'pies', price: 250, image: images.miniApplePie, description: 'Cinnamon apple small pie.' },
  { id: 'pie-2', name: 'Mini Walnut Pie', categoryId: 'pies', price: 250, image: images.walnutPie, description: 'Rich roasted walnut pie.' },
  { id: 'pie-3', name: 'Mini Chocolate Tart', categoryId: 'pies', price: 350, image: images.chocolateTart, description: 'Crispy ganache chocolate tart.' },
  { id: 'pie-4', name: 'Mini Lemon Tart', categoryId: 'pies', price: 299, image: images.miniLemonTart, description: 'Zesty lemon shortbread tart.' },

  // ── BREAD & CROISSANT ──
  { id: 'br-1', name: 'Milky Bread', categoryId: 'bread', price: 250, image: images.milkyBread, description: 'Soft and sweet milky loaf.' },
  { id: 'br-2', name: 'Multigrain Bread', categoryId: 'bread', price: 450, image: images.multiGrainBread, description: 'Healthy grain packed bread.' },
  { id: 'br-3', name: 'SourDough Bread', categoryId: 'bread', price: 499, image: images.sourDough, description: 'Artisanal sourdough loaf.' },

  // ── CUPCAKES ──
  { id: 'cup-1', name: 'Chocolate Filled Cupcake', categoryId: 'cupcakes', price: 350, image: images.chocolateFilledCupCake, description: 'Melting chocolate center.' },
  { id: 'cup-2', name: 'Lotus Cupcake', categoryId: 'cupcakes', price: 299, image: images.lotusCupCake, description: 'Lotus cream topped cupcake.' },

  // ── BROWNIES & COOKIES ──
  { id: 'bro-1', name: 'Assorted Biscuits', categoryId: 'brownies', price: 300, image: images.assortedBiscuits, description: 'Handmade assorted biscuits.' },
  { id: 'bro-2', name: 'Milky malt brownie', categoryId: 'brownies', price: 350, image: images.milkyMaltBrownie, description: 'Fudgy malted brownie.' },

  // ── DONUTS ──
  { id: 'don-1', name: 'Cadburary Donut', categoryId: 'donuts', price: 250, image: images.cadburryDonut, description: 'Donut with real Cadburry chocolate.' },
  { id: 'don-2', name: 'Caramel Donut', categoryId: 'donuts', price: 250, image: images.caramelDonut, description: 'Fresh caramel glazed donut.' },
  { id: 'don-3', name: 'Chocolate Caramel Donut', categoryId: 'donuts', price: 250, image: images.chocolateCaramelDonut, description: 'Chocolate and caramel mix.' },

  // ── SUNDAES ──
  { id: 'sun-1', name: 'Lotus Sundae', categoryId: 'sundaes', price: 499, image: images.lotusSundae, description: 'Biscoff flavored sundae.' },
  { id: 'sun-2', name: 'Chocolate Mousse Sundae', categoryId: 'sundaes', price: 499, image: images.chocolateMousseSundae, description: 'Sundae with chocolate mousse.' },
  { id: 'sun-3', name: 'Chocolate Sundae', categoryId: 'sundaes', price: 499, image: images.chocolateSudnae, description: 'Rich chocolate ice cream.' },

  // ── MUFFINS ──
  { id: 'muf-1', name: 'Chocolate Muffin', categoryId: 'muffins', price: 350, image: images.chocolateMuffin, description: 'Double chocolate muffin.' },
  { id: 'muf-2', name: 'Marble Muffin', categoryId: 'muffins', price: 350, image: images.marbleMuffin, description: 'Swirl flavored soft muffin.' },
];

export const BRANCHES = [
  { id: 'b1', name: 'Main Branch', address: 'Rawalpindi Central', hours: '8 AM - 10 PM' },
];

export const MOCK_ORDERS = [];

export const getProductsByCategory = (categoryId) => {
  if (!categoryId || categoryId === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.categoryId === categoryId);
};

export const searchProducts = (query = '') => {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
};

export const getProductById = (id) => PRODUCTS.find(p => p.id === String(id));

export default {
  images,
  CATEGORIES,
  PRODUCTS,
  BRANCHES,
  getProductsByCategory,
  searchProducts,
  getProductById,
};
