// DISHA-COSMATIC/contact.js
document.addEventListener('DOMContentLoaded', function() {
    // Responsive Mobile Menu (existing code)
    function toggleMenu() {
        const navLinks = document.getElementById('navLinks');
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
    }
    // Make toggleMenu globally accessible from HTML
    window.toggleMenu = toggleMenu; 

    // Hide menu on outside click (existing code)
    document.body.addEventListener('click', function(e) {
        const nav = document.querySelector('.nav');
        if (window.innerWidth < 751) {
            const navLinks = document.getElementById('navLinks');
            if (navLinks && nav && !nav.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        }
    });

    // Scroll-reveal animation (existing code)
    const animEls = document.querySelectorAll('.animate');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: .11 });
        animEls.forEach(el => obs.observe(el));
    } else {
        animEls.forEach(el => el.classList.add('visible'));
    }

    // NEW: Form Submission Logic
    const contactForm = document.getElementById('contactForm');
    const formStatusMessage = document.getElementById('formStatusMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            // Clear previous messages
            formStatusMessage.style.display = 'none';
            formStatusMessage.textContent = '';
            formStatusMessage.className = 'status-message'; // Reset classes

            const formData = new FormData(contactForm);
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            // You can uncomment and use reCAPTCHA later if needed
            // const recaptchaResponse = grecaptcha.getResponse();
            // if (!recaptchaResponse) {
            //     displayMessage('Please complete the reCAPTCHA.', 'error');
            //     return;
            // }
            // jsonData['g-recaptcha-response'] = recaptchaResponse; // Add reCAPTCHA response to data

            displayMessage('Sending message...', 'info');

            try {
                const response = await fetch('http://127.0.0.1:5000/api/contact_submissions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    displayMessage(result.message || 'Message sent successfully!', 'success');
                    contactForm.reset(); // Clear form fields on success
                    // If you uncomment reCAPTCHA, also uncomment: grecaptcha.reset();
                } else {
                    displayMessage(result.message || 'Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                displayMessage('Network error. Could not connect to the server.', 'error');
            }
        });
    }

    // Helper function to display messages
    function displayMessage(message, type) {
        formStatusMessage.textContent = message;
        formStatusMessage.style.display = 'block';
        formStatusMessage.classList.add(type); // 'success', 'error', 'info'

        // Hide message after a few seconds
        setTimeout(() => {
            formStatusMessage.style.display = 'none';
            formStatusMessage.textContent = '';
            formStatusMessage.className = 'status-message'; // Reset classes
        }, 5000);
    }
});