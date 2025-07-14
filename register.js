import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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

    // Validazioni
    if (!email || !password || !confirmPassword || !user_type) {
      showMessage("Please fill in all fields.");
      return resetButton();
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.");
      return resetButton();
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      showMessage("Password must contain 1 uppercase, 1 number, and 1 symbol.");
      return resetButton();
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva info base in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        user_type,
        created_at: new Date()
      });

      localStorage.setItem("user_id", user.uid);
      localStorage.setItem("user_type", user_type);

      window.location.href =
        user_type === "candidate"
          ? "/complete-profile-candidate.html"
          : "/complete-profile-company.html";
    } catch (error) {
      console.error(error);
      showMessage(error.message || "Registration failed. Please try again.");
      resetButton();
    }

    function showMessage(msg) {
      message.textContent = msg;
      message.className = "message error";
      message.style.display = "block";
    }

    function resetButton() {
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled");
    }
  });
});
