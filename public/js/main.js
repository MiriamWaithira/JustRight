// public/js/main.js
// main.js - Client-side JavaScript for JustRight Application

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const reportForm = document.getElementById('report-form');
const messageForm = document.getElementById('message-form');
const logoutBtn = document.getElementById('logout-btn');

// Base API URL
const API_BASE_URL = 'http://localhost:3000/api';

// Token Management
let authToken = localStorage.getItem('jwtToken');

// ====================
// Utility Functions
// ====================

/**
 * Set authorization header for fetch requests
 */
function getAuthHeader() {
    return {
        'Authorization': 'Bearer ${authToken}',
        'Content-Type': 'application/json'
    };
}

/**
 * Handle API errors
 */
function handleApiError(error) {
    console.error('API Error:', error);
    alert(error.message || 'An error occurred');
}

/**
 * Redirect to specified page
 */
function redirectTo(page) {
    window.location.href = '/views/${page}.html';
}

// ====================
// Authentication
// ====================

/**
 * Handle User Login
 */
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;

    try {
        const response = await fetch('${API_BASE_URL}/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and redirect
        authToken = data.token;
        localStorage.setItem('jwtToken', authToken);

        // Redirect based on role
        if (role === 'admin') {
            redirectTo('adminhome');
        } else if (role === 'moderator') {
            redirectTo('moderatorhome');
        } else {
            redirectTo('userhome');
        }
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Handle User Registration
 */
async function handleRegistration(e) {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const licenseNumber = role === 'moderator' ?
        document.getElementById('register-license').value : null;

    try {
        const response = await fetch('${API_BASE_URL}/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                role,
                ...(licenseNumber && { licenseNumber })
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data,message || 'Registration failed');
        }

        alert('Registration successful! Please login.');
        document.getElementById('register-form').reset();
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Handle User Logout
 */
function handleLogout() {
    localStorage.removeItem('jwtToken');
    authToken = null;
    redirectTo('index');
}

// ====================
// Report Management
// ====================

/**
 * Submit a new Report
 */
async function submitReport(e) {
    e.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('report-file');

    // Add Form Data
    formData.append('incidentType', document.getElementById('incident-type').value);
    formData.append('status', document.getElementById('incident-status').value);
    formData.append('description', document.getElementById('incident-description').value);
    formData.append('location', document.getElementById('incident-location').value);
    formData.append('exactLocation', document.getElementById('exact-location').value);

    // Add files if Selected
    if (fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reports`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit report');
        }

        alert('Report Submtted successfully!');
        document.getElementById('report-form').reset();
        loadUserReports(); // Refresh reports list
    } catch (error) {
        handleApiError(error);
    }
}

/**
 * Load User's reports
 */
async function loadUserReports() {
    try {
        const response = await fetch('${API_BASE_URL}/reports/my-reports', {
            headers: getAuthHeader()
        });

        const reports = await response.json();
        
        if (!response.ok) {
            throw new Error(reports.message || 'Failed to load reports');
        }

        const reportsTables = document.getElementById('reports-table');
        reportsTables.innerHTML = ''; //Clear esting content

        // Create Table Header
        const headerRow = document.createElement('tr');
        ['Date', 'Type', 'Status', 'Location', 'Actions'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        reportsTables.appendChild(headerRow);

        // Populate Table with Reports
        reports.forEach(report => {
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(report.createdAt).toLocaleString();
            row.appendChild(dateCell);

            const typeCell = document.createElement('td');
      typeCell.textContent = report.incidentType;
      row.appendChild(typeCell);
      
      const statusCell = document.createElement('td');
      statusCell.textContent = report.status;
      row.appendChild(statusCell);
      
      const locationCell = document.createElement('td');
      locationCell.textContent = report.location;
      row.appendChild(locationCell);
      
      const actionCell = document.createElement('td');
      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View';
      viewBtn.addEventListener('click', () => viewReportDetails(report.id));
      actionCell.appendChild(viewBtn);
      row.appendChild(actionCell);
      
      reportsTable.appendChild(row);
    });
  } catch (error) {
    handleApiError(error);
  }
}

// ======================
//  Event Listeners
// ======================

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication status
  if (window.location.pathname !== '/views/index.html' && !authToken) {
    redirectTo('index');
  }

  // Form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  if (reportForm) {
    reportForm.addEventListener('submit', submitReport);
  }
  
  if (messageForm) {
    messageForm.addEventListener('submit', submitMessage);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Load data for specific pages
  if (window.location.pathname.includes('userhome.html')) {
    loadUserReports();
  }
});

// ======================
//  Additional Functions
// ======================

/**
 * View report details
 */
async function viewReportDetails(reportId) {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
      headers: getAuthHeader()
    });
    
    const report = await response.json();
    
    if (!response.ok) {
      throw new Error(report.message || 'Failed to load report');
    }

    // Display report details in a modal or dedicated page
    alert(`Report Details:\nType: ${report.incidentType}\nStatus: ${report.status}\nDescription: ${report.description}`);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Submit support message
 */
async function submitMessage(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('message-name').value;
  const email = document.getElementById('message-email').value;
  const phone = document.getElementById('message-phone').value;
  const message = document.getElementById('message-text').value;

  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ fullName, email, phoneNumber: phone, message })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }

    alert('Message sent successfully!');
    document.getElementById('message-form').reset();
  } catch (error) {
    handleApiError(error);
  }
}