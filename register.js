const accountOptions = document.querySelectorAll('.account-type-option');
const companyField = document.getElementById('companyField');
let accountType = 'candidate';

// Gestione toggle candidate/company
accountOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    accountOptions.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    accountType = opt.getAttribute('data-type');
    companyField.style.display = accountType === 'company' ? 'block' : 'none';
  });
});

// Password validation
const passwordInput = document.getElementById('password');
const requirements = {
  length: document.getElementById('length'),
  uppercase: document.getElementById('uppercase'),
  number: document.getElementById('number'),
  symbol: document.getElementById('symbol')
};

passwordInput.addEventListener('input', () => {
  const value = passwordInput.value;
  requirements.length.classList.toggle('valid', value.length >= 8);
  requirements.uppercase.classList.toggle('valid', /[A-Z]/.test(value));
  requirements.number.classList.toggle('valid', /\d/.test(value));
  requirements.symbol.classList.toggle('valid', /[!@#$%^&*]/.test(value));
});

// Submit form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  const company = accountType === 'company' ? document.getElementById('company').value.trim() : '';

  if (password !== confirmPassword) {
    document.getElementById('confirmError').textContent = "Passwords don't match";
    return;
  } else {
    document.getElementById('confirmError').textContent = "";
  }

  const registerBtn = document.getElementById('registerBtn');
  registerBtn.textContent = "Registering...";
  registerBtn.disabled = true;

  try {
    const res = await fetch('https://talfy-backend-4.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, accountType, company })
    });
    const data = await res.json();

    if (res.ok && data.status === "success") {
      const userId = data.id;
      if (accountType === "candidate") {
        window.location.href = `edit-profile-candidate.html?id=${userId}`;
      } else {
        window.location.href = `edit-profile-company.html?id=${userId}`;
      }
    } else {
      document.getElementById('emailError').textContent = data.message || "Registration failed";
    }
  } catch (err) {
    console.error(err);
    document.getElementById('emailError').textContent = "Error connecting to server";
  }

  registerBtn.textContent = "Create Account";
  registerBtn.disabled = false;
});
