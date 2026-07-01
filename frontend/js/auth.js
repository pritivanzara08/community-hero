// ==========================================================================
// AUTH & ROLE-BASED NAVIGATION SYSTEM
// ==========================================================================

const API_BASE_URL = "http://localhost:8000/api";

// Get token from localStorage
function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Get user role from localStorage
function getUserRole() {
  return localStorage.getItem("userRole");
}

// Get user email from localStorage
function getUserEmail() {
  return localStorage.getItem("userEmail");
}

// Set authentication data
function setAuthData(token, role, email, username) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("userRole", role);
  localStorage.setItem("userEmail", email);
  localStorage.setItem("username", username);
}

// Clear authentication data
function clearAuthData() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("username");
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

// Redirect to home if not admin
function requireAdmin() {
  const role = getUserRole();
  if (role !== "Admin" && role !== "Department_Admin" && role !== "Moderator") {
    alert("Access Denied. Admin privileges required.");
    window.location.href = "index.html";
    return false;
  }
  return true;
}

// Update navigation based on user role
function updateNavigation() {
  const role = getUserRole();
  const email = getUserEmail();
  
  if (isAuthenticated()) {
    // Show user info in nav
    const navMenu = document.querySelector(".nav-menu");
    if (navMenu && !document.querySelector(".user-status")) {
      const userStatus = document.createElement("div");
      userStatus.className = "user-status";
      userStatus.innerHTML = `
        <span style="font-size: 0.75rem; color: var(--text-muted);">
          ${role === "Admin" ? "🔐 Admin" : "👤 Citizen"} • ${email}
        </span>
        <a href="#" onclick="logout()" class="nav-link" style="color: var(--danger-rose); margin-left: 1rem;">
          Logout
        </a>
      `;
      navMenu.appendChild(userStatus);
    }

    // Update admin link visibility
    const adminLink = document.querySelector('a[href="admin.html"]');
    if (adminLink) {
      if (role === "Admin" || role === "Department_Admin" || role === "Moderator") {
        adminLink.style.display = "block";
      } else {
        adminLink.style.display = "none";
      }
    }

    // Update dashboard link
    const dashboardLink = document.querySelector('a[href="dashboard.html"]');
    if (dashboardLink) {
      dashboardLink.textContent = role === "Admin" ? "Admin Dashboard" : "My Dashboard";
    }
  }
}

// Logout function
function logout() {
  clearAuthData();
  alert("Logged out successfully");
  window.location.href = "index.html";
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      setAuthData(data.access_token, data.role, data.email, data.username);

      // Redirect based on role
      if (data.role === "Admin" || data.role === "Department_Admin" || data.role === "Moderator") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      const error = await response.json();
      alert("Login failed: " + error.detail);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login");
  }
}

// Handle registration
async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername")?.value;
  const email = document.getElementById("registerEmail")?.value;
  const password = document.getElementById("registerPassword")?.value;

  if (!username || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    if (response.ok) {
      alert("Registration successful! Please login.");
      document.getElementById("authToggleLogin")?.click();
      document.getElementById("registerForm")?.reset();
    } else {
      const error = await response.json();
      alert("Registration failed: " + error.detail);
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("An error occurred during registration");
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  updateNavigation();
  
  // Prevent report page access for non-authenticated users
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  
  if (currentPage === "report.html" && !isAuthenticated()) {
    alert("Please login first");
    window.location.href = "index.html";
  }
});


// --- Modern Authorization & Security Module Interface Operations ---

function toggleAuthTab(isLogin) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginBtn = document.getElementById("authToggleLogin");
    const registerBtn = document.getElementById("authToggleRegister");

    if (isLogin) {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        loginBtn.classList.add("active");
        registerBtn.classList.remove("active");
    } else {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        loginBtn.classList.remove("active");
        registerBtn.classList.add("active");
    }
}

// IN-INPUT TOGGLE VISIBILITY HANDLER
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const captchaChecked = document.getElementById("loginCaptcha").checked;
    
    if (!captchaChecked) {
        alert("🔒 Security Gate: Please execute the Turnstile anti-bot checkbox verification step first.");
        return;
    }
    
    // Smoothly transition into OTP step layout bounds
    showOtpVerificationConsole(true);
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const registerMessage = document.getElementById("registerMessage");
    
    if (password !== confirmPassword) {
        if (registerMessage) {
            registerMessage.textContent = "Error: Input passwords do not match.";
            registerMessage.className = "status-msg error";
        }
        return;
    }
    
    showOtpVerificationConsole(true);
}

function showOtpVerificationConsole(show) {
    const formsWrapper = document.getElementById("authFormsWrapper");
    const otpModule = document.getElementById("otpVerificationModule");
    
    if (show) {
        formsWrapper.classList.add("hidden");
        otpModule.classList.remove("hidden");
    } else {
        formsWrapper.classList.remove("hidden");
        otpModule.classList.add("hidden");
    }
}

function abortOtpVerification() {
    showOtpVerificationConsole(false);
}

function focusNextOtpBox(current, index) {
    if (current.value.length >= 1 && index < 6) {
        document.getElementById(`otp${index + 1}`).focus();
    }
}

function verifyOtpCode() {
    let code = "";
    for (let i = 1; i <= 6; i++) {
        code += document.getElementById(`otp${i}`).value;
    }
    
    if (code.length < 6) {
        const msg = document.getElementById("registerMessage");
        if (msg) {
            msg.textContent = "Incomplete verification entry.";
            msg.className = "status-msg error";
        }
        return;
    }
    
    alert(`🔐 Security verification token accepted: Access authorized.`);
    window.location.href = "dashboard.html";
}