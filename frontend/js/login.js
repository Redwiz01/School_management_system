let emailInput = document.getElementById('email');
let passInput = document.getElementById('password');
let loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    loginData = { email: emailInput.value, password: passInput.value };
    const res = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
    })
    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        localStorage.setItem('token', data.token);
        window.location.href = "dashboard.html";
    }
    else {
        alert(data.error);
    }
    loginForm.reset();
})