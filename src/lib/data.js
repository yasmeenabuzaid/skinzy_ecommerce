// lib/data.ts

// --- بيانات مؤقتة (Mock Data) ---
// في مشروع حقيقي، هذه البيانات تأتي من API

export const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Our Store', href: '#', megaMenu: true },
    { name: 'Special', href: '#', megaMenu: true },
    { name: 'Categories', href: '#', megaMenu: true },
    { name: 'Elements', href: '#', megaMenu: true },
];

export const heroSlides = [
    {
        image: '/hero.png',
        offer: 'Special Offer',
        title: 'Get Flat 25% OFF Cosmetic Sets!',
        description: 'Your little one will love creating their own course with this mini toy set',
        buttonText: 'Shop Now',
    },
    {
        image: '/hero.png',
        offer: 'New Arrivals',
        title: 'Discover Our Latest Collection',
        description: 'Premium quality products for your daily skincare routine.',
        buttonText: 'Explore More',
    },
    {
        image: '/hero.png',
        offer: 'Limited Time',
        title: 'Summer Sale is Here!',
        description: 'Get up to 50% off on selected items. Don\'t miss out!',
        buttonText: 'View Deals',
    },
];

export const brands = [
    { src: '/brand.png', alt: 'Retro Design Logo' },
    { src: '/brand2.png', alt: 'Classic Design Logo' },
    { src: '/brand.png', alt: 'Natural Logo' },
    { src: '/brand2.png', alt: 'Vintage Logo Collection' },
    { src: '/brand.png', alt: 'Organic Logo' },
    { src: '/brand2.png', alt: 'Classic Design Logo 2' },
];

export const categories = [
    { name: 'Creams', image: './category1.png' },
    { name: 'Concealer', image: './category2.png' },
    { name: 'Serum', image: './category3.png' },
    { name: 'Foundation', image: '/category4.png' },
    { name: 'Tinted Oil', image: '/category6.png' },
    { name: 'Lip Balm', image: '/product-1 (95).jpg' },
];

export const promoCards = [
    { title: 'Rose Hyaluronic Hydra Wash Mask Pack', image: 'https://images.pexels.com/photos/7795846/pexels-photo-7795846.jpeg', link: '#' },
    { title: 'Herbal Special For Blend Serum', image: 'https://images.pexels.com/photos/6693894/pexels-photo-6693894.jpeg', link: '#' },
    { title: 'Dynasty Cream For Korean Skincare', image: 'https://images.pexels.com/photos/2639947/pexels-photo-2639947.jpeg', link: '#' },
];

export const trendingProducts = [
    { id: 1, name: 'Renaissance Brightlight Serum 30ml', image: '/product-1 (95).jpg', rating: 5, reviews: 2, price: 100.00 },
    { id: 2, name: 'Super C Smart Nutrient Beauty Capsules', image: '/product-1 (97).jpg', rating: 5, reviews: 1, price: 65.00 },
    { id: 3, name: "Paula\'s Resist Hydrating Fluid Spf50 60ml", image: '/product-1 - 2025-01-24T154848.535.jpg', rating: 5, reviews: 1, price: 180.00 },
    { id: 4, name: 'Ordinary Hyaluronic Acid 2% + B5 30ml', image: '/product-1 - 2025-01-24T155552.518.jpg', rating: 4.5, reviews: 2, price: 70.00 },
    { id: 5, name: 'Mz Skin Reviving Antioxidant Glow Oil 30ml', image: '/product-1 - 2025-01-24T155844.176.jpg', rating: 0, reviews: 0, price: 80.00, originalPrice: 99.00, sale: true },
];

export const highlightedProducts = [
    { id: 6, name: 'Vinosource Grape Water Gel Moisturiser 50ml', image: '/products.png', rating: 3, reviews: 3, price: 75.00, originalPrice: 100.00, sale: true },
    { id: 7, name: 'Ren Hyaluronic Acid 2% + B5 30ml', image: '/product-1 - 2025-01-24T155844.176.jpg', rating: 5, reviews: 3, price: 150.00, originalPrice: 180.00, sale: true },
    { id: 8, name: 'Overnight Glow Dark Spot Sleeping Cream 50ml', image: '/product-1 - 2025-01-24T155552.518.jpg', rating: 0, reviews: 0, price: 70.00, originalPrice: 100.00, sale: true },
    { id: 9, name: 'Nutri-bronze Adaptive Sheer Tinted Serum 30ml', image: '/product-1 - 2025-01-24T154848.535.jpg', rating: 1, reviews: 1, price: 50.00, originalPrice: 80.00, sale: true },
    { id: 10, name: 'Laneige Lip Sleeping Mask Nuit Pure 20g', image: '/product-1 (97).jpg', rating: 0, reviews: 0, price: 45.00, originalPrice: 80.00, sale: true },
];

export const cartItems = [
    { id: 1, name: 'Overnight Glow Dark Spot Sleeping Cream 50ml', price: 70.00, quantity: 1, size: '100g', image: 'https://i.imgur.com/S2M2E4R.png' },
    { id: 2, name: 'Nutri-bronze Adaptive Sheer Tinted Serum 30ml', price: 120.00, quantity: 1, size: '30g', image: 'https://i.imgur.com/J4aA56b.png' },
    { id: 3, name: 'Moon Fruit 1% Bakuchiol Alternative Serum', price: 80.00, quantity: 6, size: '30ml', image: 'https://i.imgur.com/yF4EnP4.png' },
];
