let userProfile = document.querySelector('.userProfile');
let userRole = getUserRole();
function loadUserRole() {
    userProfile.innerHTML = `<span>${userRole}</span>
                <span>👤</span>`
}
loadUserRole();
