document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("candidateProfileForm");
  const message = document.getElementById("formMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const display_name = document.getElementById("display_name").value.trim();
    const current_job = document.getElementById("current_job").value.trim();
    const experience_years = parseInt(document.getElementById("experience_years").value);
    const salary_range = document.getElementById("salary_range").value.trim();

    // Checkbox groups
    const getCheckedValues = (selector) =>
      Array.from(document.querySelectorAll(`${selector} input:checked`)).map(cb => cb.value).join(", ");

    const sector = getCheckedValues("#sector-group");
    const tools = getCheckedValues("#tools-group");
    const education = getCheckedValues("#education-group");

    // Avatar selection
    const avatarChoice = document.querySelector('input[name="avatar_choice"]:checked')?.value;
    let avatar = avatarChoice;

    // Date of birth (not yet saved in DB but included)
    const dob_day = document.getElementById("dob_day").value;
    const dob_month = document.getElementById("dob_month").value;
    const dob_year = document.getElementById("dob_year").value;
    const dob = `${dob_year}-${dob_month.padStart(2, '0')}-${dob_day.padStart(2, '0')}`;

    // Get user_id from localStorage
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      message.textContent = "Error: user ID missing. Please register again.";
      return;
    }

    // Payload
    const payload = {
      user_id,
      display_name,
      current_job,
      experience_years,
      salary_range,
      sector,
      tools,
      avatar
    };

    try {
      const response = await fetch("https://talfy-backend.onrender.com/save-candidate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = "Profile saved successfully!";
        setTimeout(() => {
          window.location.href = "candidates.html";
        }, 1000);
      } else {
        message.textContent = data.error || "Failed to save profile.";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "Error saving profile.";
    }
  });
});
