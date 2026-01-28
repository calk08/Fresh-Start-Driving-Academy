// Dynamic Hero Height Adjustment for Mobile
function setHeroHeight() {
    const hero = document.querySelector('.hero');
    const header = document.querySelector('.header');
    
    if (hero && header) {
        // Get the actual viewport height
        const viewportHeight = window.innerHeight;
        
        // Get the header height
        const headerHeight = header.offsetHeight;
        
        // Calculate available height for hero (viewport - header)
        const heroHeight = viewportHeight - headerHeight;
        
        // Set the hero min-height using inline style (overrides CSS)
        hero.style.minHeight = `${heroHeight}px`;
    }
}

// Show Remembrance Poppy in November only
function checkNovemberPoppy() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0 = January, 10 = November
    const poppy = document.getElementById('remembrancePoppy');
    
    if (poppy && currentMonth === 10) { // November is month 10 (0-indexed)
        poppy.classList.add('show-november');
    }
}

// Ensure hero video plays immediately
function initHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // Force play the video
        heroVideo.play().catch(error => {
            console.log('Video autoplay prevented:', error);
        });
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', function() {
    setHeroHeight();
    checkNovemberPoppy();
    initHeroVideo();
});

// Run on resize (handles orientation changes and window resizing)
window.addEventListener('resize', function() {
    setHeroHeight();
});

// Run on orientation change (specific to mobile devices)
window.addEventListener('orientationchange', function() {
    // Small delay to allow browser to recalculate dimensions
    setTimeout(setHeroHeight, 100);
});

