const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Vitamin C Brightening Serum",
    rating: 4.5,
    reviews: 234,
    price: 1299,
    category: "Serums",
    brand: "Brand A",
    skinType: "All",
    skinConcerns: "Brightening",
    bestseller: true,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Anti-Aging Night Cream",
    rating: 4.6,
    reviews: 145,
    price: 1099,
    category: "Moisturizers",
    brand: "Brand B",
    skinType: "All",
    skinConcerns: "Anti-Aging",
    bestseller: true,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "Hydrating Hyaluronic Acid Serum",
    rating: 4.3,
    reviews: 198,
    price: 899,
    category: "Serums",
    brand: "Brand C",
    skinType: "Dry",
    skinConcerns: "Hydrating",
    bestseller: false,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 4,
    name: "Gentle Foaming Cleanser Serum",
    rating: 4.3,
    reviews: 190,
    price: 999,
    category: "Cleansers",
    brand: "Brand D",
    skinType: "Sensitive",
    skinConcerns: "Gentle",
    bestseller: false,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 5,
    name: "Niacinamide Pore Control Serum",
    rating: 4.4,
    reviews: 238,
    price: 749,
    category: "Serums",
    brand: "Brand E",
    skinType: "Oily",
    skinConcerns: "Pore Control",
    bestseller: false,
    image: "https://via.placeholder.com/150"
  },
  {
    id: 6,
    name: "Sunscreen SPF 50",
    rating: 4.2,
    reviews: 160,
    price: 789,
    category: "Moisturizers",
    brand: "Brand F",
    skinType: "All",
    skinConcerns: "Sun Protection",
    bestseller: false,
    image: "https://via.placeholder.com/150"
  }
];

// GET /api/products?category=&brand=&skinType=&skinConcerns=&sort=
app.get('/api/products', (req, res) => {
  let filteredProducts = products;

  const { category, brand, skinType, skinConcerns, sort } = req.query;

  if (category && category !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  if (brand && brand !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.brand === brand);
  }
  if (skinType && skinType !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.skinType === skinType);
  }
  if (skinConcerns && skinConcerns !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.skinConcerns === skinConcerns);
  }

  if (sort) {
    if (sort === 'popularity') {
      filteredProducts = filteredProducts.sort((a, b) => b.reviews - a.reviews);
    } else if (sort === 'priceLowHigh') {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceHighLow') {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  res.json(filteredProducts);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
