// 1. Retro Typewriter Effect
const roles = ["FullStack/Frontend Developer", "React Specialist", "UI/UX Craftsman"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
    if (typewriterElement) typeEffect();
});

// 2. Form Validation & Async AJAX Formspree Submission
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent full page reload

        if (validateForm()) {
            const formData = new FormData(form);
            
            // Show loading state
            submitBtn.textContent = "> TRANSMITTING...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert("[SYSTEM]: Message transmitted successfully!");
                    form.reset();
                    clearErrors();
                } else {
                    alert("[SYSTEM ERROR]: Failed to send message. Please try again.");
                }
            } catch (error) {
                alert("[SYSTEM ERROR]: Network error occurred.");
            } finally {
                submitBtn.textContent = "> TRANSMIT MESSAGE";
                submitBtn.disabled = false;
            }
        }
    });
}

function validateForm() {
    let isValid = true;

    if (nameInput.value.trim() === '') {
        setError(nameInput);
        isValid = false;
    } else {
        setSuccess(nameInput);
    }

    if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
        setError(emailInput);
        isValid = false;
    } else {
        setSuccess(emailInput);
    }

    if (subjectInput.value.trim() === '') {
        setError(subjectInput);
        isValid = false;
    } else {
        setSuccess(subjectInput);
    }

    if (messageInput.value.trim() === '') {
        setError(messageInput);
        isValid = false;
    } else {
        setSuccess(messageInput);
    }

    return isValid;
}

function setError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
}

function setSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
}

function clearErrors() {
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 3. Dynamic Interaction: Modal
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");

function openModal(title, desc) {
    modal.style.display = "block";
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 4. Navigation Active Link Highlighter
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll("nav ul li a");

window.onscroll = () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute("id");
        }
    });

    navLi.forEach((li) => {
        li.classList.remove("active");
        if (li.getAttribute('href') === '#' + current) {
            li.classList.add('active');
        }
    });
};