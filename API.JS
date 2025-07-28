const API_BASE_URL = window.location.origin.includes("render.com")
  ? window.location.origin // su Render
  : "http://localhost:5000"; // per test locale

// --- GET Request ---
async function apiGet(endpoint) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`GET ${endpoint} failed`);
  return await res.json();
}

// --- POST Request ---
async function apiPost(endpoint, data) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} failed`);
  return await res.json();
}

// --- Register User ---
async function registerUser(email, password, userType) {
  return await apiPost("/api/register", { email, password, user_type: userType });
}

// --- Login User ---
async function loginUser(email, password) {
  return await apiPost("/api/login", { email, password });
}

// --- Update Profile ---
async function updateProfile(userId, profileData) {
  return await apiPost("/api/update-profile", { userId, profileData });
}

// --- Get Counters ---
async function getCounters() {
  return await apiGet("/api/counters");
}

// --- Get Candidates ---
async function getCandidates() {
  return await apiGet("/api/candidates");
}

// --- Get Companies ---
async function getCompanies() {
  return await apiGet("/api/companies");
}

// --- Gestione Token ---
function saveToken(token) {
  localStorage.setItem("authToken", token);
}

function getToken() {
  return localStorage.getItem("authToken");
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
}
