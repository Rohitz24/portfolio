// Credentials Setup
const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    checkAuthStatus();

    // Event Handlers
    document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
    document.getElementById("logoutBtn")?.addEventListener("click", handleLogout);
    document.getElementById("profileForm")?.addEventListener("submit", handleSaveProfile);
    document.getElementById("projectForm")?.addEventListener("submit", handleSaveProject);
    document.getElementById("cancelEditBtn")?.addEventListener("click", resetProjectForm);
});

// Theme Logic for Admin Page
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.textContent = savedTheme === 'dark' ? '> [THEME: NIGHT]' : '> [THEME: DAY]';
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeBtn.textContent = newTheme === 'dark' ? '> [THEME: NIGHT]' : '> [THEME: DAY]';
        });
    }
}

// Authentication Check
function checkAuthStatus() {
    const isAuthenticated = sessionStorage.getItem("adminAuth") === "true";
    const loginView = document.getElementById("loginView");
    const dashboardView = document.getElementById("dashboardView");
    const logoutBtn = document.getElementById("logoutBtn");

    if (isAuthenticated) {
        loginView.style.display = "none";
        dashboardView.style.display = "block";
        logoutBtn.style.display = "inline-block";
        populateAdminData();
    } else {
        loginView.style.display = "block";
        dashboardView.style.display = "none";
        logoutBtn.style.display = "none";
    }
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem("adminAuth", "true");
        showToast("[AUTH SUCCESSFUL]: Welcome, Admin.");
        checkAuthStatus();
    } else {
        showToast("[AUTH FAILED]: Invalid Credentials!");
    }
}

function handleLogout() {
    sessionStorage.removeItem("adminAuth");
    showToast("[LOGOUT]: Session terminated.");
    checkAuthStatus();
}

// Load and Populate Dashboard Data
function populateAdminData() {
    const data = JSON.parse(localStorage.getItem("portfolioData"));
    if (!data) return;

    // Populate Profile Fields
    document.getElementById("statusInput").value = data.hero.status;
    document.getElementById("bioInput").value = data.about.bio;
    document.getElementById("skillsInput").value = data.about.skills;

    // Render Admin Projects List
    renderAdminProjectsList(data.projects);
}

function handleSaveProfile(e) {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem("portfolioData"));

    data.hero.status = document.getElementById("statusInput").value;
    data.about.bio = document.getElementById("bioInput").value;
    data.about.skills = document.getElementById("skillsInput").value;

    localStorage.setItem("portfolioData", JSON.stringify(data));
    showToast("[UPDATED]: Profile details saved successfully!");
}

// CRUD Operations: Projects
function renderAdminProjectsList(projects) {
    const listContainer = document.getElementById("adminProjectsList");
    if (!listContainer) return;

    listContainer.innerHTML = projects.map(p => `
        <div class="admin-project-item">
            <div>
                <strong style="color: var(--accent-color);">${p.title}</strong>
                <small style="color: var(--text-dim); display: block;">${p.exe}</small>
            </div>
            <div class="admin-actions">
                <button class="btn-sm" onclick="editProject(${p.id})">Edit</button>
                <button class="btn-sm btn-danger" onclick="deleteProject(${p.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function handleSaveProject(e) {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem("portfolioData"));
    const id = document.getElementById("projectId").value;

    const projectPayload = {
        id: id ? parseInt(id) : Date.now(),
        title: document.getElementById("projTitle").value,
        exe: document.getElementById("projExe").value,
        img: document.getElementById("projImg").value,
        desc: document.getElementById("projDesc").value,
        details: document.getElementById("projDetails").value,
        github: document.getElementById("projGithub").value
    };

    if (id) {
        // Edit existing project
        const index = data.projects.findIndex(p => p.id === parseInt(id));
        if (index !== -1) data.projects[index] = projectPayload;
        showToast("[PROJECT UPDATED]: Saved changes successfully!");
    } else {
        // Create new project
        data.projects.push(projectPayload);
        showToast("[PROJECT ADDED]: Created new project entry!");
    }

    localStorage.setItem("portfolioData", JSON.stringify(data));
    resetProjectForm();
    populateAdminData();
}

function editProject(id) {
    const data = JSON.parse(localStorage.getItem("portfolioData"));
    const project = data.projects.find(p => p.id === id);
    if (!project) return;

    document.getElementById("projectId").value = project.id;
    document.getElementById("projTitle").value = project.title;
    document.getElementById("projExe").value = project.exe;
    document.getElementById("projImg").value = project.img;
    document.getElementById("projDesc").value = project.desc;
    document.getElementById("projDetails").value = project.details;
    document.getElementById("projGithub").value = project.github;

    document.getElementById("projectFormTitle").innerText = "> Edit Project Entry";
    document.getElementById("saveProjBtn").innerText = "> UPDATE PROJECT";
    document.getElementById("cancelEditBtn").style.display = "inline-block";
}

function deleteProject(id) {
    if (!confirm("Are you sure you want to delete this project entry?")) return;

    const data = JSON.parse(localStorage.getItem("portfolioData"));
    data.projects = data.projects.filter(p => p.id !== id);

    localStorage.setItem("portfolioData", JSON.stringify(data));
    showToast("[DELETED]: Project removed successfully.");
    populateAdminData();
}

function resetProjectForm() {
    document.getElementById("projectForm").reset();
    document.getElementById("projectId").value = "";
    document.getElementById("projectFormTitle").innerText = "> Add New Project";
    document.getElementById("saveProjBtn").innerText = "> ADD PROJECT";
    document.getElementById("cancelEditBtn").style.display = "none";
}

// Toast Feedback System
function showToast(message) {
    const toast = document.getElementById("adminToast");
    if (toast) {
        toast.innerText = message;
        toast.style.display = "block";
        setTimeout(() => { toast.style.display = "none"; }, 3000);
    }
}