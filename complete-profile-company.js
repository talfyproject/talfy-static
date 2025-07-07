document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("companyProfileForm");
  const message = document.getElementById("formMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      message.textContent = "User ID not found. Please register again.";
      return;
    }

    const companyName = document.getElementById("company_name").value.trim();
    const numEmployees = parseInt(document.getElementById("num_employees").value);
    const headquarters = document.getElementById("headquarters").value.trim();

    const sector = Array.from(
      document.querySelectorAll('#sector-group input[type="checkbox"]:checked')
    ).map(el => el.value).join(", ");

    const logo = document.querySelector('input[name="logo_choice"]:checked')?.value;

    if (!companyName || isNaN(numEmployees) || !headquarters || !sector || !logo) {
      message.textContent = "Please fill in all required fields.";
      return;
    }

    const payload = {
      user_id: userId,
      company_name: companyName,
      sector: sector,
      num_employees: numEmployees,
      headquarters: headquarters,
      logo: logo
    };

    try {
      const response = await fetch("https://talfy-backend.onrender.com/save-company-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      message.style.color = "red";
    }
  });
});
