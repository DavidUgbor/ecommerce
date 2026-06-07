import prisma from './config/database';
import bcrypt from 'bcryptjs';

const categories = [
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Premium handcrafted leather shoes for every occasion',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
  },
  {
    name: 'Belts',
    slug: 'belts',
    description: 'Genuine leather belts crafted to perfection',
    image: 'https://images.pexels.com/photos/6654763/pexels-photo-6654763.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Bags',
    slug: 'bags',
    description: 'Luxury leather bags and handbags',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
  },
  {
    name: 'Wallets',
    slug: 'wallets',
    description: 'Slim and classic leather wallets',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Leather accessories and small goods',
    image: 'https://images.pexels.com/photos/4452642/pexels-photo-4452642.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Sandals',
    slug: 'sandals',
    description: 'Handcrafted leather sandals for every season',
    image: 'https://images.pexels.com/photos/2961991/pexels-photo-2961991.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Slippers',
    slug: 'slippers',
    description: 'Premium leather slippers and moccasins for home and leisure',
    image: 'https://images.pexels.com/photos/2562992/pexels-photo-2562992.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const products = [
  // Shoes
  {
    name: 'Oxford Classic Brogue',
    slug: 'oxford-classic-brogue',
    description: 'Timeless full-grain leather Oxford shoes with intricate brogue detailing. Hand-stitched welt construction ensures durability and comfort for all-day wear. Perfect for formal occasions and business settings.',
    price: 289.99,
    comparePrice: 349.99,
    stock: 45,
    sku: 'SH-001',
    category: 'shoes',
    tags: 'oxford,brogue,formal,leather,classic',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
    ],
    variants: [
      { type: 'SIZE', value: '40', stock: 8, priceModifier: 0 },
      { type: 'SIZE', value: '41', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '42', stock: 12, priceModifier: 0 },
      { type: 'SIZE', value: '43', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '44', stock: 5, priceModifier: 0 },
    ],
  },
  {
    name: 'Chelsea Boot Premium',
    slug: 'chelsea-boot-premium',
    description: 'Sleek pull-on Chelsea boots in supple full-grain leather. Elastic side panels for easy wear, with a leather-lined interior for ultimate comfort. A versatile staple for any wardrobe.',
    price: 329.99,
    comparePrice: 399.99,
    stock: 30,
    sku: 'SH-002',
    category: 'shoes',
    tags: 'chelsea,boot,leather,premium',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-k_hd8rsSbtg?w=800&q=80',
    ],
    variants: [
      { type: 'SIZE', value: '40', stock: 6, priceModifier: 0 },
      { type: 'SIZE', value: '41', stock: 8, priceModifier: 0 },
      { type: 'SIZE', value: '42', stock: 9, priceModifier: 0 },
      { type: 'SIZE', value: '43', stock: 7, priceModifier: 0 },
    ],
  },
  {
    name: 'Derby Wingtip Lace-Up',
    slug: 'derby-wingtip-lace-up',
    description: 'Classic derby shoes with elegant wingtip detailing. Crafted from premium vegetable-tanned leather that develops a beautiful patina over time. Open lacing system for a comfortable, relaxed fit.',
    price: 249.99,
    comparePrice: null,
    stock: 55,
    sku: 'SH-003',
    category: 'shoes',
    tags: 'derby,wingtip,leather,classic',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
    ],
    variants: [
      { type: 'SIZE', value: '40', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '41', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '42', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '43', stock: 15, priceModifier: 0 },
    ],
  },
  {
    name: 'Loafer Penny Classic',
    slug: 'loafer-penny-classic',
    description: 'Effortlessly stylish penny loafers in smooth calf leather. The classic slip-on design features a leather sole with rubber heel for superior traction. Goes from casual to smart-casual with ease.',
    price: 219.99,
    comparePrice: 269.99,
    stock: 40,
    sku: 'SH-004',
    category: 'shoes',
    tags: 'loafer,penny,casual,leather',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
    ],
    variants: [
      { type: 'SIZE', value: '40', stock: 8, priceModifier: 0 },
      { type: 'SIZE', value: '41', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '42', stock: 12, priceModifier: 0 },
      { type: 'SIZE', value: '43', stock: 10, priceModifier: 0 },
    ],
  },
  // Belts
  {
    name: 'Executive Dress Belt',
    slug: 'executive-dress-belt',
    description: 'A distinguished dress belt crafted from full-grain calfskin leather. Features a brushed silver buckle and a uniform width perfect for formal trousers and suits. The sign of true sartorial excellence.',
    price: 89.99,
    comparePrice: 119.99,
    stock: 80,
    sku: 'BL-001',
    category: 'belts',
    tags: 'dress,belt,formal,silver,executive',
    featured: true,
    images: [
      'https://images.pexels.com/photos/6654763/pexels-photo-6654763.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'SIZE', value: '30"', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '32"', stock: 20, priceModifier: 0 },
      { type: 'SIZE', value: '34"', stock: 20, priceModifier: 0 },
      { type: 'SIZE', value: '36"', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '38"', stock: 10, priceModifier: 0 },
    ],
  },
  {
    name: 'Braided Casual Belt',
    slug: 'braided-casual-belt',
    description: 'Handwoven braided leather belt with a timeless look. The no-hole design allows for a custom fit, while the genuine leather construction ensures lasting quality. Perfect for jeans and chinos.',
    price: 69.99,
    comparePrice: null,
    stock: 60,
    sku: 'BL-002',
    category: 'belts',
    tags: 'braided,casual,belt,leather',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-Mf194wsFKZI?w=800&q=80',
    ],
    variants: [
      { type: 'SIZE', value: '32"', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '34"', stock: 20, priceModifier: 0 },
      { type: 'SIZE', value: '36"', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '38"', stock: 10, priceModifier: 0 },
    ],
  },
  {
    name: 'Reversible Leather Belt',
    slug: 'reversible-leather-belt',
    description: 'Two belts in one — this ingenious reversible design features rich brown on one side and classic black on the other. Crafted from smooth full-grain leather with an elegant gold-tone buckle.',
    price: 99.99,
    comparePrice: 129.99,
    stock: 50,
    sku: 'BL-003',
    category: 'belts',
    tags: 'reversible,belt,leather,gold',
    featured: false,
    images: [
      'https://images.pexels.com/photos/31323080/pexels-photo-31323080.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'SIZE', value: '32"', stock: 12, priceModifier: 0 },
      { type: 'SIZE', value: '34"', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '36"', stock: 13, priceModifier: 0 },
      { type: 'SIZE', value: '38"', stock: 10, priceModifier: 0 },
    ],
  },
  // Bags
  {
    name: 'Heritage Briefcase',
    slug: 'heritage-briefcase',
    description: 'A masterfully crafted briefcase in full-grain leather that only gets better with age. Features a padded laptop compartment, multiple organization pockets, and solid brass hardware. The definitive professional accessory.',
    price: 549.99,
    comparePrice: 649.99,
    stock: 20,
    sku: 'BG-001',
    category: 'bags',
    tags: 'briefcase,laptop,work,professional,leather',
    featured: true,
    images: [
      'https://images.pexels.com/photos/7595038/pexels-photo-7595038.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3778212/pexels-photo-3778212.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'COLOR', value: 'Tan', stock: 8, priceModifier: 0 },
      { type: 'COLOR', value: 'Dark Brown', stock: 7, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 5, priceModifier: 0 },
    ],
  },
  {
    name: 'Crossbody Satchel',
    slug: 'crossbody-satchel',
    description: 'A sleek crossbody satchel in pebbled leather. Features an adjustable strap, magnetic closure, and multiple interior pockets. The perfect companion for daily adventures.',
    price: 289.99,
    comparePrice: 349.99,
    stock: 35,
    sku: 'BG-002',
    category: 'bags',
    tags: 'crossbody,satchel,casual,daily',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    ],
    variants: [
      { type: 'COLOR', value: 'Cognac', stock: 12, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 13, priceModifier: 0 },
      { type: 'COLOR', value: 'Navy', stock: 10, priceModifier: 0 },
    ],
  },
  {
    name: 'Leather Tote Bag',
    slug: 'leather-tote-bag',
    description: 'A spacious and elegant leather tote bag with sturdy handles and a removable zip pouch. The open-top design provides easy access while the structured base keeps everything organized.',
    price: 349.99,
    comparePrice: null,
    stock: 25,
    sku: 'BG-003',
    category: 'bags',
    tags: 'tote,spacious,work,shopping',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    ],
    variants: [
      { type: 'COLOR', value: 'Caramel', stock: 10, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 15, priceModifier: 0 },
    ],
  },
  {
    name: 'Vintage Messenger Bag',
    slug: 'vintage-messenger-bag',
    description: 'Inspired by vintage postal bags, this messenger is crafted from oiled pull-up leather that develops a gorgeous patina. Large main compartment fits a 15" laptop with room to spare.',
    price: 419.99,
    comparePrice: 499.99,
    stock: 18,
    sku: 'BG-004',
    category: 'bags',
    tags: 'messenger,vintage,laptop,pull-up',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&q=80',
    ],
    variants: [
      { type: 'COLOR', value: 'Whiskey', stock: 8, priceModifier: 0 },
      { type: 'COLOR', value: 'Dark Brown', stock: 10, priceModifier: 0 },
    ],
  },
  // Wallets
  {
    name: 'Slim Bifold Wallet',
    slug: 'slim-bifold-wallet',
    description: 'The perfect everyday carry wallet. Crafted from vegetable-tanned leather with 6 card slots, a cash compartment, and an ID window. Slim enough to fit in any pocket without bulk.',
    price: 79.99,
    comparePrice: 99.99,
    stock: 100,
    sku: 'WL-001',
    category: 'wallets',
    tags: 'bifold,slim,wallet,card,daily',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    ],
    variants: [
      { type: 'COLOR', value: 'Tan', stock: 30, priceModifier: 0 },
      { type: 'COLOR', value: 'Dark Brown', stock: 35, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 35, priceModifier: 0 },
    ],
  },
  {
    name: 'Cardholder Slim',
    slug: 'cardholder-slim',
    description: 'Ultra-slim cardholder for the minimalist. Holds up to 8 cards in smooth vegetable-tanned leather. A refined accessory that fits perfectly in any pocket.',
    price: 49.99,
    comparePrice: 64.99,
    stock: 120,
    sku: 'WL-002',
    category: 'wallets',
    tags: 'cardholder,slim,minimalist,cards',
    featured: false,
    images: [
      'https://images.pexels.com/photos/33250/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'COLOR', value: 'Cognac', stock: 40, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 40, priceModifier: 0 },
      { type: 'COLOR', value: 'Navy', stock: 40, priceModifier: 0 },
    ],
  },
  {
    name: 'Travel Passport Wallet',
    slug: 'travel-passport-wallet',
    description: 'The ultimate travel companion. This passport wallet holds your passport, boarding passes, cards, and cash in one organized package. RFID-blocking technology protects your cards.',
    price: 119.99,
    comparePrice: 149.99,
    stock: 60,
    sku: 'WL-003',
    category: 'wallets',
    tags: 'passport,travel,rfid,organizer',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-YX5iTm_PPvg?w=800&q=80',
    ],
    variants: [
      { type: 'COLOR', value: 'Tan', stock: 20, priceModifier: 0 },
      { type: 'COLOR', value: 'Dark Brown', stock: 20, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 20, priceModifier: 0 },
    ],
  },
  {
    name: 'Long Zip Wallet',
    slug: 'long-zip-wallet',
    description: 'A spacious zip-around wallet with room for everything. Features 12 card slots, 2 cash compartments, a coin pocket, and a photo ID window. Premium full-grain leather with antique brass zipper.',
    price: 139.99,
    comparePrice: null,
    stock: 45,
    sku: 'WL-004',
    category: 'wallets',
    tags: 'zip,wallet,spacious,organizer',
    featured: true,
    images: [
      'https://images.pexels.com/photos/6649420/pexels-photo-6649420.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'COLOR', value: 'Burgundy', stock: 15, priceModifier: 0 },
      { type: 'COLOR', value: 'Tan', stock: 15, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 15, priceModifier: 0 },
    ],
  },
  // Sandals
  {
    name: 'Classic Leather Sandal',
    slug: 'classic-leather-sandal',
    description: 'Handcrafted from full-grain leather, these timeless sandals feature a contoured footbed and adjustable buckle straps for the perfect fit. The leather sole develops a beautiful patina with wear, making each pair uniquely yours.',
    price: 149.99,
    comparePrice: 189.99,
    stock: 45,
    sku: 'SD-001',
    category: 'sandals',
    tags: 'sandals,leather,classic,summer,handcrafted',
    featured: true,
    images: [
      'https://images.pexels.com/photos/2961991/pexels-photo-2961991.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'SIZE', value: '36', stock: 8, priceModifier: 0 },
      { type: 'SIZE', value: '37', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '38', stock: 12, priceModifier: 0 },
      { type: 'SIZE', value: '39', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '40', stock: 5, priceModifier: 0 },
    ],
  },
  {
    name: 'Strappy Summer Sandal',
    slug: 'strappy-summer-sandal',
    description: 'Elegant multi-strap sandals in supple vegetable-tanned leather. The criss-cross design sits beautifully on the foot, with a cushioned leather insole for all-day comfort. Effortlessly transitions from beach to dinner.',
    price: 169.99,
    comparePrice: null,
    stock: 35,
    sku: 'SD-002',
    category: 'sandals',
    tags: 'sandals,strappy,summer,elegant,leather',
    featured: true,
    images: [
      'https://images.pexels.com/photos/112285/pexels-photo-112285.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'SIZE', value: '36', stock: 7, priceModifier: 0 },
      { type: 'SIZE', value: '37', stock: 9, priceModifier: 0 },
      { type: 'SIZE', value: '38', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '39', stock: 9, priceModifier: 0 },
    ],
  },
  {
    name: 'Flat Leather Sandal',
    slug: 'flat-leather-sandal',
    description: 'Minimalist flat sandals cut from a single piece of premium nappa leather. Simple toe post design with an adjustable back strap. Lightweight and perfect for long walks on warm days.',
    price: 119.99,
    comparePrice: 149.99,
    stock: 50,
    sku: 'SD-003',
    category: 'sandals',
    tags: 'sandals,flat,minimalist,nappa,everyday',
    featured: false,
    images: [
      'https://images.pexels.com/photos/20752060/pexels-photo-20752060.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'SIZE', value: '36', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '37', stock: 13, priceModifier: 0 },
      { type: 'SIZE', value: '38', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '39', stock: 12, priceModifier: 0 },
    ],
  },
  // Slippers
  {
    name: 'Leather Moccasin Slipper',
    slug: 'leather-moccasin-slipper',
    description: 'Wrap your feet in luxury with these hand-stitched leather moccasin slippers. Made from soft full-grain leather with a plush shearling lining for incredible warmth and comfort. A home essential you will reach for every day.',
    price: 129.99,
    comparePrice: 159.99,
    stock: 40,
    sku: 'SL-001',
    category: 'slippers',
    tags: 'slippers,moccasin,shearling,home,comfort',
    featured: true,
    images: [
      'https://images.pexels.com/photos/2562992/pexels-photo-2562992.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'SIZE', value: '36', stock: 8, priceModifier: 0 },
      { type: 'SIZE', value: '37', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: '38', stock: 12, priceModifier: 0 },
      { type: 'SIZE', value: '39', stock: 10, priceModifier: 0 },
    ],
  },
  {
    name: 'Leather Loafer Slipper',
    slug: 'leather-loafer-slipper',
    description: 'The sophistication of a loafer meets the comfort of a slipper. Crafted in smooth calfskin leather with a flexible rubber sole, these are refined enough to wear beyond the home. Features a penny keeper strap and padded insole.',
    price: 149.99,
    comparePrice: null,
    stock: 35,
    sku: 'SL-002',
    category: 'slippers',
    tags: 'slippers,loafer,calfskin,rubber-sole,premium',
    featured: true,
    images: [
      'https://images.pexels.com/photos/1464627/pexels-photo-1464627.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'SIZE', value: '36', stock: 7, priceModifier: 0 },
      { type: 'SIZE', value: '37', stock: 9, priceModifier: 0 },
      { type: 'SIZE', value: '38', stock: 12, priceModifier: 0 },
      { type: 'SIZE', value: '39', stock: 7, priceModifier: 0 },
    ],
  },
  {
    name: 'Slide Leather Slipper',
    slug: 'slide-leather-slipper',
    description: 'Effortless luxury in a single band. These leather slide slippers feature a wide padded strap in butter-soft nappa leather and a contoured cork-latex footbed that molds to your foot over time.',
    price: 99.99,
    comparePrice: 129.99,
    stock: 55,
    sku: 'SL-003',
    category: 'slippers',
    tags: 'slippers,slide,nappa,cork,footbed',
    featured: false,
    images: [
      'https://images.pexels.com/photos/5698850/pexels-photo-5698850.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'SIZE', value: '36', stock: 12, priceModifier: 0 },
      { type: 'SIZE', value: '37', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '38', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: '39', stock: 13, priceModifier: 0 },
    ],
  },
  // Accessories
  {
    name: 'Leather Watch Strap',
    slug: 'leather-watch-strap',
    description: 'Upgrade your timepiece with this handcrafted leather watch strap. Made from genuine horween leather with a quick-release spring bar system for easy installation. Compatible with most 20mm and 22mm watches.',
    price: 59.99,
    comparePrice: 79.99,
    stock: 90,
    sku: 'AC-001',
    category: 'accessories',
    tags: 'watch,strap,horween,leather',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-12V36G17IbQ?w=800&q=80',
    ],
    variants: [
      { type: 'SIZE', value: '20mm', stock: 45, priceModifier: 0 },
      { type: 'SIZE', value: '22mm', stock: 45, priceModifier: 5 },
    ],
  },
  {
    name: 'Key Fob & Organizer',
    slug: 'key-fob-organizer',
    description: 'Keep your keys organized and scratch-free with this premium leather key fob. Features 6 key slots in a compact folding design, reducing pocket bulk significantly.',
    price: 39.99,
    comparePrice: 49.99,
    stock: 150,
    sku: 'AC-002',
    category: 'accessories',
    tags: 'key,fob,organizer,leather',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-dEwvH-LlpWc?w=800&q=80',
    ],
    variants: [
      { type: 'COLOR', value: 'Tan', stock: 50, priceModifier: 0 },
      { type: 'COLOR', value: 'Dark Brown', stock: 50, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 50, priceModifier: 0 },
    ],
  },
  {
    name: 'Leather Phone Case',
    slug: 'leather-phone-case',
    description: 'A sophisticated leather phone case that combines protection with elegance. Full-grain leather wraps around your device with precision cutouts. Available for iPhone and Samsung models.',
    price: 69.99,
    comparePrice: 89.99,
    stock: 70,
    sku: 'AC-003',
    category: 'accessories',
    tags: 'phone,case,leather,protection',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-FbFr5L-tqJI?w=800&q=80',
    ],
    variants: [
      { type: 'SIZE', value: 'iPhone 15', stock: 20, priceModifier: 0 },
      { type: 'SIZE', value: 'iPhone 15 Pro', stock: 20, priceModifier: 5 },
      { type: 'SIZE', value: 'Samsung S24', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: 'Samsung S24+', stock: 15, priceModifier: 5 },
    ],
  },
  {
    name: 'Leather Desk Pad',
    slug: 'leather-desk-pad',
    description: 'Transform your workspace with this luxurious full-grain leather desk pad. The smooth surface is ideal for mouse and keyboard use, while the beveled edges add a refined finish to any desk.',
    price: 149.99,
    comparePrice: 179.99,
    stock: 30,
    sku: 'AC-004',
    category: 'accessories',
    tags: 'desk,pad,office,workspace,leather',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-XHYbCCnKroc?w=800&q=80',
    ],
    variants: [
      { type: 'COLOR', value: 'Dark Green', stock: 10, priceModifier: 0 },
      { type: 'COLOR', value: 'Tan', stock: 10, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 10, priceModifier: 0 },
    ],
  },
  {
    name: 'Leather Gloves Premium',
    slug: 'leather-gloves-premium',
    description: 'Luxuriously soft lambskin leather gloves with cashmere lining for exceptional warmth. The classic design features a button closure and is hand-stitched for a perfect fit.',
    price: 129.99,
    comparePrice: 159.99,
    stock: 40,
    sku: 'AC-005',
    category: 'accessories',
    tags: 'gloves,lambskin,cashmere,winter',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-B8dibVzUW0Q?w=800&q=80',
    ],
    variants: [
      { type: 'SIZE', value: 'S', stock: 10, priceModifier: 0 },
      { type: 'SIZE', value: 'M', stock: 15, priceModifier: 0 },
      { type: 'SIZE', value: 'L', stock: 15, priceModifier: 0 },
    ],
  },
  {
    name: 'Leather Notebook Cover',
    slug: 'leather-notebook-cover',
    description: 'Protect and elevate your notebook with this hand-stitched leather cover. Compatible with A5 notebooks, featuring a pen loop, card pocket, and bookmark ribbon. A refined writing experience.',
    price: 89.99,
    comparePrice: null,
    stock: 55,
    sku: 'AC-006',
    category: 'accessories',
    tags: 'notebook,journal,cover,writing',
    featured: false,
    images: [
      'https://images.pexels.com/photos/242616/pexels-photo-242616.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    variants: [
      { type: 'COLOR', value: 'Cognac', stock: 18, priceModifier: 0 },
      { type: 'COLOR', value: 'Dark Brown', stock: 18, priceModifier: 0 },
      { type: 'COLOR', value: 'Black', stock: 19, priceModifier: 0 },
    ],
  },
];

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@leathergoods.com' },
    update: {},
    create: {
      email: 'admin@leathergoods.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+1234567890',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user1234', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER',
      phone: '+1987654321',
    },
  });
  console.log('Test user created:', testUser.email);

  // Create categories
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = category.id;
    console.log('Category created:', category.name);
  }

  // Create or update products
  for (const prod of products) {
    const { images, variants, category, ...productData } = prod;

    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (existing) {
      // Update images to fix any broken URLs
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.createMany({
        data: images.map((url, i) => ({ productId: existing.id, url, alt: productData.name, order: i })),
      });
      console.log('Product updated:', productData.name);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId: categoryMap[category],
        images: {
          create: images.map((url, i) => ({ url, alt: productData.name, order: i })),
        },
        variants: {
          create: variants.map((v) => ({
            type: v.type as 'SIZE' | 'COLOR',
            value: v.value,
            stock: v.stock,
            priceModifier: v.priceModifier,
          })),
        },
      },
    });
    console.log('Product created:', product.name);
  }

  // Create coupons
  await prisma.coupon.upsert({
    where: { code: 'LEATHER10' },
    update: {},
    create: {
      code: 'LEATHER10',
      type: 'PERCENT',
      value: 10,
      minOrder: 100,
      maxUses: 1000,
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      type: 'FIXED',
      value: 20,
      minOrder: 150,
      maxUses: 500,
      active: true,
    },
  });

  console.log('Seed completed successfully!');
  console.log('\nTest Credentials:');
  console.log('Admin: admin@leathergoods.com / admin123');
  console.log('User:  john@example.com / user1234');
  console.log('\nCoupon Codes:');
  console.log('LEATHER10 - 10% off orders over $100');
  console.log('WELCOME20 - $20 off orders over $150');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
