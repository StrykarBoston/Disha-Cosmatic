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

// MY ORDER PAGE


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
