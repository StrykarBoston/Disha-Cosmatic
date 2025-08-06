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

     // profile page //

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

