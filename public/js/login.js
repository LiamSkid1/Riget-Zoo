console.log('login.js loaded');

// Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleBtn = document.getElementById('toggleBtn');
const toggleText = document.getElementById('toggleText');
const formTitle = document.getElementById('formTitle');
const authMessage = document.getElementById('authMessage');

// Toggle between forms
let showingLogin = true;

toggleBtn.addEventListener('click', () => {
    showingLogin = !showingLogin;

    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');

    formTitle.textContent = showingLogin ? 'Log In' : 'Create Account';
    toggleText.textContent = showingLogin
        ? 'Don’t have an account?'
        : 'Already have an account?';

    toggleBtn.textContent = showingLogin ? 'Create one' : 'Log in';
    authMessage.textContent = '';
});

// LOGIN
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        window.location.href = 'user-profile.html';
    } else {
        authMessage.textContent = data.message;
    }
});

// CREATE ACCOUNT
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = registerFirstName.value;  
    const lastName = registerLastName.value;  
    const email = registerEmail.value;
    const password = registerPassword.value;
    const passwordConfirm = registerPasswordConfirm.value; // Get confirmation value
    const dateOfBirth = registerDOB.value; 

    // PASSWORD VALIDATION 
    if (password !== passwordConfirm) {
        authMessage.textContent = 'Passwords do not match!';
        return; // stops the function
    }

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            firstName, 
            lastName,        
            email, 
            password,          
            dateOfBirth     
        })
    });

    const data = await response.json();

    if (response.ok) {
        authMessage.textContent = 'Account created. You can now log in.';
        toggleBtn.click(); // switch back to login
    } else {
        authMessage.textContent = data.message;
    }
});
