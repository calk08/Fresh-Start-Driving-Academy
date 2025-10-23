// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
            nav.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Intersection Observer for Fade-in Animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    const elementsToObserve = document.querySelectorAll('.card, .testimonial, .stat');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
});

// Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message (you can customize this)
                showNotification('Message sent successfully!', 'success');
                
                // Reset form
                form.reset();
            }, 2000);
        });
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#0ea5e9'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Dynamic Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat .number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) || 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.stats');
    
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statsObserver.observe(statsSection);
    }
});

// Parallax Effect for Hero Section
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
});

// Sticky Navigation Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = currentScrollTop;
        });
    }
});

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Accordion Functionality (for FAQ sections)
document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content');
            
            // Close other accordion items
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    const otherItem = otherHeader.parentElement;
                    const otherContent = otherItem.querySelector('.accordion-content');
                    otherItem.classList.remove('active');
                    otherContent.style.maxHeight = '0';
                }
            });
            
            // Toggle current accordion item
            accordionItem.classList.toggle('active');
            
            if (accordionItem.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            } else {
                accordionContent.style.maxHeight = '0';
            }
        });
    });
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Google Reviews Integration
document.addEventListener('DOMContentLoaded', function() {
    const reviewsContainer = document.getElementById('google-reviews');
    const placeId = reviewsContainer?.getAttribute('data-place-id');
    const apiKey = 'AIzaSyAbi58PHdbyKHgPk6DOKqVplHDqxOujUJY';
    
    // Function to generate star display
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '★';
        }
        if (hasHalfStar) {
            starsHTML += '☆';
        }
        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
            starsHTML += '☆';
        }
        
        return starsHTML;
    }
    
    // Function to format relative time
    function formatRelativeTime(timestamp) {
        const now = new Date();
        const reviewDate = new Date(timestamp * 1000);
        const diffInMs = now - reviewDate;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);
        
        if (diffInDays < 7) {
            return diffInDays <= 1 ? '1 day ago' : `${diffInDays} days ago`;
        } else if (diffInWeeks < 4) {
            return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
        } else {
            return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
        }
    }
    
    // Load Google Reviews using Places API (via proxy or direct embedding)
    function loadGoogleReviews() {
        if (!placeId || !apiKey) {
            console.error('Place ID or API key missing');
            displayFallbackReviews();
            return;
        }
        
        // Initialize Google Maps Place Service
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        
        const request = {
            placeId: placeId,
            fields: ['name', 'rating', 'reviews', 'user_ratings_total']
        };
        
        service.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                displayReviews(place);
                updateRatingSummary(place);
            } else {
                console.error('Places service failed:', status);
                displayFallbackReviews();
            }
        });
    }
    
    // Display reviews from API response
    function displayReviews(placeData) {
        const reviews = placeData.reviews || [];
        
        if (reviews.length === 0) {
            displayFallbackReviews();
            return;
        }
        
        const reviewsHTML = reviews.slice(0, 3).map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <strong class="reviewer-name">${review.author_name}</strong>
                        <div class="review-stars">${generateStars(review.rating)}</div>
                    </div>
                    <span class="review-date">${formatRelativeTime(review.time)}</span>
                </div>
                <p class="review-text">"${review.text}"</p>
            </div>
        `).join('');
        
        reviewsContainer.innerHTML = reviewsHTML;
    }
    
    // Update rating summary
    function updateRatingSummary(placeData) {
        const ratingScore = document.querySelector('.rating-score');
        const ratingText = document.querySelector('.rating-text');
        
        if (ratingScore && placeData.rating) {
            ratingScore.textContent = placeData.rating.toFixed(1);
        }
        
        if (ratingText && placeData.user_ratings_total) {
            ratingText.textContent = `Based on ${placeData.user_ratings_total} Google Reviews`;
        }
    }
    
    // Fallback reviews if API fails
    function displayFallbackReviews() {
        const reviewsHTML = `
            <div class="reviews-error">
                <p>Reviews can't load at the moment.</p>
                <p>Please check back later or view our reviews directly on Google.</p>
            </div>
        `;
        
        reviewsContainer.innerHTML = reviewsHTML;
    }
    
    // Add CSS for review items
    const reviewStyles = `
        <style>
        .review-item {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border-left: 4px solid #22c55e;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.75rem;
        }
        
        .reviewer-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .reviewer-name {
            color: #1f2937;
            font-size: 1rem;
        }
        
        .review-stars {
            color: #fbbf24;
            font-size: 0.9rem;
        }
        
        .review-date {
            color: #6b7280;
            font-size: 0.85rem;
        }
        
        .review-text {
            color: #4b5563;
            line-height: 1.6;
            font-style: italic;
            margin: 0;
        }
        
        .reviews-error {
            text-align: center;
            padding: 3rem 2rem;
            color: #6b7280;
        }
        
        .reviews-error p {
            margin: 0.5rem 0;
            line-height: 1.6;
        }
        
        .reviews-error p:first-child {
            font-size: 1.1rem;
            font-weight: 600;
            color: #4b5563;
        }
        
        @media (max-width: 768px) {
            .review-header {
                flex-direction: column;
                gap: 0.5rem;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', reviewStyles);
    
    // Wait for Google Maps API to load before fetching reviews
    function initializeReviews() {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            loadGoogleReviews();
        } else {
            // If Google Maps API isn't loaded yet, wait a bit and try again
            setTimeout(initializeReviews, 1000);
        }
    }
    
    if (reviewsContainer) {
        initializeReviews();
    }
});

// Global function for Google Maps API callback
function initGoogleReviews() {
    // This will be called when the Google Maps API is fully loaded
    const reviewsContainer = document.getElementById('google-reviews');
    if (reviewsContainer && typeof loadGoogleReviews === 'function') {
        // Trigger reviews loading if the DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // Reviews will be loaded by the existing DOMContentLoaded listener
            });
        }
    }
}

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const form = e.target;
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(form);
                
                // Add recipient email and subject;
                formData.append('subject', 'Contact Request');
                
                // Format email body with all form information
                const name = formData.get('name') || 'Not provided';
                const email = formData.get('email') || 'Not provided';
                const phone = formData.get('phone') || 'Not provided';
                const service = formData.get('service') || 'Not specified';
                const message = formData.get('message') || 'No message provided';
                
                const emailBody = `
New Contact Request from Fresh Start Driving Website

Name: ${name}
Email: ${email}
Phone: ${phone}
Service Interested In: ${service}

Message:
${message}

---
This message was sent from the Fresh Start Driving Academy contact form.
                `.trim();
                
                formData.append('body', emailBody);
                
                const data = new URLSearchParams(formData); // <-- important

                const response = await fetch('https://script.google.com/macros/s/AKfycbwP-bWBj5idhcjRIOzdyVbIQntGLXK1_sZuMvaD7qHxD8AIKy_H4DLQ3zCAInP2Vho3/exec', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: data
                });

                if (response.ok) {
                    // Success message
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.backgroundColor = '#10b981';
                    form.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    // Error message
                    submitBtn.textContent = 'Failed: ' + response.statusText;
                    submitBtn.style.backgroundColor = '#ef4444';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 3000);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                
                // Error message
                submitBtn.textContent = 'Error';
                submitBtn.style.backgroundColor = '#ef4444';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
});