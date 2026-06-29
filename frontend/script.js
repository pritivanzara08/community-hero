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

//Initialize the map when page loads
let map;
let marker;

document.addEventListener("DOMContentLoaded", () => {
  //default coordinates (e.g., center of the city)
  const defaultLat= 23.0225;
  const defaultLng= 72.5714;

  map = L.map('map').setView([defaultLat, defaultLng], 13);

  //load standard OpenStreetMap tiles
  L.titleLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ' &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  //allow user to click the map to set a location
  map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    //if a marker already exists, remove it
    if (marker) {
      map.removeLayer(marker);
    }

    //add a new marker at the clicked location
    marker = L.marker([lat, lng]).addTo(map);

    //update the hidden input fields in the form with the selected coordinates
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  });
});

// 2. Handle Form Submission
const reportForm = document.getElementById('reportForm');

if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Use FormData instead of JSON to handle the file upload
        const formData = new FormData();
        formData.append("title", document.getElementById('title').value);
        formData.append("description", document.getElementById('description').value);
        // Add your category logic here if you have a dropdown
        formData.append("category", "Infrastructure"); 
        formData.append("latitude", document.getElementById('latitude').value);
        formData.append("longitude", document.getElementById('longitude').value);

        const imageFile = document.getElementById('imageUpload').files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/issues/', {
                method: 'POST',
                body: formData // Notice: No Content-Type header needed for FormData, the browser handles it
            });

            if (response.ok) {
                alert("Issue reported successfully!");
                reportForm.reset();
                if (marker) map.removeLayer(marker);
            } else {
                alert("Failed to submit issue.");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    });
}