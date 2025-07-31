
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





    document.addEventListener("DOMContentLoaded", function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const device = navigator.userAgent.toLowerCase();

  // Optional: Add device type as class to body
  const body = document.body;
  let deviceType = "desktop";
  if (width <= 480) {
    deviceType = "mobile";
  } else if (width <= 1024) {
    deviceType = "tablet";
  }
  body.classList.add(deviceType);

  // Wrap content in a scaling-safe container (if needed)
  let wrapper = document.querySelector('.responsive-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'responsive-wrapper';
    while (body.firstChild) {
      wrapper.appendChild(body.firstChild);
    }
    body.appendChild(wrapper);
  }

  // Apply styles safely
  let scale = 1;
  let fontSize = "16px";
  let padding = "0px";

  if (deviceType === "mobile") {
    scale = 0.97;
    fontSize = "15px";
    padding = "6px";
  }

  if (width <= 360 || height <= 580) {
    scale = 0.94;
    fontSize = "14px";
    padding = "8px";
  }

  if (width <= 320 || height <= 520) {
    scale = 0.90;
    fontSize = "13.5px";
    padding = "10px";
  }

  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.transformOrigin = "top center";
  wrapper.style.padding = padding;
  document.documentElement.style.fontSize = fontSize;

  // Login page-specific tweaks
  const loginContainer = document.querySelector('.login-container');
  if (loginContainer) {
    loginContainer.style.marginTop = "24px";
    if (width <= 360 || height <= 580) {
      loginContainer.style.padding = "20px";
    }
    if (width <= 320 || height <= 520) {
      loginContainer.style.padding = "16px";
    }
  }

  // Optional: Device logs
  if (device.includes("iphone")) {
    console.log("iPhone detected");
  } else if (device.includes("android")) {
    console.log("Android detected");
  }

  console.log(`Device type: ${deviceType}, screen: ${width}x${height}`);
});
