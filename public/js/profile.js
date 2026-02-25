// profile.js

// Redirect to login if NOT logged in
const userId = localStorage.getItem('userId');
if (!userId) {
    window.location.href = 'login.html';
}

// Show user email on profile page
const profileEmail = document.getElementById('profileEmail');
if (profileEmail) {
    profileEmail.textContent = localStorage.getItem('userEmail');
}

// Logout button
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});
