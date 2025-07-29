
        // Product data
        const products = [
            {
                id: 1,
                name: "Vitamin C Brightening Serum",
                rating: 4.5,
                reviews: 234,
                price: "₹1299",
                bestseller: true
            },
            {
                id: 2,
                name: "Anti-Aging Night Cream",
                rating: 4.3,
                reviews: 156,
                price: "₹1099",
                bestseller: true
            },
            {
                id: 3,
                name: "Hydrating Hyaluronic Acid Serum",
                rating: 4.3,
                reviews: 189,
                price: "₹899",
                bestseller: false
            },
            {
                id: 4,
                name: "Gentle Foaming Cleanser Serum",
                rating: 4.2,
                reviews: 167,
                price: "₹699",
                bestseller: false
            },
            {
                id: 5,
                name: "Niacinamide Pore Control Serum",
                rating: 4.4,
                reviews: 233,
                price: "₹749",
                bestseller: false
            },
            {
                id: 6,
                name: "Sunscreen SPF 50",
                rating: 4.2,
                reviews: 145,
                price: "₹789",
                bestseller: false
            }
        ];

        const collections = [
            {
                name: "Aloe Herb Soothing",
                description: "For instant comfort & hydration",
                icon: "🌿"
            },
            {
                name: "Aloe Herb Soothing",
                description: "For instant comfort & hydration",
                icon: "🌿"
            },
            {
                name: "Aloe Herb Soothing",
                description: "For instant comfort & hydration",
                icon: "🌿"
            },
            {
                name: "Aloe Herb Soothing",
                description: "For instant comfort & hydration",
                icon: "🌿"
            },
            {
                name: "Aloe Herb Soothing",
                description: "For instant comfort & hydration",
                icon: "🌿"
            }
        ];

        const latestCollections = [
            {
                name: "Apricot Moist Smoothing Balm",
                description: "Softens and refreshes tired skin"
            },
            {
                name: "Blueberry Skin Clarity Cream",
                description: "Clarity and bright radiance"
            },
            {
                name: "Revitalize Cooling Serum",
                description: "Ultimate cool and smooth finish"
            }
        ];

        let cart = [];

        // Render products
        function renderProducts() {
            const productGrid = document.getElementById('productGrid');
            const productIcons = ['🧴', '🧴', '💧', '🧼', '✨', '☀️'];
            
            productGrid.innerHTML = products.map((product, index) => `
                <div class="product-card fade-in-up">
                    ${product.bestseller ? '<div class="bestseller-badge">Bestseller</div>' : ''}
                    <div class="product-image">
                        ${productIcons[index]}
                    </div>
                    <h3>${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '☆' : ''}</span>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">${product.price}</div>
                    <button class="add-to-bag-btn" onclick="addToBag(${product.id})">Add to Bag</button>
                </div>
            `).join('');
        }

        // Render collections
        function renderCollections() {
            const collectionsGrid = document.getElementById('collectionsGrid');
            collectionsGrid.innerHTML = collections.map(collection => `
                <div class="collection-card">
                    <div class="collection-icon">${collection.icon}</div>
                    <h3>${collection.name}</h3>
                    <p>${collection.description}</p>
                    <button class="shop-now-btn">Shop Now</button>
                </div>
            `).join('');
        }

        // Render latest collections
        function renderLatestCollections() {
            const latestCollections = document.getElementById('latestCollections');
            latestCollections.innerHTML = [
                {
                    name: "Apricot Moist Smoothing Balm",
                    description: "Softens and refreshes tired skin"
                },
                {
                    name: "Blueberry Skin Clarity Cream",
                    description: "Clarity and bright radiance"
                },
                {
                    name: "Revitalize Cooling Serum",
                    description: "Ultimate cool and smooth finish"
                }
            ].map(collection => `
                <div class="latest-card">
                    <div class="latest-card-content">
                        <div class="collection-icon">🌿</div>
                        <h3>${collection.name}</h3>
                        <p>${collection.description}</p>
                        <button class="shop-now-btn">Shop Now</button>
                    </div>
                </div>
            `).join('');
        }

        // Add to bag functionality
        function addToBag(productId) {
            const product = products.find(p => p.id === productId);
            cart.push(product);
            updateCartCount();
            
            // Show success animation
            const event = new CustomEvent('productAdded', { detail: product });
            document.dispatchEvent(event);
        }

        // Update cart count
        function updateCartCount() {
            document.getElementById('cartCount').textContent = cart.length;
        }

        // Toggle mobile menu
        function toggleMobileMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.toggle('active');
        }

        // Toggle cart (placeholder function)
        function toggleCart() {
            alert(`Cart has ${cart.length} items`);
        }

        // Add scroll animations
        function addScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                    }
                });
            });

            document.querySelectorAll('.product-card, .collection-card').forEach(el => {
                observer.observe(el);
            });
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            renderProducts();
            renderCollections();
            renderLatestCollections();
            addScrollAnimations();

            // Add success message for added products
            document.addEventListener('productAdded', function(e) {
                const message = document.createElement('div');
                message.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
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

            // Add smooth scrolling for navigation links
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
        });

        // Add slideInRight animation
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
    
 let currentSlide = 0;

function showSlide(index) {
	const slides = document.querySelectorAll('.slide');

	slides.forEach((slide, i) => {
		slide.style.display = i === index ? 'flex' : 'none';
	});
}

function nextSlide() {
	currentSlide = (currentSlide + 1) % 6;
	showSlide(currentSlide);
}

setInterval(nextSlide, 2000);