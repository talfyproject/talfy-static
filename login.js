document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    loginButton.disabled = true;
    loginButton.textContent = 'Signing in...';

    try {
        const response = await fetch('https://talfy-backend-4.onrender.com/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            successMessage.style.display = 'block';
            successMessage.textContent = 'Login successful! Redirecting...';

            // ✅ Salva token e info utente
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userType', data.userType);

           setTimeout(() => {
    if (data.userType === 'candidate') {
        window.location.href = `/candidate.html?id=${data.userId}`;
    } else {
        window.location.href = `/company.html?id=${data.userId}`;
    }
}, 1500);
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.error || 'Invalid email or password';
            loginButton.disabled = false;
            loginButton.textContent = 'Sign In';
        }
    } catch (err) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Server error, please try again later.';
        loginButton.disabled = false;
        loginButton.textContent = 'Sign In';
    }
});

