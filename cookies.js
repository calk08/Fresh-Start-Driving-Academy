// Cookies Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Reset cookie preferences function
    function resetCookiePreferences() {
        // Remove the consent from localStorage
        console.log('Resetting cookie preferences - current value:', localStorage.getItem('fs_consent'));
        localStorage.removeItem('fs_consent');
        console.log('Cookie preferences removed - current value:', localStorage.getItem('fs_consent'));
        
        // Show confirmation message
        const button = document.querySelector('.reset-button');
        const originalText = button.textContent;
        
        button.textContent = '✅ Preferences Reset!';
        button.style.background = '#10b981';
        button.disabled = true;
        
        // Reload the page after a short delay
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
    
    // Attach event listener to reset button
    const resetButton = document.querySelector('.reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', resetCookiePreferences);
    }
    
    // Display current cookie preference status
    function displayCookieStatus() {
        const savedConsent = localStorage.getItem('fs_consent');
        const statusContainer = document.getElementById('cookie-status');
        
        // Debug logging
        console.log('Cookie status check - savedConsent:', savedConsent);
        console.log('Cookie status check - type:', typeof savedConsent);
        
        if (statusContainer) {
            let statusText = '';
            let statusClass = '';
            
            if (savedConsent === 'accepted') {
                statusText = '✅ You have accepted all cookies';
                statusClass = 'status-accepted';
            } else if (savedConsent === 'rejected') {
                statusText = '⚠️ You have rejected non-essential cookies';
                statusClass = 'status-rejected';
            } else {
                statusText = `ℹ️ No cookie preferences set (Current value: "${savedConsent}")`;
                statusClass = 'status-none';
            }
            
            statusContainer.innerHTML = `<div class="cookie-status ${statusClass}">${statusText}</div>`;
        }
    }
    
    // Call on page load
    displayCookieStatus();
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add copy to clipboard functionality for contact info
    const contactItems = document.querySelectorAll('.contact-copy');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '📋 Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.log('Could not copy text: ', err);
            });
        });
    });
});