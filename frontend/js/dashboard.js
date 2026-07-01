// ==========================================================================
// DASHBOARD FUNCTIONALITY (User & Admin)
// ==========================================================================

const API_BASE_URL = "http://localhost:8000/api";

// Load user dashboard (for Citizens)
async function loadUserDashboard() {
  if (!requireAuth()) return;

  const token = getAuthToken();
  const role = getUserRole();

  if (role === "Admin" || role === "Department_Admin" || role === "Moderator") {
    loadAdminDashboard();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      displayUserDashboard(data);
    } else if (response.status === 401) {
      clearAuthData();
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Error loading user dashboard:", error);
  }
}

// Display user dashboard
function displayUserDashboard(data) {
  const mainStats = document.querySelector(".main-stats-strip");
  if (mainStats) {
    mainStats.innerHTML = `
      <div class="admin-card">
        <div class="panel-subtitle">📊 Your Issues</div>
        <div class="metric-num text-reported">${data.issues_count}</div>
        <div class="metric-lbl">Total Reported</div>
      </div>
      <div class="admin-card">
        <div class="panel-subtitle">📍 Your Email</div>
        <div style="font-size: 0.9rem; margin-top: 0.5rem; word-break: break-all;">${data.user_email}</div>
      </div>
    `;
  }

  displayUserIssues(data.issues);
}

// Display user's issues in table
function displayUserIssues(issues) {
  const container = document.querySelector(".interactive-visuals-grid");
  if (container) {
    let issuesHTML = `
      <div class="admin-card">
        <h3>Your Reported Issues</h3>
        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Department</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
    `;

    if (issues.length === 0) {
      issuesHTML += `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No issues reported yet. <a href="report.html" style="color: var(--brand-mint);">Report one now</a>
          </td>
        </tr>
      `;
    } else {
      issues.forEach(issue => {
        issuesHTML += `
          <tr>
            <td>${issue.title}</td>
            <td>${issue.category}</td>
            <td>
              <span class="badge badge-${issue.status.toLowerCase()}">
                ${issue.status}
              </span>
            </td>
            <td>${issue.assigned_department || "Pending"}</td>
            <td>${new Date(issue.created_at).toLocaleDateString()}</td>
          </tr>
        `;
      });
    }

    issuesHTML += `
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = issuesHTML;
  }
}

// Load admin dashboard
async function loadAdminDashboard() {
  if (!requireAdmin()) return;

  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      displayAdminDashboard(data);
    } else if (response.status === 403) {
      alert("Access Denied. Admin only.");
      window.location.href = "index.html";
    } else if (response.status === 401) {
      clearAuthData();
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Error loading admin dashboard:", error);
  }
}

// Display admin dashboard
function displayAdminDashboard(data) {
  const mainStats = document.querySelector(".main-stats-strip");
  if (mainStats) {
    mainStats.innerHTML = `
      <div class="admin-card">
        <div class="panel-subtitle">📋 Total Issues</div>
        <div class="metric-num text-reported">${data.total_issues}</div>
        <div class="metric-lbl">All Issues</div>
      </div>
      <div class="admin-card">
        <div class="panel-subtitle">⏳ Pending</div>
        <div class="metric-num text-progress">${data.pending_issues}</div>
        <div class="metric-lbl">Awaiting Action</div>
      </div>
      <div class="admin-card">
        <div class="panel-subtitle">🔄 In Progress</div>
        <div class="metric-num" style="color: #ffb703">${data.in_progress_issues}</div>
        <div class="metric-lbl">Being Resolved</div>
      </div>
      <div class="admin-card">
        <div class="panel-subtitle">✅ Resolved</div>
        <div class="metric-num text-resolved">${data.resolved_issues}</div>
        <div class="metric-lbl">Completed</div>
      </div>
    `;
  }

  displayAdminIssues(data.issues);
}

// Display admin issues table with actions
function displayAdminIssues(issues) {
  const container = document.querySelector(".interactive-visuals-grid");
  if (container) {
    let issuesHTML = `
      <div class="admin-card">
        <h3>All Reported Issues</h3>
        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Reporter</th>
                <th>Category</th>
                <th>Status</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
    `;

    if (issues.length === 0) {
      issuesHTML += `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No issues to display
          </td>
        </tr>
      `;
    } else {
      issues.forEach(issue => {
        issuesHTML += `
          <tr>
            <td>#${issue.id}</td>
            <td>${issue.title}</td>
            <td>${issue.reporter_email || "Unknown"}</td>
            <td>${issue.category}</td>
            <td>
              <select class="select-field" onchange="updateIssueStatus(${issue.id}, this.value)">
                <option value="Pending" ${issue.status === "Pending" ? "selected" : ""}>Pending</option>
                <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
                <option value="Resolved" ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
              </select>
            </td>
            <td>
              <select class="select-field" onchange="assignDepartment(${issue.id}, this.value)">
                <option value="">Assign...</option>
                <option value="Public Works">Public Works</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Safety">Safety</option>
                <option value="Utilities">Utilities</option>
              </select>
            </td>
            <td>
              <button onclick="viewIssueDetails(${issue.id})" class="action-submit-btn" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
                View
              </button>
            </td>
          </tr>
        `;
      });
    }

    issuesHTML += `
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = issuesHTML;
  }
}

// Update issue status (admin function)
async function updateIssueStatus(issueId, status) {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/issue/${issueId}/status`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ new_status: status })
    });

    if (response.ok) {
      alert("Status updated successfully");
      loadAdminDashboard();
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
}

// Assign issue to department (admin function)
async function assignDepartment(issueId, department) {
  if (!department) return;

  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/issue/${issueId}/assign`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ department })
    });

    if (response.ok) {
      alert("Issue assigned successfully");
      loadAdminDashboard();
    }
  } catch (error) {
    console.error("Error assigning department:", error);
  }
}

// View issue details
function viewIssueDetails(issueId) {
  alert(`Viewing details for issue #${issueId}`);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  
  if (currentPage === "dashboard.html") {
    const role = getUserRole();
    if (role === "Admin" || role === "Department_Admin" || role === "Moderator") {
      loadAdminDashboard();
    } else {
      loadUserDashboard();
    }
  } else if (currentPage === "admin.html") {
    loadAdminDashboard();
  }
});
