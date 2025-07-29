// Horizontal product slider for Worldwide Fashion Collection
let collectionIndex = 0;
const slideWidth = 284; // item width + margin
function slideCollection(direction) {
  const track = document.querySelector('.collections-track');
  const items = document.querySelectorAll('.collections-track .collection-item');
  if (!track || items.length === 0) return;
  collectionIndex += direction;
  if (collectionIndex < 0) collectionIndex = 0;
  if (collectionIndex > items.length - 1) collectionIndex = items.length - 1;
  track.style.transform = `translateX(${-collectionIndex * slideWidth}px)`;
}
// Responsive adjustment
window.addEventListener('resize', () => {
  slideCollection(0);
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
