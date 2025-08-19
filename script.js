// Love Gift Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the love gift experience
    initLoveGift();
    
    // Initialize floating hearts animation
    initFloatingHearts();
    
    // Initialize accessibility features
    initAccessibility();
});

function initLoveGift() {
    const giftBox = document.getElementById('giftBox');
    const surpriseContent = document.getElementById('surpriseContent');
    const giftLink = document.getElementById('giftLink');
    
    if (!giftBox || !surpriseContent) return;
    
    let isOpened = false;
    
    // Gift box click handler
    giftBox.addEventListener('click', function() {
        if (isOpened) return;
        
        // Mark as opened
        isOpened = true;
        
        // Add opened class for lid animation
        giftBox.classList.add('opened');
        
        // Play gift opening sound (if available)
        playGiftSound();
        
        // Hide the click hint
        const clickHint = giftBox.querySelector('.click-hint');
        if (clickHint) {
            clickHint.style.opacity = '0';
            setTimeout(() => {
                clickHint.style.display = 'none';
            }, 300);
        }
        
        // Show surprise content after lid animation
        setTimeout(() => {
            giftBox.style.display = 'none';
            surpriseContent.classList.add('revealed');
            
            // Create celebration particles
            createCelebrationParticles();
            
            // Focus on the gift link for accessibility
            if (giftLink) {
                setTimeout(() => {
                    giftLink.focus();
                }, 1500);
            }
        }, 800);
    });
    
    // Keyboard accessibility
    giftBox.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            giftBox.click();
        }
    });
    
    // Add tabindex for keyboard navigation
    giftBox.setAttribute('tabindex', '0');
    giftBox.setAttribute('role', 'button');
    giftBox.setAttribute('aria-label', 'Click to open your special gift');
}

function initFloatingHearts() {
    // Add random movement to floating hearts
    const hearts = document.querySelectorAll('.floating-hearts .heart');
    
    hearts.forEach((heart, index) => {
        // Random initial position adjustment
        const randomX = Math.random() * 20 - 10; // -10 to 10
        const randomY = Math.random() * 20 - 10; // -10 to 10
        
        heart.style.transform = `translate(${randomX}px, ${randomY}px)`;
        
        // Add interactive hover effect
        heart.addEventListener('mouseenter', function() {
            this.style.transform = `translate(${randomX}px, ${randomY}px) scale(1.5)`;
            this.style.transition = 'transform 0.3s ease';
        });
        
        heart.addEventListener('mouseleave', function() {
            this.style.transform = `translate(${randomX}px, ${randomY}px) scale(1)`;
        });
    });
}

function initAccessibility() {
    // Improve focus visibility
    const focusableElements = document.querySelectorAll('a, button, [tabindex]');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '3px solid var(--love-primary)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add screen reader announcements
    addScreenReaderAnnouncements();
}

function playGiftSound() {
    // Create a simple celebration sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a simple bell-like sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Web Audio API not supported');
    }
}

function createCelebrationParticles() {
    const colors = ['#ff6b9d', '#ff8fab', '#ffd93d', '#ffb3ba'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        // Random starting position around the center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const startX = centerX + (Math.random() - 0.5) * 100;
        const startY = centerY + (Math.random() - 0.5) * 100;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        const animation = particle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${(Math.random() - 0.5) * 400}px, ${Math.random() * -300}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
        
        // Remove particle after animation
        animation.addEventListener('finish', () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
    }
}

function addScreenReaderAnnouncements() {
    // Create a live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    
    document.body.appendChild(liveRegion);
    
    // Announce when gift is opened
    const giftBox = document.getElementById('giftBox');
    if (giftBox) {
        giftBox.addEventListener('click', function() {
            setTimeout(() => {
                liveRegion.textContent = 'Surprise! Your special gift has been revealed. A link to RemPlanner is now available.';
            }, 1000);
        });
    }
}