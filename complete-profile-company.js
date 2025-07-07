// complete-profile-company.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("companyProfileForm");
  const message = document.getElementById("companyProfileMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      message.textContent = "User ID not found. Please register again.";
      return;
    }

    const company_name = document.getElementById("company_name").value.trim();
    const industry = document.getElementById("industry").value.trim();
    const company_size = document.getElementById("company_size").value.trim();
    const location = document.getElementById("location").value.trim();
    const logo = document.querySelector('input[name="logo_choice"]:checked')?.value || "";

    if (!company_name || !industry || !company_size || !location || !logo) {
      message.textContent = "Please fill in all required fields.";
      return;
    }

    const payload = {
      user_id: userId,
      company_name,
      industry,
      company_size,
      location,
      logo
    };

    try {
      const response = await fetch("https://talfy-backend.onrender.com/save-company-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = "Profile saved successfully!";
        message.style.color = "green";
        setTimeout(() => {
          window.location.href = "/companies.html";
        }, 1500);
      } else {
        message.textContent = data.error || "Error saving profile.";
        message.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "Network error. Try again later.";
    }
  });
});
