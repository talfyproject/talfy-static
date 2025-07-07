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
    const sector = Array.from(document.querySelectorAll("#sector-group input:checked"))
                        .map(el => el.value).join(", ");

    const logoChoice = document.querySelector('input[name="logo_choice"]:checked');
    const logoUpload = document.getElementById("logo_upload").files[0];

    let logoPath = "";

    if (logoUpload) {
      message.textContent = "Please use a default avatar for now. Upload coming soon.";
      return;
    } else if (logoChoice) {
      logoPath = logoChoice.value;
    }

    if (!companyName || isNaN(numEmployees) || !headquarters || !sector || !logoPath) {
      message.textContent = "Please fill in all required fields.";
      return;
    }

    const payload = {
      user_id: userId,
      company_name: companyName,
      sector: sector,
      num_employees: numEmployees,
      headquarters: headquarters,
      logo: logoPath
    };

    try {
      const response = await fetch("https://talfy-backend.onrender.com/save-company-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = "Company profile saved!";
        message.style.color = "green";
        setTimeout(() => {
          window.location.href = "/companies.html";
        }, 1500);
      } else {
        message.textContent = data.error || "Error saving company profile.";
        message.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "Network error. Try again later.";
    }
  });
});
