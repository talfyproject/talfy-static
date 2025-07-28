async function handleRegister(event) {
  event.preventDefault();

  const userType = document.querySelector('input[name="userType"]:checked');
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  const terms = document.getElementById('terms').checked;
  const registerButton = document.getElementById('registerButton');

  if (!userType) return showMessage('Please select whether you are a candidate or company');
  if (!email || !password || !confirmPassword) return showMessage('Please fill in all fields');
  if (!email.includes('@')) return showMessage('Please enter a valid email address');
  if (!isPasswordValid()) return showMessage('Password must meet all requirements');
  if (password !== confirmPassword) return showMessage('Passwords do not match');
  if (!terms) return showMessage('Please accept the Terms of Service and Privacy Policy');

  registerButton.disabled = true;
  registerButton.textContent = 'Creating Account...';

  try {
    const response = await fetch('https://talfy-backend-4.onrender.com/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, userType: userType.value })
});

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage('Account created successfully! Redirecting...', 'success');
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
    showMessage('Server error, please try again later.');
    registerButton.disabled = false;
    registerButton.textContent = 'Create Account';
  }
}

function showMessage(message, type = 'error') {
  const errorMsg = document.getElementById('errorMessage');
  const successMsg = document.getElementById('successMessage');

  if (type === 'error') {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
  } else {
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';
  }

  setTimeout(() => {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
  }, 5000);
}

function isPasswordValid() {
  const password = document.getElementById('password').value.trim();
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}

document.querySelector('.login-form').addEventListener('submit', handleRegister);
