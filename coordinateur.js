
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