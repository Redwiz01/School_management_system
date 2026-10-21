let userProfile = document.querySelector('.userProfile');
let logoutBtn = document.getElementById('logoutBtn');
let userRole = getUserRole();
const panelLinks = document.querySelectorAll('nav a');

function loadUserRole() {
    userProfile.innerHTML = `<span>${userRole}</span>
                <span>👤</span>`
}
loadUserRole();

panelLinks.forEach(link => {
    const allowedRoles = link.dataset.roles.split(',');
    const cleanedRoles = allowedRoles.map(role => {
        return role.trim();
    })

    if (!cleanedRoles.includes(userRole)) {
        link.style.display = "none";
        return;
    }
})

async function initializeDashboard() {
    const userRole = getUserRole();

    // Pages accessible to everyone
    await initializeStudentsPage();

    if (userRole === 'admin' || userRole === 'teacher') {
        await initializeTeachersPage();
        await initializeClassesPage();
        await initializeExamsPage();
        await initializeResultsPage();
        await initializeAttendancePage();
    }

    if (userRole === 'admin' || userRole === 'finance') {
        await initializePaymentsPage();
    }
}

async function requireLogin() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.replace('login.html');
        return;
    }

    await initializeDashboard();
}
requireLogin();

logoutBtn.addEventListener('click', () => {
    let confirmed = confirm("You are logging out");
    if (!confirmed) {
        return;
    }
    localStorage.removeItem('token');
    window.location.replace("login.html");
})

