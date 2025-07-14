import { db, auth } from "./firebase-config.js";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("candidateProfileForm");
  const message = document.getElementById("profileMessage");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      message.textContent = "User not authenticated. Please log in again.";
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      message.textContent = "";
      message.style.color = "red";

      const name = document.getElementById("display_name").value.trim();
      const job = document.getElementById("current_job").value.trim();
      const exp = parseInt(document.getElementById("experience_years").value);
      const salary = document.getElementById("salary_range").value.trim();
      const sector = getCheckedValues("sector[]");
      const tools = getCheckedValues("tools[]");
      const avatar = document.querySelector('input[name="avatar_choice"]:checked')?.value;

      if (!name || !job || isNaN(exp) || !salary || sector.length === 0 || tools.length === 0 || !avatar) {
        message.textContent = "Please fill in all required fields.";
        return;
      }

      const payload = {
        display_name: name,
        current_job: job,
        experience_years: exp,
        salary_range: salary,
        sector: sector,
        tools: tools,
        avatar: avatar,
        completed_profile: true,
        updated_at: new Date()
      };

      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, payload);

        message.textContent = "Profile saved successfully!";
        message.style.color = "green";

        setTimeout(() => {
          window.location.href = `candidate.html?id=${user.uid}`;
        }, 1500);
      } catch (error) {
        console.error(error);
        message.textContent = "Error saving profile. Try again.";
      }
    });

    function getCheckedValues(name) {
      return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
    }
  });
});
