const logo = document.querySelector('.santana-pier-logo');
const semicircleTop = document.querySelector('.semicircle-top');
const semicircleBottom = document.querySelector('.semicircle-bottom');
const centerLine = document.querySelector('.center-line');

function adjustColorForReflection(color) {
    // Convert hex to RGB, darken and add blue tint for ocean reflection
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken the color and add blue tint for ocean reflection
    const reflectedR = Math.floor(r * 0.6);
    const reflectedG = Math.floor(g * 0.7);
    const reflectedB = Math.floor(Math.min(255, b * 0.8 + 30)); // Add blue tint
    
    return `rgb(${reflectedR}, ${reflectedG}, ${reflectedB})`;
}

function animateSunset() {
    const duration = 4000;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Sunset color progression
        const sunsetColors = [
            '#FFD700', // Gold
            '#FF8C00', // Dark orange
            '#FF6347', // Tomato
            '#DC143C', // Crimson
            '#8B008B', // Dark magenta
            '#4B0082'  // Indigo
        ];
        
        const colorIndex = Math.floor(progress * (sunsetColors.length - 1));
        const nextColorIndex = Math.min(colorIndex + 1, sunsetColors.length - 1);
        const colorProgress = (progress * (sunsetColors.length - 1)) % 1;
        
        const currentColor = sunsetColors[colorIndex];
        const nextColor = sunsetColors[nextColorIndex];
        
        // Keep background constant
        document.body.style.background = '#fffdf5';
        
        // Animate the logo elements
        // Top semicircle represents sun/moon
        semicircleTop.style.borderColor = currentColor;
        
        // Bottom semicircle represents reflection on ocean (darker, more muted)
        const reflectionColor = adjustColorForReflection(currentColor);
        semicircleBottom.style.borderColor = reflectionColor;
        
        centerLine.style.backgroundColor = currentColor;
        
        // Add glow effect
        const glowSize = 10 + 20 * Math.sin(progress * Math.PI * 4);
        logo.style.filter = `drop-shadow(0 0 ${glowSize}px ${currentColor})`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Restart animation
            setTimeout(() => {
                animateSunset();
            }, 1000);
        }
    }
    
    animate();
}

let currentSection = 0;
const totalSections = 7;
let isScrolling = false;

function slideToSection(sectionIndex) {
    const pageContainer = document.querySelector('.page-container');
    const translateY = -sectionIndex * 100;
    pageContainer.style.transform = `translateY(${translateY}vh)`;
    currentSection = sectionIndex;
    
    // Update navigation dots
    updateNavigationDots();
}

function updateNavigationDots() {
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach((dot, index) => {
        if (index === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function handleScroll(event) {
    event.preventDefault();
    
    // Prevent multiple scroll events during animation
    if (isScrolling) return;
    
    // Add threshold to prevent small scroll movements from triggering
    const scrollThreshold = 10;
    if (Math.abs(event.deltaY) < scrollThreshold) return;
    
    isScrolling = true;
    
    if (event.deltaY > 0 && currentSection < totalSections - 1) {
        // Scroll down
        slideToSection(currentSection + 1);
    } else if (event.deltaY < 0 && currentSection > 0) {
        // Scroll up
        slideToSection(currentSection - 1);
    } else {
        // If we can't scroll in the requested direction, unlock immediately
        isScrolling = false;
        return;
    }
    
    // Reset scroll lock after animation completes
    setTimeout(() => {
        isScrolling = false;
    }, 900); // Slightly longer than CSS transition to ensure completion
}

function initializeColorSquares() {
    const colorSquares = document.querySelectorAll('.color-square');
    colorSquares.forEach(square => {
        const color = square.getAttribute('data-color');
        square.style.backgroundColor = color;
    });
}

// Start animation when page loads
window.addEventListener('load', () => {
    animateSunset();
    initializeColorSquares();
});

// Add scroll listener for section navigation
window.addEventListener('wheel', handleScroll, { passive: false });

// Add click listeners for navigation dots
document.addEventListener('DOMContentLoaded', () => {
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slideToSection(index);
        });
    });
});