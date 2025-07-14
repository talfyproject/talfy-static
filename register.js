document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".register-form");
  const message = document.getElementById("registerMessage");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";
    message.style.display = "none";
    submitBtn.disabled = true;
    submitBtn.classList.add("disabled");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const user_type = document.getElementById("userType").value;

    // Basic validations
    if (!email || !password || !confirmPassword || !user_type) {
      message.textContent = "Please fill in all fields.";
      message.className = "message error";
      message.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled");
      return;
    }

    if (!user_type) {
      message.textContent = "Please select an account type.";
      message.className = "message error";
      message.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled");
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      message.className = "message error";
      message.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      message.textContent = "Password must contain 1 uppercase, 1 number, and 1 symbol.";
      message.className = "message error";
      message.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled");
      return;
    }

    // Optional: Check if email already exists
    try {
      const check = await fetch(`https://talfy-backend.onrender.com/api/check-email?email=${encodeURIComponent(email)}`);
      if (check.ok) {
        const result = await check.json();
        if (result.exists) {
          message.textContent = "Email already registered.";
          message.className = "message error";
          message.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.classList.remove("disabled");
          return;
        }
      }
    } catch (err) {
      console.warn("Email check failed or endpoint not available");
    }

    const registrationData = {
      email,
      password,
      user_type,
    };

    try {
      const response = await fetch("https://talfy-backend.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_type", user_type);
        window.location.href =
          user_type === "candidate"
            ? "/complete-profile-candidate.html"
            : "/complete-profile-company.html";
      } else {
        message.textContent = data.error || "Registration failed. Please try again.";
        message.className = "message error";
        message.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.classList.remove("disabled");
      }
    } catch (error) {
      message.textContent = "Network error. Please try again later.";
      message.className = "message error";
      message.style.display = "block";
      console.error("Registration error:", error);
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled");
    }
  });
});
