// ==========================================================================
// 1. GLOBAL CONFIGURATIONS & UI INSTANTIATIONS
// ==========================================================================
const API_BASE_URL = "http://127.0.0.1:8000";
let map;
let marker;

// ==========================================================================
// 2. RUNS IMMEDIATELY: INTERFACE TAB SYSTEM SWITCHING (SIDEBARS & CARD FORMS)
// ==========================================================================
const showReportTab = document.getElementById("showReportTab");
const showAuthTab = document.getElementById("showAuthTab");
const reportContainer = document.getElementById("reportContainer");
const authContainer = document.getElementById("authContainer");

if (showReportTab && showAuthTab && reportContainer && authContainer) {
    showReportTab.addEventListener("click", () => {
        reportContainer.classList.remove("hidden");
        authContainer.classList.add("hidden");
        showReportTab.classList.add("active");
        showAuthTab.classList.remove("active");
    });

    showAuthTab.addEventListener("click", () => {
        authContainer.classList.remove("hidden");
        reportContainer.classList.add("hidden");
        showAuthTab.classList.add("active");
        showReportTab.classList.remove("active");
    });
}

// FIX ADDITION: Home Page Login vs Registration View Switching Panels
const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (showLoginBtn && showRegisterBtn && loginForm && registerForm) {
    showLoginBtn.addEventListener("click", () => {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        showLoginBtn.classList.add("active");
        showRegisterBtn.classList.remove("active");
    });

    showRegisterBtn.addEventListener("click", () => {
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        showRegisterBtn.classList.add("active");
        showLoginBtn.classList.remove("active");
    });
}

// ==========================================================================
// 3. RUNS ON DOM LOAD: GIS MAPPING AND INTERACTION LOOPS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Dynamically query Live Impact Metrics counts for your Home Dashboard widgets at startup
    fetchLiveImpactStatistics();

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    const defaultLat = 23.0225;
    const defaultLng = 72.5714;

    map = L.map("map", { zoomControl: false }).setView([defaultLat, defaultLng], 13);

    L.control.zoom({ position: "topleft" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    }).addTo(map);

    // FIXED WORKFLOW: The location assignment logic now runs safely INSIDE the click callback
    map.on("click", function (e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([lat, lng]).addTo(map);

        const latInput = document.getElementById("latitude");
        const lngInput = document.getElementById("longitude");
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;

        const geoText = document.getElementById("geoText");
        const geoIndicator = document.getElementById("geoIndicator");
        
        if (geoText && geoIndicator) {
            geoText.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            geoText.style.color = "var(--success-green, #10b981)";
            
            // Clean handling of classes vs element parameters
            geoIndicator.style.backgroundColor = "#10b981";
            geoIndicator.classList.add("locked");
        }
    });

    const fileInput = document.getElementById("imageUpload");
    const uploadStatusText = document.getElementById("fileUploadStatus");
    if (fileInput && uploadStatusText) {
        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                uploadStatusText.textContent = `Attached: ${e.target.files[0].name}`;
                uploadStatusText.classList.add("text-indigo-600");
            }
        });
    }
});

// ==========================================================================
// 4. DATA SYNCHRONIZATION: LIVE METRICS TICKER ENGINE
// ==========================================================================
async function fetchLiveImpactStatistics() {
    try {
        // Fallback checks to ensure elements exist on current viewport page configuration
        if (!document.getElementById("count-total")) return;

        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`); // Adjust to your Phase-1 statistics route
        if (response.ok) {
            const stats = await response.json();
            document.getElementById("count-total").textContent = stats.total || 0;
            document.getElementById("count-reported").textContent = stats.reported || 0;
            document.getElementById("count-progress").textContent = stats.progress || 0;
            document.getElementById("count-resolved").textContent = stats.resolved || 0;
        }
    } catch (err) {
        console.warn("Dashboard Live statistics endpoint offline. Defaulting views to static seed configurations.", err);
    }
}

// ==========================================================================
// 5. TICKET FORM SUBMISSION EVENT HANDLER
// ==========================================================================
const reportForm = document.getElementById("reportForm");

if (reportForm) {
    reportForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_access_token");
        if (!token) {
            alert("🔒 Access Denied. Please authenticate into your citizen account profile first.");
            window.location.href = "/index.html";
            return;
        }

        const latVal = document.getElementById("latitude").value;
        const lngVal = document.getElementById("longitude").value;

        if (!latVal || !lngVal) {
            alert("📍 Mapping Error: You must pick the exact location by clicking on the map workspace before submitting your ticket.");
            return;
        }

        const formData = new FormData();
        formData.append("title", document.getElementById("title").value);
        formData.append("description", document.getElementById("description").value);
        formData.append("latitude", latVal);
        formData.append("longitude", lngVal);

        const imageFile = document.getElementById("imageUpload").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/issues/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert("🎉 Success! The automated engine analyzed the description, determined priority levels, and assigned the ticket to the correct department.");
                reportForm.reset();

                const uploadStatus = document.getElementById("fileUploadStatus");
                if (uploadStatus) {
                    uploadStatus.textContent = "Click to capture or attach media file";
                    uploadStatus.classList.remove("text-indigo-600");
                }

                if (marker && map) {
                    map.removeLayer(marker);
                }

                const geoText = document.getElementById("geoText");
                const geoIndicator = document.getElementById("geoIndicator");
                const geoBadge = document.getElementById("geoBadge");

                if (geoText) geoText.textContent = "Select Pin Coordinate Location";
                if (geoIndicator) {
                    geoIndicator.className = "live-pulse";
                    geoIndicator.style.backgroundColor = "";
                }
                
                // Refresh dashboard statistics panel automatically after a successful report submission
                fetchLiveImpactStatistics();
            } else {
                alert(`⚠️ Server Error: ${result.detail || "Could not parse ticket values."}`);
            }
        } catch (error) {
            console.error("Critical Fetch Fail Exception: ", error);
            alert("📡 Network Connection Fail: Failed to reach the automated AI backend process framework.");
        }
    });
}