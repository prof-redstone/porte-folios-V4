
let lastScrollPosition = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;
    if (currentScrollPosition > lastScrollPosition) {
    navbar.classList.add('hidden');
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

function showMobileWarningBanner() {
    if (window.innerHeight > window.innerWidth) {
        pasadapte()
        addVerticalStylesheet();
    }
}
showMobileWarningBanner()

function pasadapte() {
    const banner = document.createElement('div');
    banner.id = 'mobile-warning-banner';
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.height = '100%';
    banner.style.backgroundColor = '#eeeeee';
    banner.style.color = '#000';
    banner.style.display = 'flex';
    banner.style.flexDirection = 'column';
    banner.style.justifyContent = 'center';
    banner.style.alignItems = 'center';
    banner.style.textAlign = 'center';
    banner.style.padding = '20px';
    banner.style.zIndex = '1000';
    banner.style.fontFamily = 'Arial, sans-serif';
    banner.style.fontSize = '20px';
    banner.textContent = 'This site is not optimized for mobile viewing for now. Please use a desktop device for the best experience.';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#000';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16px';
    closeButton.onclick = function () {
        banner.remove();
    };

    banner.appendChild(closeButton);
    document.body.appendChild(banner);
    
}

window.addEventListener('resize', function() {
    const banner = document.getElementById('mobile-warning-banner');
    if (window.innerHeight > window.innerWidth) {
        if (!banner) showMobileWarningBanner();
    } else if (banner) {
        banner.remove();
    }
});

function addVerticalStylesheet() {
    const existingLink = document.getElementById('vertical-stylesheet');
    if (!existingLink && window.innerHeight > window.innerWidth) {
        const link = document.createElement('link');
        link.id = 'vertical-stylesheet';
        link.rel = 'stylesheet';
        link.href = 'css/vertical-styles.css'; // Remplace par le chemin de ton fichier CSS
        document.head.appendChild(link);
    } else if (existingLink && window.innerWidth > window.innerHeight) {
        existingLink.remove();
    }
}

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
        
        console.log(`Activation des scripts pour ${sectionId}`);

        if(sectionId == "Home"){StartSection1()}
        if(sectionId == "AboutMe"){StartSection2()}
        if(sectionId == "Projects"){StartSection3()}
        if(sectionId == "Slides"){StartSection4()}
        if(sectionId == "Skills"){StartSection5()}
        if(sectionId == "Contact"){StartSection6()}
    }

    function deactivateSectionScripts(sectionId) {
        console.log(`Désactivation des scripts pour ${sectionId}`);
        
        if(sectionId == "Home"){StopSection1()}
        if(sectionId == "AboutMe"){StopSection2()}
        if(sectionId == "Projects"){StopSection3()}
        if(sectionId == "Slides"){StopSection4()}
        if(sectionId == "Skills"){StopSection5()}
        if(sectionId == "Contact"){StopSection6()}
    }
});
