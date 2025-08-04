// shopscript.js
document.addEventListener('DOMContentLoaded', () => {

    let fetchedProducts = []; // Global variable to store fetched products

    // --- YOUR EXISTING SLIDESHOW LOGIC ---
    let currentSlide = 0;

    function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'flex' : 'none';
        });
    }

    function nextSlide() {
        const totalSlides = document.querySelectorAll('.slide').length;
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    showSlide(currentSlide);
    setInterval(nextSlide, 3000);


    // --- BACKEND FETCHING AND PRODUCT RENDERING ---

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += '★';
        if (halfStar) starsHtml += '½';
        for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
        return starsHtml;
    }

    function renderProducts(productsToRender) {
        const productGrid = document.getElementById('productGrid');
        const productsCountSpan = document.querySelector('.products-count');

        if (!productGrid) {
            console.error("Error: Element with ID 'productGrid' not found in shop.html. Cannot render products.");
            return;
        }
        if (!productsCountSpan) {
            console.error("Error: Element with class 'products-count' not found in shop.html. Cannot update product count.");
        }
        
        productGrid.innerHTML = '';

        if (!productsToRender || productsToRender.length === 0) {
            productGrid.innerHTML = '<div style="text-align: center; width: 100%; grid-column: 1 / -1;">No products found.</div>';
            if (productsCountSpan) productsCountSpan.textContent = `0 products found`;
            return;
        }

        productGrid.innerHTML = productsToRender.map(product => `
            <div class="product-card fade-in-up">
                ${product.is_bestseller ? '<div class="bestseller-badge">Bestseller</div>' : ''}
                <div class="product-image">
                    <img src="${product.image_url || 'https://via.placeholder.com/200?text=No+Image'}" 
                         alt="${product.name}" 
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/200?text=No+Image';">
                </div>
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${generateStarRating(product.rating)}</span>
                    <span class="rating-count">(${product.rating_count})</span>
                </div>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <button class="add-to-bag-btn" data-product-id="${product.id}">Buy Now</button>
            </div>
        `).join('');

        if (productsCountSpan) productsCountSpan.textContent = `${productsToRender.length} products found`;

        document.querySelectorAll('.add-to-bag-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                addToBag(productId);
            });
        });
    }

    async function fetchProducts(sort = 'popularity', category = '') {
        const productGrid = document.getElementById('productGrid'); // Ensure this is not null
        if (productGrid) {
            productGrid.innerHTML = '<div style="text-align: center; width: 100%; grid-column: 1 / -1;">Loading products...</div>';
        }

        let url = 'http://127.0.0.1:5000/api/products';

        const params = new URLSearchParams();
        if (sort === 'price_asc') {
            params.append('sort', 'price_asc');
        } else if (sort === 'price_desc') {
            params.append('sort', 'price_desc');
        } else if (sort === 'rating') {
            params.append('sort', 'rating');
        }

        if (category && category !== 'All') { // Only add category param if not "All"
            params.append('category', category);
        }

        if (params.toString()) {
            url += '?' + params.toString();
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            fetchedProducts = data;
            renderProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            if (productGrid) {
                productGrid.innerHTML = '<div style="text-align: center; width: 100%; grid-column: 1 / -1; color: red;">Failed to load products. Please ensure the backend is running.</div>';
            }
            const productsCountSpan = document.querySelector('.products-count');
            if (productsCountSpan) productsCountSpan.textContent = `0 products found`;
        }
    }

    const sortDropdown = document.querySelector('.sort-dropdown');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', (event) => {
            const selectedSort = event.target.value;
            let sortParam = '';
            if (selectedSort === 'Price: Low to High') {
                sortParam = 'price_asc';
            } else if (selectedSort === 'Price: High to Low') {
                sortParam = 'price_desc';
            } else if (selectedSort === 'Customer Rating') {
                sortParam = 'rating';
            } else {
                sortParam = 'popularity';
            }
            // Preserve current category filter if any
            const currentCategory = document.querySelector('.dropdown-content .active-category')?.dataset.category || 'All';
            fetchProducts(sortParam, currentCategory);
        });
    }


    // --- NEW: FETCH AND RENDER CATEGORIES ---
    async function fetchCategories() {
        const categoriesDropdown = document.getElementById('categoriesDropdown');
        if (!categoriesDropdown) {
            console.error("Error: Element with ID 'categoriesDropdown' not found.");
            return;
        }

        let url = 'http://127.0.0.1:5000/api/categories';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categories = await response.json();
            
            // Clear existing and add "All Products" back
            categoriesDropdown.innerHTML = '';
            const allProductsLink = document.createElement('a');
            allProductsLink.href = "#";
            allProductsLink.dataset.category = "All";
            allProductsLink.textContent = "All Products";
            allProductsLink.classList.add('active-category'); // Set "All" as default active
            categoriesDropdown.appendChild(allProductsLink);

            categories.forEach(category => {
                const categoryLink = document.createElement('a');
                categoryLink.href = "#"; // Link to itself for now
                categoryLink.dataset.category = category.name; // Store category name in data attribute
                categoryLink.textContent = category.name;
                categoriesDropdown.appendChild(categoryLink);
            });

            // Add event listeners to newly created category links
            categoriesDropdown.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default link behavior
                    const selectedCategory = event.target.dataset.category;
                    
                    // Remove active class from all category links
                    categoriesDropdown.querySelectorAll('a').forEach(a => a.classList.remove('active-category'));
                    // Add active class to the clicked link
                    event.target.classList.add('active-category');

                    // Fetch products filtered by this category
                    const currentSort = sortDropdown ? sortDropdown.value : 'popularity'; // Get current sort
                    let sortParam = '';
                    if (currentSort === 'Price: Low to High') {
                        sortParam = 'price_asc';
                    } else if (currentSort === 'Price: High to Low') {
                        sortParam = 'price_desc';
                    } else if (currentSort === 'Customer Rating') {
                        sortParam = 'rating';
                    } else { // Default or Popularity
                        sortParam = 'popularity';
                    }
                    fetchProducts(sortParam, selectedCategory);
                });
            });

        } catch (error) {
            console.error('Error fetching categories:', error);
            if (categoriesDropdown) {
                categoriesDropdown.innerHTML += '<a href="#">Error loading categories</a>';
            }
        }
    }


    // --- YOUR EXISTING COLLECTIONS DATA ---
    const collections = [
        {
            name: "Aloe Herb Soothing",
            description: "For instant comfort & hydration",
            icon: "🌿",
            productId: 1 // Assigning Product ID 1 (e.g., Herbal Hair Oil)
        },
        {
            name: "Aloe Herb Soothing",
            description: "For instant comfort & hydration",
            icon: "🌿",
            productId: 2 // Assigning Product ID 2 (e.g., Neem & Tulsi Soap)
        },
        {
            name: "Aloe Herb Soothing",
            description: "For instant comfort & hydration",
            icon: "🌿",
            productId: 3 // Assigning Product ID 3 (e.g., Amla Shikakai Shampoo)
        },
        {
            name: "Aloe Herb Soothing",
            description: "For instant comfort & hydration",
            icon: "🌿",
            productId: 4 // Assigning Product ID 4 (e.g., Rose Water Toner)
        },
        {
            name: "Aloe Herb Soothing",
            description: "For instant comfort & hydration",
            icon: "🌿",
            productId: 5 // Assigning Product ID 5 (e.g., Sandalwood Soap)
        }
    ];

    const latestCollections = [
        {
            name: "Apricot Moist Smoothing Balm",
            description: "Softens and refreshes tired skin",
            productId: 1 // Assigning Product ID 1
        },
        {
            name: "Blueberry Skin Clarity Cream",
            description: "Clarity and bright radiance",
            productId: 2 // Assigning Product ID 2
        },
        {
            name: "Revitalize Cooling Serum",
            description: "Ultimate cool and smooth finish",
            productId: 3 // Assigning Product ID 3
        }
    ];

    function renderCollections() {
        const collectionsGrid = document.getElementById('collectionsGrid');
        if (collectionsGrid) {
            collectionsGrid.innerHTML = collections.map(collection => `
                <div class="collection-card">
                    <div class="collection-icon">${collection.icon}</div>
                    <h3>${collection.name}</h3>
                    <p>${collection.description}</p>
                    <button class="shop-now-btn" data-product-id="${collection.productId}">Buy Now</button>
                </div>
            `).join('');

            collectionsGrid.querySelectorAll('.shop-now-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = parseInt(event.target.dataset.productId);
                    addToBag(productId);
                });
            });
        }
    }

    function renderLatestCollections() {
        const latestCollectionsContainer = document.getElementById('latestCollections');
        if (latestCollectionsContainer) {
            latestCollectionsContainer.innerHTML = latestCollections.map(collection => `
                <div class="latest-card">
                    <div class="latest-card-content">
                        <div class="collection-icon">🌿</div>
                        <h3>${collection.name}</h3>
                        <p>${collection.description}</p>
                        <button class="shop-now-btn" data-product-id="${collection.productId}">Buy Now</button>
                    </div>
                </div>
            `).join('');

            latestCollectionsContainer.querySelectorAll('.shop-now-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = parseInt(event.target.dataset.productId);
                    addToBag(productId);
                });
            });
        }
    }

    // --- GLOBAL CART UTILITIES (ATTACHED TO WINDOW) ---
    window.loadCart = function() {
        try {
            const cart = JSON.parse(localStorage.getItem('dishaCart')) || [];
            return cart;
        } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
            return [];
        }
    };

    window.saveCart = function(cart) {
        localStorage.setItem('dishaCart', JSON.stringify(cart));
        window.updateCartCountDisplay();
    };

    window.updateCartCountDisplay = function() {
        const cart = window.loadCart();
        const cartCountSpan = document.getElementById('cartCount');
        if (cartCountSpan) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountSpan.textContent = totalItems;
        }
    };

    function addToBag(productId) {
        let cart = window.loadCart();
        const productToAdd = fetchedProducts.find(p => p.id === productId);

        if (productToAdd) {
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...productToAdd, quantity: 1 });
            }
            window.saveCart(cart);

            const event = new CustomEvent('productAdded', { detail: productToAdd });
            document.dispatchEvent(event);
        } else {
            console.warn(`Product with ID ${productId} not found in fetched products.`);
        }
    }

    window.toggleCart = function() {
        window.location.href = './cart.html';
    };


    // --- YOUR EXISTING MOBILE MENU AND ANIMATIONS ---
    window.toggleMobileMenu = function() {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
    };

    function addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);


    // --- INITIALIZE THE PAGE ---
    fetchProducts(); // Fetch all products initially
    fetchCategories(); // Fetch categories to populate dropdown
    renderCollections();
    renderLatestCollections();
    addScrollAnimations();
    window.updateCartCountDisplay();

    document.addEventListener('productAdded', function(e) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 60px;
            right: 80px;
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        message.textContent = `${e.detail.name} added to bag!`;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    });
});


const signInBtn = document.querySelector('.sign-in-btn');
if (signInBtn) {
    signInBtn.addEventListener('click', () => {
        window.location.href = '../signup/signup.html';
    });
}




// Floating Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const floatingToggle = document.getElementById('floatingMenuToggle');
    const floatingDropdown = document.getElementById('floatingDropdown');
    
    if (floatingToggle && floatingDropdown) {
        floatingToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle active states
            floatingToggle.classList.toggle('active');
            floatingDropdown.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!floatingToggle.contains(e.target) && !floatingDropdown.contains(e.target)) {
                floatingToggle.classList.remove('active');
                floatingDropdown.classList.remove('active');
            }
        });

        // Close menu when clicking on menu items
        const menuItems = floatingDropdown.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                floatingToggle.classList.remove('active');
                floatingDropdown.classList.remove('active');
            });
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (floatingToggle) floatingToggle.classList.remove('active');
            if (floatingDropdown) floatingDropdown.classList.remove('active');
        }
    });
});