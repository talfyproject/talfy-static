document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("candidateProfileForm");
  const message = document.getElementById("profileMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      message.textContent = "User ID not found. Please register again.";
      return;
    }

    const name = document.getElementById("display_name").value.trim();
    const job = document.getElementById("current_job").value.trim();
    const exp = parseInt(document.getElementById("experience_years").value);
    const salary = document.getElementById("salary_range").value.trim();
    const sector = getCheckedValues("sector[]").join(", ");
    const tools = getCheckedValues("tools[]").join(", ");
    const avatar = document.querySelector('input[name="avatar_choice"]:checked')?.value;

    if (!name || !job || isNaN(exp) || !salary || !sector || !tools || !avatar) {
      message.textContent = "Please fill in all required fields.";
      return;
    }

    const payload = {
      user_id: userId,
      display_name: name,
      current_job: job,
      experience_years: exp,
      salary_range: salary,
      sector: sector,
      tools: tools,
      avatar: avatar
    };

    try {
      const response = await fetch("https://talfy-backend.onrender.com/save-candidate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = "Profile saved successfully!";
        message.style.color = "green";
        setTimeout(() => {
          window.location.href = "candidates.html";
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

  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
  }
});
