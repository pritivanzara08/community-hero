const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

//switch to Login form
showLoginBtn.addEventListener("click", function () {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");

  showLoginBtn.classList.add("active");
  showRegisterBtn.classList.remove("active");
});

//switch to Register form
showRegisterBtn.addEventListener("click", function () {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");

  showRegisterBtn.classList.add("active");
  showLoginBtn.classList.remove("active");
});

//register user
registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fullName = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const registerMessage = document.getElementById("registerMessage");

  if (password !== confirmPassword) {
    registerMessage.textContent = "Passwords do not match.";
    registerMessage.className = "error";
    return;
  }

  if (password.length < 8) {
    registerMessage.textContent =
      "Password must be at least 8 characters long.";
    registerMessage.className = "error";
    return;
  }

  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    registerMessage.textContent =
      "Password must contain at least one letter and one number.";
    registerMessage.className = "error";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      registerMessage.textContent = data.detail || "Registration failed.";
      registerMessage.className = "error";
    } else {
      registerMessage.textContent = "Registration successful! Please Login.";
      registerMessage.className = "success";
      alert("Registration successful! Please login now.");
      registerForm.reset();
      // Optionally, switch to the login form after successful registration
      showLoginBtn.click();
    }
  } catch (error) {
    console.error("Error during registration:", error);
    registerMessage.textContent =
      error.message || "An error occurred. Please try again.";
    registerMessage.className = "error";
  }
});

//login user
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const loginMessage = document.getElementById("loginMessage");

  try {
    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json();

    if (!response.ok) {
      loginMessage.textContent = data.detail || "Login failed.";
      loginMessage.className = "error";
    } else {
      loginMessage.textContent = "Login successful!";
      loginMessage.className = "success";
      // Redirect to dashboard or another page after successful login
      window.location.href = "/dashboard.html";
    }
  } catch (error) {
    console.error("Error during login:", error);
    loginMessage.textContent =
      error.message || "An error occurred. Please try again.";
    loginMessage.className = "error";
  }
});
