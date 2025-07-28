document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');

    loginError.textContent = "";
    loginBtn.textContent = "Signing in...";
    loginBtn.disabled = true;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.status === "success") {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('accountType', data.accountType);

            if (data.accountType === "candidate") {
                window.location.href = `/candidate.html?id=${data.userId}`;
            } else {
                window.location.href = `/company.html?id=${data.userId}`;
            }
        } else {
            loginError.textContent = data.message || "Invalid email or password";
        }
    } catch (err) {
        loginError.textContent = "Error connecting to server";
    }

    loginBtn.textContent = "Sign In";
    loginBtn.disabled = false;
});
