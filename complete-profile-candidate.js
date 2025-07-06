document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID missing. Please register again.");
      return;
    }

    const displayName = document.querySelector("input[name='first_name']").value.trim() + " " +
                        document.querySelector("input[name='last_name']").value.trim()[0] + ".";
    const currentJob = document.querySelector("select[name='job_titles']:checked")?.value || "";
    const experienceYears = prompt("Enter years of experience");  // Puoi sostituire con input a parte
    const salaryRange = prompt("Enter salary range (e.g., 30k-40k)");
    const sector = [...document.querySelectorAll("input[name='industries']:checked")].map(cb => cb.value).join(", ");
    const tools = [...document.querySelectorAll("input[name='tools']:checked")].map(cb => cb.value).join(", ");
    const avatar = document.querySelector("input[name='avatar']:checked")?.value || "";

    const profileData = {
      user_id: userId,
      display_name: displayName,
      current_job: currentJob,
      experience_years: parseInt(experienceYears),
      salary_range: salaryRange,
      sector,
      tools,
      avatar
    };

    const response = await fetch("https://talfy-backend.onrender.com/save-candidate-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    if (response.ok) {
      alert("Profile saved!");
      window.location.href = "candidates.html";
    } else {
      const data = await response.json();
      alert("Error: " + (data.error || "Failed to save profile"));
    }
  });
});