// Default Portfolio Data Seed
const defaultData = {
    hero: {
        status: "[STATUS: AVAILABLE FOR WORK]",
        bioText: "Crafting clean, responsive, and functional web applications."
    },
    about: {
        bio: "I am a Full Stack Developer passionate about building scalable, user-centric web applications with clean and maintainable code. I hold a Master of Computer Applications (MCA) from PIRENS IBMA, Savitribai Phule Pune University, and a Bachelor of Computer Applications (BCA) from Kamla Nehru Mahavidyalaya Nagpur University (RTMNU).",
        skills: "Java, React.js, JavaScript (ES6+), HTML5/CSS3, Tailwind CSS, Redux, REST APIs, Git/GitHub"
    },
    projects: [
        {
            id: 1,
            title: "Calculator App",
            exe: "calc_app.exe",
            img: "calc.png",
            desc: "A functional arithmetic tool built with vanilla JavaScript. Features clean inputs and key binding operations.",
            details: "A functional arithmetic tool built with vanilla JavaScript handling core mathematical operations with dynamic updates.",
            github: "https://github.com/Rohitz24/calculator-app"
        },
        {
            id: 2,
            title: "To-do List App",
            exe: "todo_app.exe",
            img: "todo.png",
            desc: "A productivity application designed to manage daily tasks efficiently with interactive progress tracking.",
            details: "A productivity application designed to manage daily tasks efficiently with dynamic list updates and status counters.",
            github: "https://github.com/Rohitz24/to-do-list-app"
        },
        {
            id: 3,
            title: "Weather App",
            exe: "weather_app.exe",
            img: "weather.png",
            desc: "Real-time weather tracking application fetching live global metrics and 5-day forecasts via OpenWeather API.",
            details: "Real-time weather tracking application fetching live global data, humidity, wind speeds, and extended forecasts.",
            github: "https://github.com/Rohitz24/weatherapp"
        }
    ]
};

// Initialize LocalStorage Data if not present
function initializeData() {
    if (!localStorage.getItem('portfolioData')) {
        localStorage.setItem('portfolioData', JSON.stringify(defaultData));
    }
}

// 1. Theme Switcher Engine
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeBtnText(savedTheme);

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeBtnText(newTheme);
        });
    }
}

function updateThemeBtnText(theme) {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.textContent = theme === 'dark' ? '> [THEME: NIGHT]' : '> [THEME: DAY]';
    }
}

// 2. Render Dynamic Content
function renderPortfolio() {
    const data = JSON.parse(localStorage.getItem('portfolioData')) || defaultData;

    // Render Hero Section
    const heroStatus = document.getElementById('heroStatus');
    const heroBioText = document.getElementById('heroBioText');
    if (heroStatus) heroStatus.textContent = data.hero.status;
    if (heroBioText) heroBioText.textContent = data.hero.bioText;

    // Render Bio Section
    const aboutContent = document.getElementById('aboutContent');
    if (aboutContent) {
        aboutContent.innerHTML = `
            <p>${data.about.bio}</p>
            <br>
            <p><strong class="highlight">Skills:</strong> ${data.about.skills}</p>
            <p><strong class="highlight">Hobbies:</strong> Photography, Gaming, and Chess.</p>
        `;
    }

    // Render Projects Grid
    const projectsContainer = document.getElementById('projectsContainer');
    if (projectsContainer) {
        projectsContainer.innerHTML = data.projects.map(p => `
            <div class="project-card">
                <div class="terminal-header">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                    <span class="terminal-title">${p.exe}</span>
                </div>
                <div class="project-img-container">
                    <img src="${p.img}" alt="${p.title}" onerror="this.src='calc.png'">
                </div>
                <div class="project-info">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    <div class="project-links">
                        <button class="btn-sm" onclick="openModal('${escapeHtml(p.title)}', '${escapeHtml(p.details)}')">&gt; Details</button>
                        <a href="${p.github}" target="_blank" class="btn-sm github-btn">&gt; GitHub</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function escapeHtml(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// 3. Mobile Hamburger Menu Toggle
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// 4. Typewriter Effect
const roles = ["FullStack/Frontend Developer", "React Specialist", "UI/UX Craftsman"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const typewriterElement = document.getElementById("typewriter");
    if (!typewriterElement) return;

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

// 5. Modal Functionality
function openModal(title, desc) {
    const modal = document.getElementById("projectModal");
    if (modal) {
        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalDesc").innerText = desc;
        modal.style.display = "block";
    }
}

function closeModal() {
    const modal = document.getElementById("projectModal");
    if (modal) modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("projectModal");
    if (event.target === modal) closeModal();
};

// Initializer
document.addEventListener("DOMContentLoaded", () => {
    initializeData();
    initTheme();
    initMobileMenu();
    renderPortfolio();
    typeEffect();
});