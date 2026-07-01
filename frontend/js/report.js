// ==========================================================================
// REPORT PAGE FUNCTIONALITY
// ==========================================================================

const API_BASE_URL = "http://localhost:8000/api";

let reportData = {
  latitude: null,
  longitude: null,
  imageFile: null
};

// Initialize map on page load
document.addEventListener("DOMContentLoaded", function () {
  // Check authentication first
  if (!isAuthenticated()) {
    alert("Please login to report an issue");
    window.location.href = "index.html";
    return;
  }

  initializeMap();
  setupFormHandlers();
});

// Initialize Leaflet map
function initializeMap() {
  const map = L.map("map").setView([40.7128, -74.0060], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Map click event to set coordinates
  map.on("click", function (e) {
    reportData.latitude = e.latlng.lat;
    reportData.longitude = e.latlng.lng;

    // Update the geo badge
    document.getElementById("geoText").textContent =
      `📍 ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
    document.getElementById("geoIndicator").classList.add("active");

    // Clear existing marker if there is one
    if (window.currentMarker) {
      map.removeLayer(window.currentMarker);
    }

    // Add new marker
    window.currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
  });

  window.mapInstance = map;
}

// Setup form handlers
function setupFormHandlers() {
  // File input handling
  const imageUpload = document.getElementById("imageUpload");
  if (imageUpload) {
    imageUpload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        reportData.imageFile = file;
        document.getElementById("fileUploadStatus").textContent = `✓ ${file.name}`;
      }
    });

    // Make dropzone clickable
    const dropzone = document.querySelector(".media-dropzone");
    if (dropzone) {
      dropzone.addEventListener("click", function () {
        imageUpload.click();
      });
    }
  }

  // Form submission handler
  const reportForm = document.getElementById("reportForm");
  if (reportForm) {
    reportForm.addEventListener("submit", handleReportSubmit);
  }
}

// Handle report form submission
async function handleReportSubmit(event) {
  event.preventDefault();

  if (!reportData.latitude || !reportData.longitude) {
    alert("Please click on the map to set the issue location");
    return;
  }

  const token = getAuthToken();
  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("latitude", reportData.latitude);
  formData.append("longitude", reportData.longitude);

  if (reportData.imageFile) {
    formData.append("image", reportData.imageFile);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/issues/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      alert("Issue reported successfully! ✅ Thank you for helping your community.");
      document.getElementById("reportForm").reset();
      reportData = { latitude: null, longitude: null, imageFile: null };
      document.getElementById("geoIndicator").classList.remove("active");
      document.getElementById("geoText").textContent = "Unpinned Location Target";
      document.getElementById("fileUploadStatus").textContent = "Attach Verification Media";
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else if (response.status === 401) {
      clearAuthData();
      window.location.href = "index.html";
    } else {
      const error = await response.json();
      alert("Error reporting issue: " + (error.detail || "Unknown error"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while reporting the issue");
  }
}
