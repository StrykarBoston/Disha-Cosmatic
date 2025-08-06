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