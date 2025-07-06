document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("registerMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const userType = document.querySelector('input[name="user_type"]:checked')?.value;

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      message.textContent = "Password must contain 1 uppercase, 1 number, and 1 symbol.";
      return;
    }

    const response = await fetch("https://talfy-backend.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        user_type: userType,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = userType === "candidate" ? "/complete-profile-candidate.html" : "/complete-profile-company.html";
    } else {
      message.textContent = data.error || "Registration failed. Please try again.";
    }
  });
});
