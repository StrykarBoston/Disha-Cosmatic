const statsData = [
      { label: 'Total Orders', value: '24 🛒' },
      { label: 'Wellness Points', value: '1,250 ⭐' },
      { label: 'Saved Amount', value: '$89 💰' },
      { label: 'Active Subscriptions', value: '3 🔄' }
    ];
    const ordersData = [
      { name: 'Turmeric Capsules', orderId: '#12345', status: 'Delivered' },
      { name: 'Ashwagandha Extract', orderId: '#12344', status: 'Shipping' }
    ];
    const recommendationsData = [
      { name: 'Green Tea Extract', desc: 'Antioxidant boost', price: '$24.99' },
      { name: 'Lavender Sleep Aid', desc: 'Better sleep quality', price: '$19.99' }
    ];

    const statsEl = document.getElementById('stats');
    statsData.forEach(s => {
      const box = document.createElement('div');
      box.className = 'stat';
      box.innerHTML = `<div>${s.label}</div><h3>${s.value}</h3>`;
      statsEl.appendChild(box);
    });

    const ordersEl = document.getElementById('orders');
    ordersData.forEach(o => {
      const div = document.createElement('div');
      div.className = 'order';
      div.innerHTML = `
        <div><strong>${o.name}</strong><br><small>Order ${o.orderId}</small></div>
        <div class="status ${o.status.toLowerCase()}">${o.status}</div>`;
      ordersEl.appendChild(div);
    });

    const recsEl = document.getElementById('recommendations');
    recommendationsData.forEach(r => {
      const div = document.createElement('div');
      div.className = 'recommendation';
      div.innerHTML = `
        <div><strong>${r.name}</strong><br><small>${r.desc}</small><br><strong>${r.price}</strong></div>
        <button>Add to Cart</button>`;
      div.querySelector('button').addEventListener('click', () => {
        alert(`${r.name} added to your cart!`);
      });
      recsEl.appendChild(div);
    });

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


    /*MY ORDER PAGE*/
  function filterOrders(status) {
  const allCards = document.querySelectorAll(".order-card");
  const allTabs = document.querySelectorAll(".tab");

  allTabs.forEach(tab => tab.classList.remove("active"));
  event.target.classList.add("active");

  allCards.forEach(card => {
    if (status === 'all') {
      card.style.display = 'flex';
    } else if (status === 'delivered') {
      card.style.display = card.classList.contains('delivered') ? 'flex' : 'none';
    } else if (status === 'pending') {
      card.style.display = card.classList.contains('pending') ? 'flex' : 'none';
    }
  });
}
// Add event listeners to filter buttons
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', filterOrders);
});

// Initial load - show all orders
document.addEventListener('DOMContentLoaded', () => {
  filterOrders('all');
});
// End of MY ORDER PAGE

// Responsive adjustments
window.addEventListener('resize', () => {
  const navLinks = document.getElementById('navLinks');
  if(window.innerWidth > 750) {
    navLinks.classList.remove('active');
  }
});
// End of responsive adjustments 

/*Browse Page */
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

    /*wishlist page*/
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


  /* profile page */

  // Serialize form data (handles checkboxes)
  function serializeForm(form) {
    const data = new FormData(form);
    const obj = {};
    for (const [key, value] of data.entries()) {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          obj[key].push(value);
        } else {
          obj[key] = [obj[key], value];
        }
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }

  // For demo purposes: fake post handler to simulate backend response
  function fakePost(url, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Success! Data submitted to ' + url });
      }, 1000);
    });
  }

  const profileForm = document.getElementById('profileForm');
  const profileResponse = document.getElementById('profileResponse');

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    profileResponse.textContent = 'Submitting...';
    profileResponse.className = 'response-message';

    const formData = serializeForm(profileForm);

    try {
      // Replace fakePost with real fetch POST when backend available
      const result = await fakePost('/update-profile', formData);
      profileResponse.textContent = result.message;
      profileResponse.className = 'response-message success';
    } catch {
      profileResponse.textContent = 'Error updating profile.';
      profileResponse.className = 'response-message error';
    }
  });

  const preferencesForm = document.getElementById('preferencesForm');
  const preferencesResponse = document.getElementById('preferencesResponse');

  preferencesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    preferencesResponse.textContent = 'Submitting...';
    preferencesResponse.className = 'response-message';

    const formData = serializeForm(preferencesForm);

    try {
      // Replace fakePost with real fetch POST when backend available
      const result = await fakePost('/save-preferences', formData);
      preferencesResponse.textContent = result.message;
      preferencesResponse.className = 'response-message success';
    } catch {
      preferencesResponse.textContent = 'Error saving preferences.';
      preferencesResponse.className = 'response-message error';
    }
  });
/* End of profile page */

/* Rewards page */
document.addEventListener("DOMContentLoaded", () => {
  let currentPoints = 1250;
  const progressBar = document.querySelector(".progress");
  const progressText = document.querySelector(".progress-text");
  const redeemButtons = document.querySelectorAll(".redeem-btn");

  // Animate the initial progress bar
  updateProgressBar(currentPoints);

  redeemButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const rewardText = e.target.parentElement.querySelector("p").textContent;
      let cost = 0;

      // Determine cost based on reward type
      if (rewardText.includes("15%")) cost = 500;
      else if (rewardText.includes("Shipping")) cost = 300;

      // Check if user has enough points
      if (currentPoints >= cost) {
        currentPoints -= cost;
        updateProgressBar(currentPoints);
        alert(`Success! You redeemed "${rewardText}" for ${cost} points.`);
      } else {
        alert("Not enough points to redeem this reward.");
      }
    });
  });

  function updateProgressBar(points) {
    const percentage = (points / 2000) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${points} / 2,000`;
  }
});
/* End of Rewards page */