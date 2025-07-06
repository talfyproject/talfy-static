document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");  // Se non hai id="registerForm"
  const message = document.getElementById("registerMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (message) message.textContent = "";

    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;
    const userType = document.querySelector('input[name="role"]:checked')?.value;

    if (password !== confirmPassword) {
      if (message) message.textContent = "Passwords do not match.";
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      if (message) message.textContent = "Password must contain 1 uppercase, 1 number, and 1 symbol.";
      return;
    }

    const response = await fetch("/register", {
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
      window.location.href =
        userType === "candidate" ? "/complete-profile-candidate" : "/complete-profile-company";
    } else {
      if (message) message.textContent = data.error || "Registration failed. Please try again.";
    }
  });
});
