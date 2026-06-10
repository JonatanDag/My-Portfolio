// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Validate form data
    const validationError = validateForm(formData);
    if (validationError) {
        showNotification(validationError, 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(submitBtn, true);
    
    try {
        // Send using FormSubmit.co (free service)
        await sendViaFormSubmit(formData);
        
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to send message. Please try again or contact me directly.', 'error');
    } finally {
        // Reset button state
        setLoadingState(submitBtn, false, originalBtnText);
    }
}

function validateForm(data) {
    if (data.name.length < 2) {
        return 'Please enter your full name';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return 'Please enter a valid email address';
    }
    
    if (data.subject.length < 3) {
        return 'Please enter a subject (minimum 3 characters)';
    }
    
    if (data.message.length < 10) {
        return 'Please enter a message (minimum 10 characters)';
    }
    
    return null;
}

function setLoadingState(button, isLoading, originalText = '') {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i> Sending...
            <i class="fas fa-arrow-right" style="margin-left: 0.5rem; opacity: 0;"></i>
        `;
    } else {
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

async function sendViaFormSubmit(formData) {
    // Create a hidden form for FormSubmit
    const hiddenForm = document.createElement('form');
    hiddenForm.style.display = 'none';
    hiddenForm.method = 'POST';
    hiddenForm.action = 'https://formsubmit.co/yonatandagnachew5@gmail.com'; // You'll change this in Step 4
    hiddenForm.target = '_blank';
    
    // Add form fields
    const fields = {
        'name': formData.name,
        'email': formData.email,
        'subject': formData.subject,
        'message': formData.message,
        '_subject': `Portfolio Contact: ${formData.subject}`,
        '_template': 'table',
        '_captcha': 'false'
    };
    
    for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        hiddenForm.appendChild(input);
    }
    
    // Submit the form
    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
    document.body.removeChild(hiddenForm);
    
    // Small delay for better user experience
    await new Promise(resolve => setTimeout(resolve, 1000));
}

function showNotification(message, type = 'info') {
    // Remove old notification
    const oldNotification = document.querySelector('.form-notification');
    if (oldNotification) oldNotification.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    
    // Style based on type
    let bgColor, textColor, icon;
    if (type === 'success') {
        bgColor = 'rgba(16, 185, 129, 0.1)';
        textColor = '#10b981';
        icon = 'fa-check-circle';
    } else if (type === 'error') {
        bgColor = 'rgba(239, 68, 68, 0.1)';
        textColor = '#ef4444';
        icon = 'fa-exclamation-circle';
    } else {
        bgColor = 'rgba(59, 130, 246, 0.1)';
        textColor = '#3b82f6';
        icon = 'fa-info-circle';
    }
    
    notification.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background-color: ${bgColor};
        color: ${textColor};
        border: 1px solid ${textColor}20;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
    // Add to form
    const form = document.querySelector('.contact-form');
    form.insertBefore(notification, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .fa-spinner { animation: spin 1s linear infinite; }
    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
`;
document.head.appendChild(style);