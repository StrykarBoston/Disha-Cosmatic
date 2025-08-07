document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');
    const productListBody = document.getElementById('product-list-body');
    const customerListBody = document.getElementById('customer-list-body');
    const orderListBody = document.getElementById('order-list-body');
    const totalOrdersCountElement = document.getElementById('total-orders-count');
    const newCustomersCount = document.getElementById('new-customers-count');
    
    const SAMPLE_USERS = [
        { id: 1, name: 'Alice Smith', email: 'alice.s@example.com' },
        { id: 2, name: 'Bob Johnson', email: 'bob.j@example.com' },
        { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com' }
    ];

    const SAMPLE_PRODUCTS = [
        { name: 'Facial Cleanser', category: 'Skincare', price: 500, stock_quantity: 25 },
        { name: 'Moisturizer', category: 'Skincare', price: 850, stock_quantity: 8 },
        { name: 'Sunscreen', category: 'Skincare', price: 600, stock_quantity: 0 },
        { name: 'Lip Balm', category: 'Lip Care', price: 150, stock_quantity: 45 }
    ];
    
    const SAMPLE_CARTS = {
        1: [
            { product_name: 'Facial Cleanser', quantity: 1 },
            { product_name: 'Moisturizer', quantity: 1 }
        ],
        2: [
            { product_name: 'Lip Balm', quantity: 2 }
        ],
        3: []
    };
    
    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        const selectedSection = document.querySelector(sectionId);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }
    }

    function loadDashboardStats() {
        if (newCustomersCount) {
            newCustomersCount.textContent = SAMPLE_USERS.length;
        }
        
        let totalOrders = 0;
        for (const userId in SAMPLE_CARTS) {
            if (SAMPLE_CARTS[userId].length > 0) {
                totalOrders++;
            }
        }
        if (totalOrdersCountElement) {
            totalOrdersCountElement.textContent = totalOrders;
        }
    }

    function loadProducts() {
        if (productListBody.childElementCount === 0) {
            SAMPLE_PRODUCTS.forEach(product => {
                const row = document.createElement('tr');
                let statusClass = '';
                let statusText = '';
                if (product.stock_quantity > 10) {
                    statusClass = 'status-in-stock';
                    statusText = 'In Stock';
                } else if (product.stock_quantity > 0) {
                    statusClass = 'status-low-stock';
                    statusText = 'Low Stock';
                } else {
                    statusClass = 'status-out-of-stock';
                    statusText = 'Out of Stock';
                }
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.category || 'Uncategorized'}</td>
                    <td>₹${product.price.toFixed(2)}</td>
                    <td>${product.stock_quantity}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                `;
                productListBody.appendChild(row);
            });
        }
    }
    
    function loadCustomers() {
        if (customerListBody.childElementCount === 0) {
            SAMPLE_USERS.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                `;
                customerListBody.appendChild(row);
            });
        }
    }

    function loadOrders() {
        if (orderListBody.childElementCount === 0) {
            let orderId = 1;
            for (const userId in SAMPLE_CARTS) {
                const cartItems = SAMPLE_CARTS[userId];
                if (cartItems.length > 0) {
                    const user = SAMPLE_USERS.find(u => u.id == userId);
                    let totalItems = 0;
                    let totalPrice = 0;
                    cartItems.forEach(item => {
                        const product = SAMPLE_PRODUCTS.find(p => p.name === item.product_name);
                        totalItems += item.quantity;
                        if (product) {
                            totalPrice += item.quantity * product.price;
                        }
                    });

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${orderId++}</td>
                        <td>${user ? user.name : 'Unknown User'}</td>
                        <td>${totalItems}</td>
                        <td>₹${totalPrice.toFixed(2)}</td>
                        <td><span class="status-badge status-low-stock">Pending</span></td>
                    `;
                    orderListBody.appendChild(row);
                }
            }
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Clear previous sections to avoid duplication on subsequent clicks
            productListBody.innerHTML = '';
            customerListBody.innerHTML = '';
            orderListBody.innerHTML = ''; // Clear orders as well

            navItems.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            const sectionId = this.getAttribute('href');
            showSection(sectionId);

            if (sectionId === '#products') {
                loadProducts();
            } else if (sectionId === '#orders') {
                loadOrders();
            } else if (sectionId === '#customers') {
                loadCustomers();
            } else if (sectionId === '#overview') {
                loadDashboardStats();
            }
        });
    });

    showSection('#overview');
    loadDashboardStats();
});
    }

    function loadDashboardStats() {
        if (newCustomersCount) {
            newCustomersCount.textContent = SAMPLE_USERS.length;
        }
        
        let totalItems = 0;
        for (const userId in SAMPLE_CARTS) {
            totalItems += SAMPLE_CARTS[userId].reduce((sum, item) => sum + item.quantity, 0);
        }
        if (totalOrdersCountElement) {
            totalOrdersCountElement.textContent = totalItems;
        }
    }

    function loadProducts() {
        if (productListBody.childElementCount === 0) {
            SAMPLE_PRODUCTS.forEach(product => {
                const row = document.createElement('tr');
                let statusClass = '';
                let statusText = '';
                if (product.stock_quantity > 10) {
                    statusClass = 'status-in-stock';
                    statusText = 'In Stock';
                } else if (product.stock_quantity > 0) {
                    statusClass = 'status-low-stock';
                    statusText = 'Low Stock';
                } else {
                    statusClass = 'status-out-of-stock';
                    statusText = 'Out of Stock';
                }
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.category || 'Uncategorized'}</td>
                    <td>₹${product.price.toFixed(2)}</td>
                    <td>${product.stock_quantity}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                `;
                productListBody.appendChild(row);
            });
        }
    }
    
    function loadCustomers() {
        if (customerListBody.childElementCount === 0) {
            SAMPLE_USERS.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                `;
                customerListBody.appendChild(row);
            });
        }
    }

    function loadCarts() {
        if (cartsContainer.childElementCount === 0) {
            SAMPLE_USERS.forEach(user => {
                const cartItems = SAMPLE_CARTS[user.id] || [];
                if (cartItems.length > 0) {
                    const cartCard = document.createElement('div');
                    cartCard.className = 'dashboard-section';
                    cartCard.innerHTML = `
                        <h3 class="cart-header">Cart for User: ${user.name} (ID: ${user.id})</h3>
                        <ul class="cart-item-list"></ul>
                    `;
                    const cartList = cartCard.querySelector('.cart-item-list');
                    cartItems.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${item.product_name} - Quantity: ${item.quantity}`;
                        cartList.appendChild(listItem);
                    });
                    cartsContainer.appendChild(cartCard);
                }
            });
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Clear previous sections to avoid duplication on subsequent clicks
            productListBody.innerHTML = '';
            customerListBody.innerHTML = '';
            cartsContainer.innerHTML = '';

            navItems.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            const sectionId = this.getAttribute('href');
            showSection(sectionId);

            if (sectionId === '#products') {
                loadProducts();
            } else if (sectionId === '#orders') {
                loadCarts();
            } else if (sectionId === '#customers') {
                loadCustomers();
            } else if (sectionId === '#overview') {
                loadDashboardStats();
            }
        });
    });

    showSection('#overview');
    loadDashboardStats();
});