function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }

    return fetch(url, { ...options, headers });
}

function getUserRole() {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload.role;
}