// cartscript.js
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalSpan = document.getElementById('cartTotal');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // These functions (loadCart, saveCart, updateCartCountDisplay) are now globally
    // available because shopscript.js (which loads before cartscript.js in cart.html)
    // has defined them on the window object.

    // Function to render cart items on the page
    function renderCartItems() {
        let cart = window.loadCart(); // Call global loadCart
        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true;
            cartTotalSpan.textContent = '₹0.00';
            window.updateCartCountDisplay(); // Ensure header count is updated
            return;
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false;
        }

        let total = 0;

        cart.forEach(item => {
            // Ensure price is a number for calculations
            const itemPrice = parseFloat(item.price); // Parse price from string to number
            const itemTotal = itemPrice * item.quantity;
            total += itemTotal;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.dataset.productId = item.id; // Store product ID

            cartItemDiv.innerHTML = `
                <img src="${item.image_url || 'https://via.placeholder.com/80?text=No+Image'}"
                     alt="${item.name}" class="cart-item-image"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/80?text=No+Image';">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                        <span class="item-quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
                <span class="cart-item-price">₹${itemTotal.toFixed(2)}</span>
                <button class="remove-item-btn" data-id="${item.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });

        cartTotalSpan.textContent = `₹${total.toFixed(2)}`;

        // Add event listeners for quantity buttons and remove button
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (e) => updateQuantity(parseInt(e.target.dataset.id), -1));
        });
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (e) => updateQuantity(parseInt(e.target.dataset.id), 1));
        });
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => removeItem(parseInt(e.target.dataset.id)));
        });

        window.updateCartCountDisplay(); // Update header count after rendering cart items
    }

    // Function to update item quantity in cart
    function updateQuantity(productId, change) {
        let cart = window.loadCart(); // Call global loadCart
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                // If quantity drops to 0 or less, remove the item
                removeItem(productId);
            } else {
                window.saveCart(cart); // Call global saveCart
                renderCartItems(); // Re-render to update display
            }
        }
    }

    // Function to remove item from cart
    function removeItem(productId) {
        let cart = window.loadCart(); // Call global loadCart
        cart = cart.filter(item => item.id !== productId);
        window.saveCart(cart); // Call global saveCart
        renderCartItems(); // Re-render to update display
    }

    // Checkout button placeholder
    checkoutBtn.addEventListener('click', () => {
        alert('Proceeding to checkout! (Functionality not yet implemented)');
        // Here you would typically redirect to a checkout page or process the order
    });

    // Initial render of cart items when the page loads
    renderCartItems();
});