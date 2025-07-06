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

    try {
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
        // Salva user_id nel localStorage
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_type", userType);

        // Reindirizza in base al tipo di utente
        window.location.href =
          userType === "candidate"
            ? "/complete-profile-candidate.html"
            : "/complete-profile-company.html";
      } else {
        message.textContent = data.error || "Registration failed. Please try again.";
      }
    } catch (error) {
      message.textContent = "Network error. Please try again later.";
      console.error("Registration error:", error);
    }
  });
});
