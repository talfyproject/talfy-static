document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Reset messaggi
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Disabilita bottone
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
            // ✅ Mostra messaggio di successo
            successMessage.style.display = 'block';
            successMessage.textContent = 'Login successful! Redirecting...';

            // ✅ Salva dati in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userType', data.userType);

            // ✅ Redirect alla pagina corretta
            setTimeout(() => {
                if (data.userType === 'candidate') {
                    window.location.href = `/edit-profile-candidate.html?id=${data.userId}`;
                } else {
                    window.location.href = `/edit-profile-company.html?id=${data.userId}`;
                }
            }, 1500);

        } else {
            // Errore login
            errorMessage.style.display = 'block';
            errorMessage.textContent = data.error || 'Invalid email or password';
            loginButton.disabled = false;
            loginButton.textContent = 'Sign In';
        }
    } catch (err) {
        // Errore server
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Server error, please try again later.';
        loginButton.disabled = false;
        loginButton.textContent = 'Sign In';
    }
});
