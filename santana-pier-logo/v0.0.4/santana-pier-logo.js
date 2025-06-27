
let currentSection = 0;
const totalSections = 6;
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

// Initialize color squares when page loads
window.addEventListener('load', () => {
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