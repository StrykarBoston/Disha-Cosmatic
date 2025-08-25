// Tab functionality
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Show corresponding content
                const targetTab = tab.getAttribute('data-tab');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Size selector functionality
        const sizeOptions = document.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });

        // Thumbnail gallery functionality
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.querySelector('.main-image img');

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
                
                // Change main image (in a real scenario, you'd have different image sources)
                const thumbnailImg = thumbnail.querySelector('img');
                if (thumbnailImg) {
                    mainImage.src = thumbnailImg.src;
                }
            });
        });

        // FAQ functionality
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('span');
                
                // Toggle answer visibility
                answer.classList.toggle('active');
                
                // Toggle icon
                icon.textContent = answer.classList.contains('active') ? '-' : '+';
            });
        });

        // Add to cart functionality
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            // Simple animation for feedback
            addToCartBtn.style.transform = 'scale(0.95)';
            addToCartBtn.textContent = 'ADDED TO CART!';
            addToCartBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                addToCartBtn.style.transform = 'scale(1)';
                addToCartBtn.textContent = 'ADD TO CART';
                addToCartBtn.style.background = '#8B4513';
            }, 2000);
        });

        // Product card hover effects
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for scroll animations
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Smooth scrolling for internal links
        document.addEventListener('DOMContentLoaded', () => {
            // Initial animation for product section
            const productSection = document.querySelector('.product-section');
            if (productSection) {
                productSection.style.opacity = '1';
                productSection.style.transform = 'translateY(0)';
            }
        });

        // Dynamic price update based on size selection
        const priceElement = document.querySelector('.price');
        const originalPrice = document.querySelector('.original-price');
        
        sizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const size = option.textContent.trim();
                if (size === '100 ML') {
                    priceElement.textContent = 'MRP ₹477';
                    originalPrice.textContent = '₹540.00';
                } else if (size === '200 ML') {
                    priceElement.textContent = 'MRP ₹854';
                    originalPrice.textContent = '₹980.00';
                }
            });
        });

        // Image zoom effect for main product image
        const mainImageContainer = document.querySelector('.main-image');
        mainImageContainer.addEventListener('mouseenter', () => {
            const img = mainImageContainer.querySelector('img');
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.3s ease';
        });

        mainImageContainer.addEventListener('mouseleave', () => {
            const img = mainImageContainer.querySelector('img');
            img.style.transform = 'scale(1)';
        });

        // Loading state simulation for add to cart
        let isLoading = false;
        addToCartBtn.addEventListener('click', (e) => {
            if (isLoading) return;
            
            isLoading = true;
            e.target.disabled = true;
            e.target.textContent = 'ADDING...';
            e.target.style.opacity = '0.7';
            
            setTimeout(() => {
                isLoading = false;
                e.target.disabled = false;
                e.target.style.opacity = '1';
            }, 1500);
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
   