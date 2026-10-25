
let lastScrollPosition = 0;
const navbar = document.getElementById('navbar');
const navbarToggle = document.getElementById('navbar-toggle');
const navbarLinks = document.getElementById('navbar-links');
const mobileNavBreakpoint = 1100;

function closeMobileMenu() {
    navbarLinks.classList.remove('is-open');
    navbarToggle.setAttribute('aria-expanded', 'false');
    navbarToggle.setAttribute('aria-label', 'Open menu');
}

function toggleMobileMenu() {
    const isOpen = navbarLinks.classList.toggle('is-open');
    navbarToggle.setAttribute('aria-expanded', String(isOpen));
    navbarToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

navbarToggle.addEventListener('click', toggleMobileMenu);
navbarLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navbarLinks.classList.contains('is-open')) {
        closeMobileMenu();
        navbarToggle.focus();
    }
});
window.addEventListener('resize', () => {
    if (window.innerWidth > mobileNavBreakpoint) closeMobileMenu();
});

window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;
    if (navbarLinks.classList.contains('is-open')) closeMobileMenu();

    if (window.innerWidth > mobileNavBreakpoint) {
        if (currentScrollPosition > lastScrollPosition) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    } else {
        navbar.classList.remove('hidden');
    }

    if(currentScrollPosition > 0){        
        navbar.classList.add('blur');
    }else{
        navbar.classList.remove('blur');
    }

    lastScrollPosition = currentScrollPosition; 
});

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.01] // Détecte à 0% et 10% de visibilité
    };

    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.01) {
                activateSectionScripts(entry.target.id);
            } else if (entry.intersectionRatio === 0) {
                deactivateSectionScripts(entry.target.id);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function activateSectionScripts(sectionId) {
        if(sectionId == "Home"){StartSection1()}
        if(sectionId == "AboutMe"){StartSection2()}
        if(sectionId == "Projects"){StartSection3()}
        if(sectionId == "Slides"){StartSection4()}
        if(sectionId == "Skills"){StartSection5()}
        if(sectionId == "Contact"){StartSection6()}
    }

    function deactivateSectionScripts(sectionId) {
        if(sectionId == "Home"){StopSection1()}
        if(sectionId == "AboutMe"){StopSection2()}
        if(sectionId == "Projects"){StopSection3()}
        if(sectionId == "Slides"){StopSection4()}
        if(sectionId == "Skills"){StopSection5()}
        if(sectionId == "Contact"){StopSection6()}
    }
});
