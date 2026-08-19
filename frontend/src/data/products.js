import productImage from "../assets/images/close-up-futuristic-sneakers-showcase.jpg";

export const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "shoes", label: "Shoes" },
  { value: "home-living", label: "Home & Living" },
  { value: "beauty", label: "Beauty" },
  { value: "sports", label: "Sports" },
  { value: "accessories", label: "Accessories" },
];

export const products = [
  { id: 1, name: "AeroGlide Pro Running Sneakers", category: "shoes", brand: "Nike", price: 999, originalPrice: 1200, rating: 4.8, reviews: 2413, isNew: true, inStock: true, image: productImage, vendor: "Ksetra" },
  { id: 2, name: "CourtFlex Everyday Trainers", category: "shoes", brand: "Adidas", price: 1799, originalPrice: 2299, rating: 4.5, reviews: 892, isNew: false, inStock: true, image: productImage, vendor: "Stride House" },
  { id: 3, name: "Velocity Street Runners", category: "shoes", brand: "Puma", price: 2499, originalPrice: 2999, rating: 4.2, reviews: 516, isNew: true, inStock: false, image: productImage, vendor: "Urban Sole" },
  { id: 4, name: "Cloudstep Comfort Shoes", category: "shoes", brand: "Nike", price: 3299, originalPrice: 3999, rating: 4.7, reviews: 1204, isNew: false, inStock: true, image: productImage, vendor: "Ksetra" },
  { id: 5, name: "Auratone Studio Headphones", category: "electronics", brand: "Sony", price: 8999, originalPrice: 10999, rating: 4.8, reviews: 1820, isNew: true, inStock: true, image: productImage, vendor: "Nordvox Audio" },
  { id: 6, name: "Galaxy Tab S9 FE", category: "electronics", brand: "Samsung", price: 28999, originalPrice: 32999, rating: 4.6, reviews: 744, isNew: false, inStock: true, image: productImage, vendor: "Tech Orbit" },
  { id: 7, name: "AirPods Pro 2nd Gen", category: "electronics", brand: "Apple", price: 18999, originalPrice: 22900, rating: 4.7, reviews: 3102, isNew: true, inStock: false, image: productImage, vendor: "Nordvox Audio" },
  { id: 8, name: "Everyday Linen Overshirt", category: "fashion", brand: "Zara", price: 1599, originalPrice: 2199, rating: 4.1, reviews: 312, isNew: true, inStock: true, image: productImage, vendor: "Thread & Co" },
  { id: 9, name: "Relaxed Essential Hoodie", category: "fashion", brand: "Puma", price: 1299, originalPrice: 1799, rating: 4.4, reviews: 648, isNew: false, inStock: true, image: productImage, vendor: "Thread & Co" },
  { id: 10, name: "Minimal Ceramic Table Set", category: "home-living", brand: "Ikea", price: 2199, originalPrice: 2699, rating: 4.3, reviews: 189, isNew: false, inStock: true, image: productImage, vendor: "Casa Market" },
  { id: 11, name: "Hydrating Glow Serum", category: "beauty", brand: "Nykaa", price: 799, originalPrice: 999, rating: 4.5, reviews: 926, isNew: true, inStock: true, image: productImage, vendor: "Glow Cart" },
  { id: 12, name: "Trailblazer Training Bag", category: "sports", brand: "Adidas", price: 1899, originalPrice: 2499, rating: 4.2, reviews: 274, isNew: false, inStock: true, image: productImage, vendor: "Active Club" },
  { id: 13, name: "Sterling Daily Watch", category: "accessories", brand: "Fossil", price: 6499, originalPrice: 7999, rating: 4.6, reviews: 431, isNew: true, inStock: true, image: productImage, vendor: "Time Foundry" },
  { id: 14, name: "Classic Leather Crossbody", category: "accessories", brand: "Mango", price: 2399, originalPrice: 2999, rating: 4.0, reviews: 156, isNew: false, inStock: false, image: productImage, vendor: "Carryall Studio" },
];

export const getCategoryLabel = (value) =>
  categories.find((category) => category.value === value)?.label || "All Products";
