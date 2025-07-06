document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("registerMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const userType = document.querySelector('input[name="user_type"]:checked')?.value;

    // Validazione password base
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      message.textContent = "Password must contain 1 uppercase, 1 number, and 1 symbol.";
      return;
    }

    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        user_type: userType,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Redirect in base al tipo di utente
      if (userType === "candidate") {
        window.location.href = "/complete-profile-candidate";
      } else {
        window.location.href = "/complete-profile-company";
      }
    } else {
      message.textContent = data.error || "Registration failed. Please try again.";
    }
  });
});