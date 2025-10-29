// Renewed Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and forms
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            document.getElementById(targetTab + 'Form').classList.add('active');

            // Reset form when switching tabs
            resetForm(targetTab + 'Form');
        });
    });

    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Toggle icon and aria-label
            const icon = this.querySelector('i');
            const isVisible = type === 'text';
            icon.className = isVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
            this.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');
        });
    });

    // Password strength checker
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            updatePasswordStrength(this, strength);
        });
    });

    function resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            // Clear all error messages
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.style.display = 'none');

            // Reset input borders
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.style.borderColor = '#e9ecef';
            });

            // Reset password strength meter
            const strengthFill = form.querySelector('.strength-fill');
            const strengthText = form.querySelector('.strength-text');
            if (strengthFill) strengthFill.style.width = '0%';
            if (strengthText) {
                strengthText.textContent = 'Password strength';
                strengthText.style.color = 'var(--text-secondary)';
            }
        }
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        const checks = [
            password.length >= 8, // Length
            /[a-z]/.test(password), // Lowercase
            /[A-Z]/.test(password), // Uppercase
            /\d/.test(password), // Numbers
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) // Special characters
        ];

        strength = checks.filter(check => check).length;
        return strength;
    }

    function updatePasswordStrength(input, strength) {
        const container = input.closest('.form-group');
        const meter = container.querySelector('.strength-fill');
        const text = container.querySelector('.strength-text');

        if (meter && text) {
            const percentage = (strength / 5) * 100;
            meter.style.width = percentage + '%';

            const colors = ['#dc3545', '#ffc107', '#28a745'];
            const texts = ['Weak', 'Medium', 'Strong'];

            if (strength <= 2) {
                meter.style.background = colors[0];
                text.textContent = texts[0];
                text.style.color = colors[0];
            } else if (strength <= 4) {
                meter.style.background = colors[1];
                text.textContent = texts[1];
                text.style.color = colors[1];
            } else {
                meter.style.background = colors[2];
                text.textContent = texts[2];
                text.style.color = colors[2];
            }
        }
    }

    // Form validation and submission
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateLoginForm()) {
                submitForm(this, 'login');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateSignupForm()) {
                submitForm(this, 'signup');
            }
        });
    }

    function clearFormErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.style.display = 'none');

            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.style.borderColor = '#e9ecef';
            });
        }
    }

    function resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            // Clear all error messages
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.style.display = 'none');

            // Reset input borders
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.style.borderColor = '#e9ecef';
            });

            // Reset password strength meter
            const strengthFill = form.querySelector('.strength-fill');
            const strengthText = form.querySelector('.strength-text');
            if (strengthFill) strengthFill.style.width = '0%';
            if (strengthText) {
                strengthText.textContent = 'Password strength';
                strengthText.style.color = 'var(--text-secondary)';
            }
        }
    }

    function validateLoginForm() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        let isValid = true;

        // Clear previous errors
        clearFormErrors('loginForm');

        // Email validation
        if (!email) {
            showError('login-email', 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('login-email', 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (!password) {
            showError('login-password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('login-password', 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    function validateSignupForm() {
        const firstName = document.getElementById('signup-firstname').value.trim();
        const lastName = document.getElementById('signup-lastname').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const company = document.getElementById('signup-company').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const terms = document.getElementById('signup-terms').checked;
        let isValid = true;

        // Clear previous errors
        clearFormErrors('signupForm');

        // First name validation
        if (!firstName) {
            showError('signup-firstname', 'First name is required');
            isValid = false;
        } else if (firstName.length < 2) {
            showError('signup-firstname', 'First name must be at least 2 characters');
            isValid = false;
        }

        // Last name validation
        if (!lastName) {
            showError('signup-lastname', 'Last name is required');
            isValid = false;
        } else if (lastName.length < 2) {
            showError('signup-lastname', 'Last name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        if (!email) {
            showError('signup-email', 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('signup-email', 'Please enter a valid email address');
            isValid = false;
        }

        // Company validation (optional but if provided, check length)
        if (company && company.length < 2) {
            showError('signup-company', 'Company name must be at least 2 characters');
            isValid = false;
        }

        // Password validation
        if (!password) {
            showError('signup-password', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showError('signup-password', 'Password must be at least 8 characters');
            isValid = false;
        }

        // Confirm password validation
        if (!confirmPassword) {
            showError('signup-confirm-password', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('signup-confirm-password', 'Passwords do not match');
            isValid = false;
        }

        // Terms validation
        if (!terms) {
            showError('signup-terms', 'You must accept the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + '-error');

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        // Add error styling to input
        if (input) {
            input.style.borderColor = '#dc2626';
            input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
        }
    }

    function hideError(inputId) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + '-error');

        if (errorElement) {
            errorElement.classList.remove('show');
        }

        // Reset input styling
        if (input) {
            input.style.borderColor = '#e2e8f0';
            input.style.boxShadow = 'none';
        }
    }

    function submitForm(form, type) {
        const submitBtn = form.querySelector('.auth-button');
        const btnText = submitBtn.querySelector('.button-text');
        const loader = submitBtn.querySelector('.button-loader');

        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = type === 'login' ? 'Signing In...' : 'Creating Account...';
        loader.style.display = 'flex';

        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Hide loading state
            submitBtn.disabled = false;
            btnText.textContent = type === 'login' ? 'Sign In' : 'Create Account';
            loader.style.display = 'none';

            // Show success message (replace with actual success handling)
            showSuccessMessage(type === 'login' ? 'Login successful! Welcome back.' : 'Account created successfully! Please check your email for verification.');

            // Reset form on success
            setTimeout(() => {
                resetForm(type + 'Form');
            }, 2000);
        }, 2000);
    }

    function showSuccessMessage(message) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                font-weight: 500;
            ">
                <i class="fas fa-check-circle"></i> ${message}
            </div>
        `;

        document.body.appendChild(successDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Social authentication handlers
    const googleLoginBtn = document.getElementById('google-login');
    const googleSignupBtn = document.getElementById('google-signup');
    const linkedinLoginBtn = document.getElementById('linkedin-login');
    const linkedinSignupBtn = document.getElementById('linkedin-signup');

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            handleSocialAuth('Google', 'login');
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function() {
            handleSocialAuth('Google', 'signup');
        });
    }

    if (linkedinLoginBtn) {
        linkedinLoginBtn.addEventListener('click', function() {
            handleSocialAuth('LinkedIn', 'login');
        });
    }

    if (linkedinSignupBtn) {
        linkedinSignupBtn.addEventListener('click', function() {
            handleSocialAuth('LinkedIn', 'signup');
        });
    }

    function handleSocialAuth(provider, type) {
        // Show loading state
        showSuccessMessage(`${provider} authentication would be implemented here. Redirecting to ${provider} OAuth...`);

        // Simulate OAuth redirect
        setTimeout(() => {
            showSuccessMessage(`${provider} ${type} successful!`);
        }, 1500);
    }

    // Forgot password functionality
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Replace with actual forgot password implementation
            alert('Forgot password functionality would be implemented here');
        });
    }
});

// Global functions for HTML onclick handlers
function switchToLogin() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));

    document.querySelector('[data-form="loginForm"]').classList.add('active');
    document.getElementById('loginForm').classList.add('active');
}

function switchToSignup() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));

    document.querySelector('[data-form="signupForm"]').classList.add('active');
    document.getElementById('signupForm').classList.add('active');
}