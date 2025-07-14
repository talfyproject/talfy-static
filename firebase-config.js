// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCk4bzuUIq8EVJ9nFjULh9n33fvSSiKKrc",
  authDomain: "talfy2025.firebaseapp.com",
  projectId: "talfy2025",
  storageBucket: "talfy2025.appspot.com",
  messagingSenderId: "978530814023",
  appId: "1:978530814023:web:d7e1d0f7170809224e4962"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };