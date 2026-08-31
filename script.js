/* ==========================================================================
   1. NAVIGATION BAR SCROLL EFFECT
   ========================================================================== */
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY > 40) {
        navbar.classList.add('transparent');
    } else {
        navbar.classList.remove('transparent');
    }
});

/* ==========================================================================
   2. REQUIREMENT BADGE SELECTOR (CONTACT PAGE)
   ========================================================================== */
function selectRequirement(type, element) {
    const reqInput = document.getElementById('reqType');
    if (reqInput) {
        reqInput.value = type;
    }

    const options = document.querySelectorAll('.badge-option');
    options.forEach(opt => opt.classList.remove('selected'));

    if (element) {
        element.classList.add('selected');
    }
}

/* ==========================================================================
   3. CONTACT FORM & POPUP API HANDLERS (LIVE RENDER BACKEND)
   ========================================================================== */
const BACKEND_URL = 'https://gowdaestate.onrender.com';

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('estateContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : '';
            if (submitBtn) {
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;
            }

            const payload = {
                name: document.getElementById('clientName').value,
                phone: document.getElementById('clientPhone').value,
                email: document.getElementById('clientEmail').value,
                requirementType: document.getElementById('reqType') ? document.getElementById('reqType').value : 'buy',
                message: document.getElementById('clientMessage').value
            };

            try {
                const response = await fetch(`${BACKEND_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (data.success) {
                    alert('Thank you. Your consultation request has been emailed to our private desk executive.');
                    contactForm.reset();
                } else {
                    alert('Submission error: ' + data.message);
                }
            } catch (err) {
                console.error(err);
                alert('Could not connect to the backend server. If Render was asleep, please wait 30 seconds and try once more.');
            } finally {
                if (submitBtn) {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // Lead Popup Form Handler
    const popupForm = document.getElementById('popupForm');
    if (popupForm) {
        popupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const payload = {
                name: document.getElementById('popName').value,
                phone: document.getElementById('popPhone').value,
                email: document.getElementById('popEmail').value
            };

            try {
                const response = await fetch(`${BACKEND_URL}/api/lead-capture`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (data.success) {
                    alert('Thank you! Your exclusive access has been confirmed.');
                    popupForm.reset();
                    closePopup();
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (err) {
                console.error(err);
                alert('Server connection error.');
            }
        });
    }
});

/* ==========================================================================
   4. MODAL POPUP CONTROLS (INDEX PAGE)
   ========================================================================== */
function openPopup() {
    const modal = document.getElementById('popupModal');
    if (modal) {
        modal.classList.add('show-modal');
    }
}

function closePopup() {
    const modal = document.getElementById('popupModal');
    if (modal) {
        modal.classList.remove('show-modal');
    }
}
