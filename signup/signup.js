document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    // Add an event listener for form submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        let isValid = true; // Flag to track overall form validity

        // Get form elements
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const termsCheckbox = document.getElementById('terms');

        // Get error message elements
        const fullNameError = document.getElementById('fullNameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const termsError = document.getElementById('termsError');

        // --- Reset all previous error messages ---
        fullNameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        termsError.textContent = '';

        // --- Validation Logic ---

        // Full Name Validation
        if (fullNameInput.value.trim() === '') {
            fullNameError.textContent = 'Full Name is required.';
            isValid = false;
        } else if (fullNameInput.value.trim().length < 3) {
            fullNameError.textContent = 'Full Name must be at least 3 characters.';
            isValid = false;
        }

        // Email Validation
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email Address is required.';
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address (e.g., example@domain.com).';
            isValid = false;
        }

        // Password Validation
        // Basic example: require minimum 8 characters.
        // For production, add requirements for uppercase, lowercase, number, special character.
        if (passwordInput.value.trim() === '') {
            passwordError.textContent = 'Password is required.';
            isValid = false;
        } else if (passwordInput.value.trim().length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters long.';
            isValid = false;
        }

        // Confirm Password Validation
        if (confirmPasswordInput.value.trim() === '') {
            confirmPasswordError.textContent = 'Please confirm your password.';
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            isValid = false;
        }

        // Terms & Conditions Validation
        if (!termsCheckbox.checked) {
            termsError.textContent = 'You must agree to the Terms & Conditions.';
            isValid = false;
        }

        // --- If all front-end validations pass ---
        if (isValid) {
            console.log('Front-end validation passed. Data to be sent to server:');
            console.log({
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                // NEVER send plain password in a real app, it should be hashed on the server.
                // For a real application, you'd send data to your backend API here.
                // Example using fetch API:
                // password: passwordInput.value // This is for demo only. In production, this would be handled securely on the backend.
            });

            alert('Sign Up Successful! (This is a front-end demonstration only. Real data would be sent to a secure backend.)');

            // Simulate an asynchronous submission (e.g., to a server)
            // In a real application, you would make an AJAX/fetch call here:
            /*
            fetch('/api/signup', { // Replace with your actual backend API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    // IMPORTANT: Password hashing must happen on the server!
                    password: passwordInput.value // This is just for demonstration, NEVER send plain password in production.
                }),
            })
            .then(response => {
                if (!response.ok) {
                    // Handle HTTP errors
                    return response.json().then(err => { throw new Error(err.message || 'Server error'); });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Account created successfully! Redirecting...');
                    // window.location.href = '/dashboard'; // Redirect on success
                } else {
                    alert('Sign-up failed: ' + (data.message || 'Unknown error.'));
                }
            })
            .catch(error => {
                console.error('Error during sign-up:', error);
                alert('An error occurred during sign-up. Please try again later.');
            });
            */

            // Optionally clear the form after successful (simulated) submission
            signupForm.reset();
        }
    });

    // Helper function for email validation (basic regex)
    function isValidEmail(email) {
        // This regex provides a reasonable client-side check.
        // Server-side validation is still essential and should be more robust.
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    // Optional: Real-time validation as user types (more advanced UX)
    // You can add 'input' event listeners to each field and call validation functions
    // For simplicity, we are only validating on submit here.
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
