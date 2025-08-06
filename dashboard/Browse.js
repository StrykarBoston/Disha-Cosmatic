// Responsive Mobile Menu
    function toggleMenu() {
      const navLinks = document.getElementById('navLinks');
      navLinks.classList.toggle('active');
    }
    // Hide menu on outside click
    document.body.addEventListener('click', function(e) {
      const nav = document.querySelector('.nav');
      if(window.innerWidth<751){
        const navLinks = document.getElementById('navLinks');
        if(!nav.contains(e.target)){navLinks.classList.remove('active');}
      }
    });

    // Scroll-reveal animation
    const animEls = document.querySelectorAll('.animate');
    if('IntersectionObserver'in window){
      const obs = new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },{threshold:.11});
      animEls.forEach(el=>obs.observe(el));
    } else {
      animEls.forEach(el=>el.classList.add('visible'));
    }

// Browse Page //
 function addToCart(button) {
      const productCard = button.closest('.product-card');
      const productId = productCard.getAttribute('data-id');

      // Backend integration point (use fetch to send to API)
      console.log("Adding to cart product ID:", productId);

      // Example backend call
      /*
      fetch('/api/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ productId })
      })
      .then(res => res.json())
      .then(data => console.log("Cart updated", data));
      */

      alert('Product added to cart!');
    }

    // wishlist page //
    // Connect this function to backend APIs as needed
    function removeItem(button) {
      const item = button.closest('.wishlist-item');
      const itemId = item.getAttribute('data-id');
      
      // Call backend delete API
      console.log("Removing item ID:", itemId);

      item.remove(); // Remove from UI
    }

    // Add to Cart click handler (for demo purposes)
    document.querySelectorAll('.btn.add').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.wishlist-item');
        const itemId = item.getAttribute('data-id');
        
        // Send item to backend/cart API
        console.log("Adding to cart item ID:", itemId);
        alert("Added to cart!");
      });
    });


