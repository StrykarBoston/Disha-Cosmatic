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

