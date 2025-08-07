document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const navLinks = document.querySelectorAll('.dashboard-nav .nav-item');
    const sections = document.querySelectorAll('.main-content .dashboard-section');
    const productListBody = document.getElementById('product-list-body');

    // --- FUNCTIONS ---

    /**
     * Fetches product data from the backend API and populates the table.
     */
    async function loadProducts() {
        // Show a loading message while fetching data
        productListBody.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

        try {
            // Fetch data from your Flask backend (ensure your Python server is running!)
            const response = await fetch('http://127.0.0.1:5000/api/products');
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            
            const products = await response.json();

            // Clear the loading message
            productListBody.innerHTML = '';

            // If no products are returned, show a message
            if (products.length === 0) {
                productListBody.innerHTML = `<tr><td colspan="5">No products found in the database.</td></tr>`;
                return;
            }

            // Loop through each product and create a new table row
            products.forEach(product => {
                const row = document.createElement('tr');

                // Determine the status based on stock quantity
                const statusText = product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock';
                const statusClass = product.stock_quantity > 0 ? 'status-active' : 'status-inactive';

                // Populate the row with product data
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.category || 'N/A'}</td>
                    <td>₹${product.price.toFixed(2)}</td>
                    <td>${product.stock_quantity}</td>
                    <td><span class="status-indicator ${statusClass}">${statusText}</span></td>
                `;

                // Add the new row to the table body
                productListBody.appendChild(row);
            });

        } catch (error) {
            console.error('Failed to fetch products:', error);
            // Show an error message in the table
            productListBody.innerHTML = `<tr><td colspan="5">Failed to load products. Please check the console for errors.</td></tr>`;
        }
    }


    // --- EVENT LISTENERS ---

    // Add a 'click' event listener to every navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior

            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });

            // Show the target section
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            // Update the 'active' class on navigation links
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            // **NEW**: If the "Products" link was clicked, load the products
            if (targetId === 'products') {
                loadProducts();
            }
        });
    });
});