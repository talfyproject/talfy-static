import { db, auth } from "./firebase-config.js";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get("id");

  if (!candidateId) {
    window.location.href = "/login.html";
    return;
  }

  const nameField = document.querySelector(".preview-name");
  const jobField = document.querySelector(".preview-role");
  const experienceField = document.getElementById("experience");
  const sectorField = document.getElementById("sector");
  const toolsField = document.getElementById("tools");
  const statusField = document.getElementById("status");
  const avatarDiv = document.querySelector(".avatar-placeholder");

  async function loadCandidate() {
    try {
      const docRef = doc(db, "users", candidateId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        nameField.innerText = data.display_name || "–";
        jobField.innerText = data.current_job || "–";
        experienceField.innerText = (data.experience_years || "–") + " yrs";
        sectorField.innerText = (data.sector || []).join(", ") || "–";
        toolsField.innerText = (data.tools || []).join(", ") || "–";
        statusField.innerText = "Available";

        if (data.avatar === "male") {
          avatarDiv.innerHTML = '<img src="img/avatar-male.png" alt="Male Avatar"/>';
        } else if (data.avatar === "female") {
          avatarDiv.innerHTML = '<img src="img/avatar-female.png" alt="Female Avatar"/>';
        } else {
          avatarDiv.innerHTML = "?";
        }

        onAuthStateChanged(auth, (user) => {
          if (user && user.uid === candidateId) {
            document.getElementById("editBtn").style.display = "inline-block";
            document.getElementById("logoutBtn").style.display = "inline-block";
          }
        });

      } else {
        nameField.innerText = "Candidate not found";
      }
    } catch (err) {
      console.error("Error loading candidate:", err);
      nameField.innerText = "Error loading profile";
    }
  }

  loadCandidate();
});
