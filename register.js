document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) {
    console.error('Error: #registerForm not found in DOM.');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userType = document.querySelector('input[name="userType"]:checked');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const terms = document.getElementById('terms').checked;
    const registerButton = document.getElementById('registerButton');
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');

    // Nascondi messaggi precedenti
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // Validazioni lato client
    if (!userType) return showMessage('Please select whether you are a candidate or company');
    if (!email || !password || !confirmPassword) return showMessage('Please fill in all fields');
    if (!email.includes('@')) return showMessage('Please enter a valid email address');
    if (!isPasswordValid()) return showMessage('Password must meet all requirements');
    if (password !== confirmPassword) return showMessage('Passwords do not match');
    if (!terms) return showMessage('Please accept the Terms of Service and Privacy Policy');

    // Disabilita bottone durante la richiesta
    registerButton.disabled = true;
    registerButton.textContent = 'Creating Account...';

    try {
      const response = await fetch('https://talfy-backend-4.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, user_type: userType.value })
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        console.error('JSON parse error:', err);
      }

      if (response.ok && data.success) {
        successMsg.style.display = 'block';
        successMsg.textContent = 'Account created successfully! Redirecting...';

        if (data.userId) localStorage.setItem('userId', data.userId);
        if (data.userType) localStorage.setItem('userType', data.userType);

        setTimeout(() => {
          if (data.userType === 'candidate') {
            window.location.href = '/complete-profile-candidate.html';
          } else {
            window.location.href = '/complete-profile-company.html';
          }
        }, 1500);
      } else {
        showMessage(data.error || 'Registration failed');
        registerButton.disabled = false;
        registerButton.textContent = 'Create Account';
      }
    } catch (error) {
      console.error('Error during registration:', error);
      showMessage('Cannot connect to server. Please try again later.');
      registerButton.disabled = false;
      registerButton.textContent = 'Create Account';
    }

    function showMessage(message) {
      errorMsg.style.display = 'block';
      errorMsg.textContent = message;
    }
  });
});

function isPasswordValid() {
  const password = document.getElementById('password').value.trim();
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}
