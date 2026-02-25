// ---------- Global Init ----------
document.addEventListener('DOMContentLoaded', () => {
    showHeroSlides(); // Start the show
});

// ---------- Hero Slideshow Logic ----------
let heroIndex = 0;
let slideTimer; // Variable to hold the timer

function showHeroSlides() {
    let slides = document.getElementsByClassName("hero-slides");
    let dots = document.getElementsByClassName("hero-slide-dot");

    if (!slides.length) return;

    // Hide everything
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // Move to next slide
    heroIndex++;
    if (heroIndex > slides.length) { heroIndex = 1; }

    // Display current
    slides[heroIndex - 1].style.display = "block";
    if (dots.length) dots[heroIndex - 1].className += " active";

    // IMPORTANT: Clear the old timer before starting a new one
    clearTimeout(slideTimer);
    slideTimer = setTimeout(showHeroSlides, 5000);
}

// ---------- Manual Controls ----------
function plusSlides(n) {
    // We adjust heroIndex based on the direction (n)
    // We subtract 1 because showHeroSlides() immediately adds 1
    heroIndex += (n - 1); 
    
    // If heroIndex goes below 0, set it to the last slide
    let slides = document.getElementsByClassName("hero-slides");
    if (heroIndex < 0) { heroIndex = slides.length - 1; }
    
    showHeroSlides();
}

function currentSlide(n) {
    heroIndex = n - 1; // Set to specific slide
    showHeroSlides();
}
