/**
 * Seed data for shop (categories, ads, notices, products, home sections).
 * Matches the structure expected by the Store frontend.
 */

exports.categories = [
  {
    id: 'elec',
    label: 'Electronics',
    children: [
      {
        id: 'elec-phone',
        label: 'Phones',
        children: [
          { id: 'elec-phone-smart', label: 'Smartphones' },
          { id: 'elec-phone-accessories', label: 'Accessories' },
        ],
      },
      {
        id: 'elec-laptop',
        label: 'Laptops',
        children: [
          { id: 'elec-laptop-ultra', label: 'Ultrabooks' },
          { id: 'elec-laptop-gaming', label: 'Gaming' },
        ],
      },
      { id: 'elec-tablet', label: 'Tablets', children: [] },
    ],
  },
  {
    id: 'fashion',
    label: 'Fashion',
    children: [
      {
        id: 'fashion-men',
        label: 'Men',
        children: [
          { id: 'fashion-men-shirts', label: 'Shirts' },
          { id: 'fashion-men-pants', label: 'Pants' },
        ],
      },
      {
        id: 'fashion-women',
        label: 'Women',
        children: [
          { id: 'fashion-women-dresses', label: 'Dresses' },
          { id: 'fashion-women-shoes', label: 'Shoes' },
        ],
      },
      { id: 'fashion-kids', label: 'Kids', children: [] },
    ],
  },
  {
    id: 'home',
    label: 'Home & Garden',
    children: [
      {
        id: 'home-furniture',
        label: 'Furniture',
        children: [
          { id: 'home-furniture-living', label: 'Living Room' },
          { id: 'home-furniture-bedroom', label: 'Bedroom' },
        ],
      },
      { id: 'home-decor', label: 'Decor', children: [] },
      { id: 'home-kitchen', label: 'Kitchen', children: [] },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    children: [
      {
        id: 'sports-outdoor',
        label: 'Outdoor',
        children: [
          { id: 'sports-outdoor-camping', label: 'Camping' },
          { id: 'sports-outdoor-hiking', label: 'Hiking' },
        ],
      },
      { id: 'sports-fitness', label: 'Fitness', children: [] },
    ],
  },
];

exports.adsSlides = [
  { id: 1, title: 'Summer Sale', subtitle: 'Up to 50% off', image: 'https://picsum.photos/seed/sale1/800/300' },
  { id: 2, title: 'New Arrivals', subtitle: 'Check out the latest', image: 'https://picsum.photos/seed/new2/800/300' },
  { id: 3, title: 'Free Shipping', subtitle: 'On orders over $50', image: 'https://picsum.photos/seed/ship3/800/300' },
  { id: 4, title: 'Best Sellers', subtitle: 'Top picks this week', image: 'https://picsum.photos/seed/best4/800/300' },
  { id: 5, title: 'Flash Deals', subtitle: 'Limited time only', image: 'https://picsum.photos/seed/flash5/800/300' },
];

exports.importantNotices = [
  { id: 1, text: 'Free returns within 30 days' },
  { id: 2, text: 'Flash deal: 2 for 1 on selected items' },
  { id: 3, text: 'New collection dropping this week' },
];

exports.products = [
  {
    id: 'p1',
    title: 'Wireless Headphones Pro',
    sku: 'SKU-ELEC-001',
    price: 129.99,
    originalPrice: 159.99,
    discountRate: 19,
    images: [
      'https://picsum.photos/seed/p1a/400/400',
      'https://picsum.photos/seed/p1b/400/400',
      'https://picsum.photos/seed/p1c/400/400',
      'https://picsum.photos/seed/p1d/400/400',
      'https://picsum.photos/seed/p1e/400/400',
      'https://picsum.photos/seed/p1f/400/400',
      'https://picsum.photos/seed/p1g/400/400',
      'https://picsum.photos/seed/p1h/400/400',
      'https://picsum.photos/seed/p1i/400/400',
      'https://picsum.photos/seed/p1j/400/400',
      'https://picsum.photos/seed/p1k/400/400',
      'https://picsum.photos/seed/p1l/400/400',
    ],
    categoryId: 'elec',
  },
  {
    id: 'p2',
    title: 'Ultra HD Monitor 27"',
    sku: 'SKU-ELEC-002',
    price: 299.99,
    originalPrice: 349.99,
    discountRate: 14,
    images: [
      'https://picsum.photos/seed/p2a/400/400',
      'https://picsum.photos/seed/p2b/400/400',
      'https://picsum.photos/seed/p2c/400/400',
      'https://picsum.photos/seed/p2d/400/400',
      'https://picsum.photos/seed/p2e/400/400',
      'https://picsum.photos/seed/p2f/400/400',
      'https://picsum.photos/seed/p2g/400/400',
      'https://picsum.photos/seed/p2h/400/400',
    ],
    categoryId: 'elec',
  },
  {
    id: 'p3',
    title: 'Classic Denim Jacket',
    sku: 'SKU-FASH-001',
    price: 79.99,
    originalPrice: 99.99,
    discountRate: 20,
    images: [
      'https://picsum.photos/seed/p3a/400/400',
      'https://picsum.photos/seed/p3b/400/400',
      'https://picsum.photos/seed/p3c/400/400',
      'https://picsum.photos/seed/p3d/400/400',
      'https://picsum.photos/seed/p3e/400/400',
      'https://picsum.photos/seed/p3f/400/400',
    ],
    categoryId: 'fashion',
  },
  {
    id: 'p4',
    title: 'Running Shoes Air',
    sku: 'SKU-SPORTS-001',
    price: 119.99,
    originalPrice: 119.99,
    discountRate: 0,
    images: [
      'https://picsum.photos/seed/p4a/400/400',
      'https://picsum.photos/seed/p4b/400/400',
      'https://picsum.photos/seed/p4c/400/400',
      'https://picsum.photos/seed/p4d/400/400',
      'https://picsum.photos/seed/p4e/400/400',
    ],
    categoryId: 'sports',
  },
  {
    id: 'p5',
    title: 'Smart Watch Series X',
    sku: 'SKU-ELEC-003',
    price: 249.99,
    originalPrice: 299.99,
    discountRate: 17,
    images: [
      'https://picsum.photos/seed/p5a/400/400',
      'https://picsum.photos/seed/p5b/400/400',
      'https://picsum.photos/seed/p5c/400/400',
      'https://picsum.photos/seed/p5d/400/400',
      'https://picsum.photos/seed/p5e/400/400',
      'https://picsum.photos/seed/p5f/400/400',
      'https://picsum.photos/seed/p5g/400/400',
    ],
    categoryId: 'elec',
  },
  {
    id: 'p6',
    title: 'Desk Lamp LED',
    sku: 'SKU-HOME-001',
    price: 39.99,
    originalPrice: 49.99,
    discountRate: 20,
    images: [
      'https://picsum.photos/seed/p6a/400/400',
      'https://picsum.photos/seed/p6b/400/400',
    ],
    categoryId: 'home',
  },
  {
    id: 'p7',
    title: 'Backpack Explorer',
    sku: 'SKU-FASH-002',
    price: 59.99,
    originalPrice: 69.99,
    discountRate: 14,
    images: [
      'https://picsum.photos/seed/p7a/400/400',
      'https://picsum.photos/seed/p7b/400/400',
    ],
    categoryId: 'fashion',
  },
  {
    id: 'p8',
    title: 'Yoga Mat Premium',
    sku: 'SKU-SPORTS-002',
    price: 34.99,
    originalPrice: 44.99,
    discountRate: 22,
    images: [
      'https://picsum.photos/seed/p8a/400/400',
      'https://picsum.photos/seed/p8b/400/400',
    ],
    categoryId: 'sports',
  },
];

exports.recommendedProductIds = ['p1', 'p5', 'p2', 'p3', 'p6'];
exports.mostVisitedProductIds = ['p4', 'p7', 'p8', 'p1', 'p2', 'p3'];
exports.trendingProductIds = ['p3', 'p1', 'p4', 'p6', 'p5', 'p7', 'p8'];