// Student Images Carousel
document.addEventListener('DOMContentLoaded', async function() {
    const track = document.querySelector('.carousel-track');
    
    if (!track) return;
    
    const imagePath = 'images/student-imgs/';
    const supportedFormats = ['webp', 'jpg', 'jpeg', 'png'];
    
    // Function to check if an image exists
    function imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    // Function to find an image with any supported format
    async function findImage(index) {
        for (const format of supportedFormats) {
            const url = `${imagePath}student ${index}.${format}`;
            if (await imageExists(url)) {
                return url;
            }
        }
        return null;
    }
    
    // Automatically detect all student images
    async function loadStudentImages() {
        const loadedImages = [];
        let index = 1;
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 3; // Stop after 3 missing images in a row
        
        while (consecutiveFailures < maxConsecutiveFailures) {
            const imageUrl = await findImage(index);
            
            if (imageUrl) {
                loadedImages.push({ url: imageUrl, index: index });
                consecutiveFailures = 0; // Reset on success
            } else {
                consecutiveFailures++;
            }
            
            index++;
            
            // Safety limit to prevent infinite loops
            if (index > 100) break;
        }
        
        return loadedImages;
    }
    
    // Load images and build carousel
    const studentImages = await loadStudentImages();
    
    if (studentImages.length === 0) {
        console.log('No student images found in images/student-imgs/');
        return;
    }
    
    console.log(`Loaded ${studentImages.length} student images automatically`);
    
    // Create image elements
    studentImages.forEach(({ url, index }) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Happy student ${index} after passing their driving test`;
        img.className = 'student-image';
        img.loading = 'lazy';
        track.appendChild(img);
    });
    
    const images = document.querySelectorAll('.student-image');
    
    if (images.length === 0) return;
    
    let currentIndex = 0;
    const totalImages = images.length;
    let isTransitioning = false;
    
    // Clone images multiple times for seamless infinite scroll
    // Clone three times to ensure smooth continuous looping
    for (let i = 0; i < 3; i++) {
        images.forEach(img => {
            const clone = img.cloneNode(true);
            track.appendChild(clone);
        });
    }
    
    const allImages = track.querySelectorAll('.student-image');
    
    function updateCarousel(instant = false) {
        // Calculate transform to center the middle image
        const imageWidth = allImages[0].offsetWidth;
        // Dynamically calculate gap from computed styles
        const computedStyle = window.getComputedStyle(track);
        const gap = parseInt(computedStyle.gap) || 32;
        const offset = currentIndex * (imageWidth + gap);
        
        if (instant) {
            // Disable transitions on track AND all images
            track.style.transition = 'none';
            allImages.forEach(img => {
                img.style.transition = 'none';
            });
            
            // Update position - start from left:50%, move left by offset, then center the current image
            track.style.transform = `translateX(calc(-${offset}px - ${imageWidth / 2}px))`;
            
            // Remove all classes first
            allImages.forEach(img => {
                img.classList.remove('center', 'side');
            });
            
            // Calculate visible images (current, left, right)
            const centerIndex = currentIndex;
            const leftIndex = currentIndex - 1;
            const rightIndex = currentIndex + 1;
            
            // Add classes to visible images
            if (allImages[centerIndex]) allImages[centerIndex].classList.add('center');
            if (allImages[leftIndex] && leftIndex >= 0) allImages[leftIndex].classList.add('side');
            if (allImages[rightIndex]) allImages[rightIndex].classList.add('side');
            
            // Force reflow
            void track.offsetHeight;
            
            // Re-enable transitions after a brief delay
            setTimeout(() => {
                track.style.transition = 'transform 0.6s ease-in-out';
                allImages.forEach(img => {
                    img.style.transition = '';
                });
            }, 50);
        } else {
            // Remove all classes first
            allImages.forEach(img => {
                img.classList.remove('center', 'side');
            });
            
            // Calculate visible images (current, left, right)
            const centerIndex = currentIndex;
            const leftIndex = currentIndex - 1;
            const rightIndex = currentIndex + 1;
            
            // Add classes to visible images
            if (allImages[centerIndex]) allImages[centerIndex].classList.add('center');
            if (allImages[leftIndex] && leftIndex >= 0) allImages[leftIndex].classList.add('side');
            if (allImages[rightIndex]) allImages[rightIndex].classList.add('side');
            
            // Animate transform - start from left:50%, move left by offset, then center the current image
            track.style.transform = `translateX(calc(-${offset}px - ${imageWidth / 2}px))`;
        }
    }
    
    function moveRight() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex++;
        updateCarousel(false);
        
        // After animation completes, check if we need to reset
        setTimeout(() => {
            // If we've gone past the second set, reset to equivalent position in middle set
            if (currentIndex >= totalImages * 2) {
                // Instantly jump to the equivalent position (first image of middle set)
                currentIndex = totalImages;
                updateCarousel(true);
            }
            isTransitioning = false;
        }, 650);
    }
    
    // Initialize carousel - start at the middle set of cloned images
    currentIndex = totalImages;
    updateCarousel(true);
    
    // Auto-scroll every 3 seconds
    setInterval(moveRight, 3000);
    
    // Update on window resize
    window.addEventListener('resize', () => {
        if (!isTransitioning) {
            updateCarousel(true);
        }
    });
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
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
        const originalText = counter.textContent;
        const suffix = originalText.replace(/^\d+/, ''); // Extract any suffix like %
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        // Check if this is the star rating counter
        const isStarRating = counter.closest('.stat').querySelector('.label').textContent.toLowerCase().includes('star');
        let starsContainer = null;
        
        if (isStarRating) {
            // Create stars container if it doesn't exist
            starsContainer = counter.closest('.stat').querySelector('.stars-display');
            if (!starsContainer) {
                starsContainer = document.createElement('div');
                starsContainer.className = 'stars-display';
                starsContainer.style.cssText = `
                    margin-top: 0.5rem;
                    font-size: 1.5rem;
                    color: #16a34a;
                    line-height: 1;
                `;
                counter.parentNode.insertBefore(starsContainer, counter.nextSibling);
            }
        }
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                const currentValue = Math.floor(current);
                counter.textContent = currentValue + suffix;
                
                // Update stars if this is star rating
                if (isStarRating && starsContainer) {
                    const starsToShow = Math.min(currentValue, 5); // Cap at 5 stars
                    starsContainer.textContent = '★'.repeat(starsToShow);
                }
                
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
                
                // Final stars update
                if (isStarRating && starsContainer) {
                    const starsToShow = Math.min(target, 5); // Cap at 5 stars
                    starsContainer.textContent = '★'.repeat(starsToShow);
                }
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.stats');
    console.log('Stats section found:', statsSection);
    
    if (statsSection) {
        // Also trigger immediately to ensure visibility
        setTimeout(() => {
            animateCounters();
        }, 500);
        
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Stats section is visible, animating counters');
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
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
        
        const reviewsHTML = reviews.slice(0, 3).map(review => {
            const textData = truncateReviewText(review.text);
            const moreButton = textData.truncated ? 
                `<span class="review-text-more">... <button class="read-more-btn">more...</button></span><span class="review-text-full" style="display:none;">${textData.fullText} <button class="read-less-btn">back</button></span>` : '';
            return `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <strong class="reviewer-name">${review.author_name}</strong>
                        <div class="review-stars">${generateStars(review.rating)}</div>
                    </div>
                    <span class="review-date">${formatRelativeTime(review.time)}</span>
                </div>
                <p class="review-text">
                    "<span class="review-text-content">${textData.text}</span>${moreButton}"
                </p>
            </div>
        `;
        }).join('');
        
        reviewsContainer.innerHTML = reviewsHTML;
        
        // Add click handlers using event delegation for "more" and "less" buttons
        reviewsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('read-more-btn')) {
                const reviewText = e.target.closest('.review-text');
                const truncatedContent = reviewText.querySelector('.review-text-content');
                const moreSpan = reviewText.querySelector('.review-text-more');
                const fullText = reviewText.querySelector('.review-text-full');
                
                truncatedContent.style.display = 'none';
                moreSpan.style.display = 'none';
                fullText.style.display = 'inline';
            } else if (e.target.classList.contains('read-less-btn')) {
                const reviewText = e.target.closest('.review-text');
                const truncatedContent = reviewText.querySelector('.review-text-content');
                const moreSpan = reviewText.querySelector('.review-text-more');
                const fullText = reviewText.querySelector('.review-text-full');
                
                truncatedContent.style.display = 'inline';
                moreSpan.style.display = 'inline';
                fullText.style.display = 'none';
            }
        });
        
        // Initialize reviews carousel
        initReviewsCarousel();
    }
    
    // Reviews carousel functionality
    function initReviewsCarousel() {
        const reviewsContainer = document.getElementById('google-reviews');
        const prevBtn = document.querySelector('.review-nav-prev');
        const nextBtn = document.querySelector('.review-nav-next');
        
        if (!reviewsContainer || !prevBtn || !nextBtn) return;
        
        const originalItems = Array.from(reviewsContainer.querySelectorAll('.review-item'));
        if (originalItems.length === 0) return;
        
        const totalReviews = originalItems.length;
        
        // Clone reviews for infinite loop (prepend and append copies)
        originalItems.forEach(item => {
            const cloneBefore = item.cloneNode(true);
            const cloneAfter = item.cloneNode(true);
            reviewsContainer.insertBefore(cloneBefore, reviewsContainer.firstChild);
            reviewsContainer.appendChild(cloneAfter);
        });
        
        let currentIndex = totalReviews; // Start at the first original review
        let isTransitioning = false;
        
        function updateCarousel(instant = false) {
            const containerWidth = reviewsContainer.parentElement.offsetWidth;
            const offset = currentIndex * containerWidth;
            
            // Force each review item to be exactly the container width
            const allReviewItems = reviewsContainer.querySelectorAll('.review-item');
            allReviewItems.forEach(item => {
                item.style.width = `${containerWidth}px`;
                item.style.minWidth = `${containerWidth}px`;
                item.style.maxWidth = `${containerWidth}px`;
            });
            
            if (instant) {
                reviewsContainer.style.transition = 'none';
                reviewsContainer.style.transform = `translateX(-${offset}px)`;
                // Force reflow
                void reviewsContainer.offsetHeight;
                setTimeout(() => {
                    reviewsContainer.style.transition = 'transform 0.5s ease-in-out';
                }, 20);
            } else {
                reviewsContainer.style.transform = `translateX(-${offset}px)`;
            }
        }
        
        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex--;
            updateCarousel(false);
            
            setTimeout(() => {
                // If we're at the first cloned set, jump to the last original
                if (currentIndex < totalReviews) {
                    currentIndex = totalReviews * 2 - 1;
                    updateCarousel(true);
                }
                isTransitioning = false;
            }, 500);
        });
        
        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex++;
            updateCarousel(false);
            
            setTimeout(() => {
                // If we're at the last cloned set, jump to the first original
                if (currentIndex >= totalReviews * 2) {
                    currentIndex = totalReviews;
                    updateCarousel(true);
                }
                isTransitioning = false;
            }, 500);
        });
        
        // Initial state
        updateCarousel(true);
        
        // Update on window resize
        window.addEventListener('resize', () => updateCarousel(true));
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
    if (reviewsContainer) {
        // Wait for Google Maps API to be fully ready
        function waitForGoogleMaps() {
            if (typeof google !== 'undefined' && google.maps && google.maps.places) {
                // Initialize the reviews loading function if it exists
                const apiKey = 'AIzaSyAbi58PHdbyKHgPk6DOKqVplHDqxOujUJY';
                const placeId = reviewsContainer.getAttribute('data-place-id');
                
                if (placeId && apiKey) {
                    // Load reviews directly
                    loadGoogleReviewsWithAPI(placeId, apiKey);
                } else {
                    console.error('Place ID or API key missing for Google Reviews');
                }
            } else {
                // If Google Maps API isn't loaded yet, wait a bit and try again
                setTimeout(waitForGoogleMaps, 500);
            }
        }
        
        waitForGoogleMaps();
    }
}

// Helper function to load reviews with Google Places API
function loadGoogleReviewsWithAPI(placeId, apiKey) {
    const reviewsContainer = document.getElementById('google-reviews');
    if (!reviewsContainer) return;
    
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

// Function to display reviews from API response
function displayReviews(placeData) {
    const reviewsContainer = document.getElementById('google-reviews');
    if (!reviewsContainer) return;
    
    const reviews = placeData.reviews || [];
    
    if (reviews.length === 0) {
        displayFallbackReviews();
        return;
    }
    
    const reviewsHTML = reviews.slice(0, 3).map(review => {
        const textData = truncateReviewText(review.text);
        const moreButton = textData.truncated ? 
            `<span class="review-text-more">... <button class="read-more-btn">more</button></span><span class="review-text-full" style="display:none;">${textData.fullText} <button class="read-less-btn">&lt;</button></span>` : '';
        return `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <strong class="reviewer-name">${review.author_name}</strong>
                    <div class="review-stars">${generateStars(review.rating)}</div>
                </div>
                <span class="review-date">${formatRelativeTime(review.time)}</span>
            </div>
            <p class="review-text">
                "<span class="review-text-content">${textData.text}</span>${moreButton}"
            </p>
        </div>
    `;
    }).join('');
    
    reviewsContainer.innerHTML = reviewsHTML;
    
    // Add click handlers using event delegation for "more" and "less" buttons
    reviewsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('read-more-btn')) {
            const reviewText = e.target.closest('.review-text');
            const truncatedContent = reviewText.querySelector('.review-text-content');
            const moreSpan = reviewText.querySelector('.review-text-more');
            const fullText = reviewText.querySelector('.review-text-full');
            
            truncatedContent.style.display = 'none';
            moreSpan.style.display = 'none';
            fullText.style.display = 'inline';
        } else if (e.target.classList.contains('read-less-btn')) {
            const reviewText = e.target.closest('.review-text');
            const truncatedContent = reviewText.querySelector('.review-text-content');
            const moreSpan = reviewText.querySelector('.review-text-more');
            const fullText = reviewText.querySelector('.review-text-full');
            
            truncatedContent.style.display = 'inline';
            moreSpan.style.display = 'inline';
            fullText.style.display = 'none';
        }
    });
    
    // Initialize reviews carousel
    initReviewsCarousel();
}

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

// Function to truncate review text to 25 words
function truncateReviewText(text, maxWords = 25) {
    const words = text.split(' ');
    if (words.length <= maxWords) {
        return { truncated: false, text: text };
    }
    const truncated = words.slice(0, maxWords).join(' ');
    return { truncated: true, text: truncated, fullText: text };
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
    // Instead of showing error message, show the hardcoded reviews
    const reviewsContainer = document.getElementById('google-reviews');
    const fallbackReviews = document.getElementById('fallback-reviews');

    if (reviewsContainer && fallbackReviews) {
        // Hide the loading/error state and show fallback reviews
        reviewsContainer.style.display = 'none';
        fallbackReviews.style.display = 'flex';
        console.log('Google reviews API failed, showing hardcoded fallback reviews');
    }
}

// Contact Form Initialization Function
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Remove any existing event listeners by cloning the element
        const newContactForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newContactForm, contactForm);
        
        newContactForm.addEventListener('submit', async (e) => {
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

                const response = await fetch('https://script.google.com/macros/s/AKfycbwYA-28iheInJypkAzo-bsRlC10KGHZnOYj1SD7t-1_HX4Q67it_PV1Ws1gxwtnQuhr/exec', {
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
}

// Initialize contact form on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

/* ========================================
   COOKIES PAGE JAVASCRIPT
   ======================================== */

// Cookies Page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Reset cookie preferences function
    function resetCookiePreferences() {
        // Remove the consent from localStorage
        console.log('Resetting cookie preferences - current value:', localStorage.getItem('fs_consent'));
        localStorage.removeItem('fs_consent');
        console.log('Cookie preferences removed - current value:', localStorage.getItem('fs_consent'));
        
        // Show confirmation message
        const button = document.querySelector('.reset-button');
        if (button) {
            const originalText = button.textContent;
            
            button.textContent = '✅ Preferences Reset!';
            button.style.background = '#10b981';
            button.disabled = true;
            
            // Reload the page after a short delay
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
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
                statusText = 'You have accepted all cookies';
                statusClass = 'status-accepted';
            } else if (savedConsent === 'rejected') {
                statusText = 'You have rejected non-essential cookies';
                statusClass = 'status-rejected';
            } else {
                statusText = `No cookie preferences set (Current value: "${savedConsent}")`;
                statusClass = 'status-none';
            }
            
            statusContainer.innerHTML = `<div class="cookie-status ${statusClass}">${statusText}</div>`;
        }
    }
    
    // Call cookie status display on page load
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
                this.innerHTML = 'Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.log('Could not copy text: ', err);
            });
        });
    });

    // Header scroll animation
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 10);
        }
    });

    // Traffic Light CTA Animation - DISABLED (using new glow animation sequence)
    // function animateTrafficLightCTAs() {
    //     const ctaButtons = document.querySelectorAll('.traffic-light-cta');
    //     
    //     ctaButtons.forEach((cta, index) => {
    //         const delay = parseInt(cta.getAttribute('data-delay')) || (index * 200);
    //         
    //         setTimeout(() => {
    //             cta.classList.add('expanded');
    //         }, delay + 1000); // Start after 1 second delay
    //     });
    // }

    // Trigger animation when hero section is visible - DISABLED
    // const heroSection = document.querySelector('.hero');
    // if (heroSection) {
    //     const heroObserver = new IntersectionObserver(function(entries) {
    //         entries.forEach(entry => {
    //             if (entry.isIntersecting) {
    //                 setTimeout(() => {
    //                     animateTrafficLightCTAs();
    //                 }, 500);
    //                 heroObserver.unobserve(entry.target);
    //             }
    //         });
    //     }, {
    //         threshold: 0.3
    //     });
    //     
    //     heroObserver.observe(heroSection);
    // }
});

// Service Modal System
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('serviceModal');
    const modalBody = modal.querySelector('.modal-body');
    const closeBtn = modal.querySelector('.modal-close');
    const serviceCards = document.querySelectorAll('.card[data-service]');
    
    // Service content data
    const serviceContent = {
        manual: {
            title: 'Manual Driving Lessons',
            intro: 'Master the art of manual driving with comprehensive instruction covering all 27 essential driving skills required for safe, confident driving.',
            sections: [
                {
                    heading: 'What You\'ll Learn',
                    content: `<ul>
                        <li>Complete mastery of clutch control and gear changes</li>
                        <li>All 27 official driving skills from the DVSA curriculum</li>
                        <li>Advanced car control and positioning techniques</li>
                        <li>Safe observation, signalling and planning</li>
                        <li>Junctions, roundabouts and pedestrian crossings</li>
                        <li>Essential manoeuvres including reversing, parking and turning</li>
                        <li>Different road types: country roads, dual carriageways, and motorway preparation</li>
                        <li>Driving in various conditions: night driving and adverse weather</li>
                    </ul>`
                },
                {heading: 'Check out the 27 skills you will learn',
                content: '<p>For a detailed breakdown of the 27 essential driving skills covered in our manual lessons, please visit our <a href="driving-skills.html" target="_blank" rel="noopener noreferrer" class="modal-inline-btn">Driving Skills page</a>.</p>'
                },
                {
                    heading: 'Why Choose Manual?',
                    content: `<p>Learning to drive a manual car offers several advantages:</p>
                    <ul>
                        <li>Greater vehicle control and understanding of how cars work</li>
                        <li>More flexibility - you can drive both manual and automatic vehicles</li>
                        <li>Often more economical to run and maintain</li>
                        <li>Better for driving in challenging conditions</li>
                        <li>Increased concentration and engagement with driving</li>
                    </ul>`
                },
                {
                    heading: 'Our Approach',
                    content: `<p>At Fresh Start Driving Academy, we combine professional ADI instruction with structured practice. Our specially trained instructors have the experience, knowledge and teaching skills to help you master all 27 skills properly.</p>
                    <p>We recommend combining regular lessons with supervised practice with family or friends once you reach the appropriate level - students who do this consistently perform better on their driving test.</p>`
                }
            ]
        },
        intensive: {
            title: 'Intensive Driving Courses',
            intro: 'Fast-track your journey to becoming a licensed driver with our concentrated, focused training programs designed to get you test-ready quickly.',
            sections: [
                {
                    heading: 'Course Overview',
                    content: `<p>Our intensive courses compress weeks of traditional lessons into a concentrated period of focused learning, typically ranging from a few days to two weeks.</p>
                    <ul>
                        <li>Accelerated learning schedule with extended daily sessions</li>
                        <li>Complete coverage of all 27 DVSA driving skills</li>
                        <li>Structured progression from basics to test standard</li>
                        <li>Test booking included (subject to availability)</li>
                        <li>Flexible course durations: 20, 30, or 40-hour options</li>
                    </ul>`
                },
                {
                    heading: 'Who Is This For?',
                    content: `<ul>
                        <li>Complete beginners ready for immersive learning</li>
                        <li>Learners who have had some lessons but need to pass quickly</li>
                        <li>People with time constraints (career changes, relocation, etc.)</li>
                        <li>Those who prefer concentrated focus over weeks of spread-out lessons</li>
                        <li>Students who learn better with daily repetition and practice</li>
                    </ul>`
                },
                {
                    heading: 'What\'s Included',
                    content: `<p>Each intensive course includes:</p>
                    <ul>
                        <li>Comprehensive training covering all essential driving skills</li>
                        <li>Theory test support and guidance (if needed)</li>
                        <li>Mock driving test before the real assessment</li>
                        <li>Use of modern, well-maintained vehicles</li>
                        <li>Professional ADI instruction throughout</li>
                        <li>Test day vehicle and accompaniment to test center</li>
                    </ul>`
                },
                {
                    heading: 'Success Factors',
                    content: `<p>To maximize your chances of success on an intensive course:</p>
                    <ul>
                        <li>Ensure you've passed your theory test before starting</li>
                        <li>Be prepared for long days of concentrated learning</li>
                        <li>Get plenty of rest between sessions</li>
                        <li>Stay focused and committed throughout the course</li>
                        <li>Be ready to learn and adapt quickly</li>
                    </ul>
                    <p><strong>Note:</strong> While intensive courses can be highly effective, they require dedication and may not suit everyone's learning style. We'll assess your readiness during the initial consultation.</p>`
                }
            ]
        },
        refresher: {
            title: 'Refresher Driving Lessons',
            intro: 'Regain your confidence and update your driving skills with tailored refresher lessons designed for licensed drivers returning to the road.',
            sections: [
                {
                    heading: 'Who Needs Refresher Lessons?',
                    content: `<ul>
                        <li>Drivers who haven't been behind the wheel for months or years</li>
                        <li>Those who feel anxious or lacking confidence when driving</li>
                        <li>Drivers relocating to unfamiliar areas or road conditions</li>
                        <li>People preparing for motorway driving for the first time</li>
                        <li>Anyone wanting to improve specific skills or overcome bad habits</li>
                        <li>Older drivers wanting to ensure they maintain safe driving standards</li>
                    </ul>`
                },
                {
                    heading: 'What We Cover',
                    content: `<p>Refresher lessons are fully customized to your needs, but commonly include:</p>
                    <ul>
                        <li>Confidence building in familiar and new environments</li>
                        <li>Modern road rule updates and highway code changes</li>
                        <li>Advanced manoeuvres and parking techniques</li>
                        <li>Motorway and dual carriageway driving</li>
                        <li>Night driving and adverse weather conditions</li>
                        <li>Defensive driving techniques</li>
                        <li>Navigation and route planning skills</li>
                        <li>Eco-friendly and fuel-efficient driving</li>
                    </ul>`
                },
                {
                    heading: 'Flexible Approach',
                    content: `<p>Every refresher program is tailored to you:</p>
                    <ul>
                        <li><strong>Assessment Session:</strong> We start with an evaluation drive to identify areas for improvement</li>
                        <li><strong>Custom Schedule:</strong> Book single lessons or blocks based on your needs</li>
                        <li><strong>Your Pace:</strong> Progress at a speed that's comfortable for you</li>
                        <li><strong>Focus Areas:</strong> Concentrate on specific skills or situations that concern you</li>
                        <li><strong>Local Knowledge:</strong> Learn routes and areas relevant to your daily driving</li>
                    </ul>`
                },
                {
                    heading: 'Benefits of Refresher Training',
                    content: `<ul>
                        <li>Rebuild confidence and reduce driving anxiety</li>
                        <li>Learn modern techniques and road rule updates</li>
                        <li>Develop defensive driving skills for safer journeys</li>
                        <li>Break bad habits developed over years</li>
                        <li>Prepare for challenging driving situations</li>
                        <li>Peace of mind for you and your family</li>
                    </ul>
                    <p>Our experienced instructors create a supportive, non-judgmental environment to help you rediscover your driving confidence.</p>`
                }
            ]
        },
        consulting: {
            title: 'Driving Consulting Services',
            intro: 'Expert guidance and personalized consultation to help you navigate the complexities of learning to drive, test preparation, and driving lesson planning.',
            sections: [
                {
                    heading: 'What We Offer',
                    content: `<ul>
                        <li>Personalized learning path development based on your goals and experience</li>
                        <li>Theory test preparation strategies and study plans</li>
                        <li>Practical test readiness assessments</li>
                        <li>Guidance on choosing the right lesson type and frequency</li>
                        <li>Mock test analysis and improvement recommendations</li>
                        <li>Help understanding DVSA requirements and standards</li>
                        <li>Advice on managing test anxiety and building confidence</li>
                    </ul>`
                },
                {
                    heading: 'Who Benefits Most',
                    content: `<p>Our consulting services are ideal for:</p>
                    <ul>
                        <li>Complete beginners unsure where to start</li>
                        <li>Learners who have failed previous tests and need strategic guidance</li>
                        <li>People with limited time who need optimized learning plans</li>
                        <li>Students struggling with specific aspects of driving</li>
                        <li>Anyone wanting professional advice before committing to lessons</li>
                        <li>Parents helping their children learn to drive</li>
                    </ul>`
                },
                {
                    heading: 'Consultation Process',
                    content: `<p>Our structured approach ensures you get actionable advice:</p>
                    <ul>
                        <li><strong>Initial Assessment:</strong> Discuss your goals, experience, and concerns</li>
                        <li><strong>Skill Evaluation:</strong> If you have experience, we assess your current abilities</li>
                        <li><strong>Custom Strategy:</strong> Develop a tailored plan to achieve your goals efficiently</li>
                        <li><strong>Resource Recommendations:</strong> Suggest study materials, practice resources, and tools</li>
                        <li><strong>Ongoing Support:</strong> Follow-up consultations to track progress and adjust plans</li>
                    </ul>`
                },
                {
                    heading: 'Why Expert Advice Matters',
                    content: `<p>Learning to drive is a significant investment of time and money. Professional consulting helps you:</p>
                    <ul>
                        <li>Avoid common pitfalls and wasted lessons</li>
                        <li>Understand realistic timelines for test readiness</li>
                        <li>Make informed decisions about lesson types and intensity</li>
                        <li>Identify and address weaknesses early</li>
                        <li>Maximize the effectiveness of your practice time</li>
                        <li>Build a structured path from beginner to test pass</li>
                    </ul>
                    <p>With 17 years of experience and a 100% pass rate, we know what works and can guide you toward success efficiently.</p>`
                }
            ]
        }
    };
    
    // Open modal when card is clicked
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceType = this.dataset.service;
            const content = serviceContent[serviceType];
            
            if (content) {
                // Build modal content
                let html = `
                    <h2>${content.title}</h2>
                    <p style="font-size: 1.15rem; color: #334155; margin-bottom: 2rem;">${content.intro}</p>
                `;
                
                content.sections.forEach(section => {
                    html += `
                        <h3>${section.heading}</h3>
                        ${section.content}
                    `;
                });
                
                html += `
                    <a href="#contact" class="modal-cta" onclick="document.getElementById('serviceModal').classList.remove('active'); document.body.classList.remove('modal-open'); document.body.style.overflow = '';">Book This Service</a>
                `;
                
                modalBody.innerHTML = html;
                modal.classList.add('active');
                document.body.classList.add('modal-open');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        }
    });
});

// Skill Cards Shadow Control
document.addEventListener('DOMContentLoaded', function() {
    const skillWrappers = document.querySelectorAll('.skill-card-wrapper');
    
    if (skillWrappers.length === 0) return;
    
    function updateShadows() {
        const viewportHeight = window.innerHeight;
        
        // Find all sticky cards (ones stuck at viewport bottom)
        const stickyCards = [];
        
        skillWrappers.forEach((wrapper, index) => {
            const rect = wrapper.getBoundingClientRect();
            // Card is sticky if its bottom is at or near viewport bottom
            const isSticky = rect.bottom >= viewportHeight - 5;
            
            if (isSticky) {
                stickyCards.push({ wrapper, index });
            }
        });
        
        // Apply shadows
        skillWrappers.forEach((wrapper, index) => {
            const card = wrapper.querySelector('.skill-card');
            if (!card) return;
            
            // Find position in sticky cards array
            const stickyIndex = stickyCards.findIndex(s => s.index === index);
            
            if (stickyIndex === -1) {
                // Card is NOT sticky (settled in place) - show shadow
                card.classList.add('shadow-active');
            } else if (stickyIndex < 2) {
                // Top 2 sticky cards - show shadow
                card.classList.add('shadow-active');
            } else {
                // Remaining sticky cards (3rd and beyond) - no shadow
                card.classList.remove('shadow-active');
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateShadows, { passive: true });
    
    // Initial check
    updateShadows();
});