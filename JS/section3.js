let SomeofmyProjectsTitle = new AutoType({
    parent: document.getElementById("SomeofmyProjectsTitle"),
    writeSpeed: 50,
    deleteSpeed: 200,
    opacityTransition: 0.2,
    className: ["rotHover"]
})
.Write("Some of my best projects");
let SomeofmyProjectsTitleWritten = false;

function StartSection3(){
    tilingCanvas.Start()
    if(!SomeofmyProjectsTitleWritten){
        SomeofmyProjectsTitle.Start()
        SomeofmyProjectsTitleWritten = true;
    }
}

function StopSection3(){
    tilingCanvas.Stop()
}



const videosInOrder = [];
let pageReady = false;
let preloadIndex = 0;
let preloadScheduled = null;
let preloading = false;

function loadVideo(video) {
    if (video.src || video.dataset.loading === "1") return;
    video.dataset.loading = "1";
    video.preload = "auto";
    video.src = video.dataset.src;
    video.load();
}

function playVideo(video) {
    loadVideo(video);
    const promise = video.play();
    if (promise) promise.catch(() => {});
}

// Joue uniquement la vidéo visible, met les autres en pause.
const videoVisibility = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.dataset.visible = "1";
            playVideo(video);
        } else {
            video.dataset.visible = "0";
            video.pause();
        }
    });
}, { threshold: 0.5 });

document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('#project-cards-container video').forEach(video => {
        if (document.hidden) {
            video.pause();
        } else if (video.dataset.visible === "1" && video.src) {
            video.play().catch(() => {});
        }
    });
});

function backgroundPreloadAllowed() {
    if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) return false;
    const connection = navigator.connection;
    if (connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ''))) return false;
    return true;
}

function schedulePreload(delay) {
    if (preloadScheduled) return;
    preloadScheduled = setTimeout(() => {
        preloadScheduled = null;
        backgroundPreloadNext();
    }, delay);
}

// Charge les vidéos en arrière-plan, dans l'ordre d'affichage, après le reste de la page.
function backgroundPreloadNext() {
    if (!pageReady || preloading || !backgroundPreloadAllowed()) return;
    if (preloadIndex >= videosInOrder.length) return;

    const visibleStillBuffering = videosInOrder.some(video =>
        video.dataset.visible === "1" && video.readyState < 3
    );
    if (visibleStillBuffering) {
        schedulePreload(600);
        return;
    }

    const video = videosInOrder[preloadIndex];
    if (video.src || video.dataset.loading === "1") {
        preloadIndex++;
        schedulePreload(0);
        return;
    }

    preloading = true;
    loadVideo(video);

    let finished = false;
    let safety;
    const next = () => {
        if (finished) return;
        finished = true;
        clearTimeout(safety);
        video.removeEventListener('canplaythrough', next);
        video.removeEventListener('loadeddata', next);
        video.removeEventListener('error', next);
        preloading = false;
        preloadIndex++;
        schedulePreload(250);
    };

    video.addEventListener('canplaythrough', next);
    video.addEventListener('loadeddata', next);
    video.addEventListener('error', next);
    safety = setTimeout(next, 20000);
}

function startBackgroundPreload() {
    pageReady = true;
    if (!backgroundPreloadAllowed()) return;
    const idle = window.requestIdleCallback || (callback => setTimeout(callback, 300));
    idle(() => schedulePreload(0), { timeout: 2000 });
}

if (document.readyState === 'complete') {
    startBackgroundPreload();
} else {
    window.addEventListener('load', startBackgroundPreload, { once: true });
}

function generateCards() {
    const container = document.getElementById('project-cards-container');
    let evenNumber = 0
    cardsCollection.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card';

        const text = document.createElement('div');
        text.classList.add('text-card', "color2")

        let media;

        if (project.action) {
            media = document.createElement('a');
            media.href = project.action;
            media.target = '_blank';
            media.rel = 'noopener';
        }else{
            media = document.createElement('div');
        }


        if (project.video) {
            let videoContainer = document.createElement('div');
            videoContainer.classList.add('video-container');

            let fallbackImage = document.createElement('img');
            fallbackImage.src = project.image;
            fallbackImage.alt = project.title;
            fallbackImage.width = 800;
            fallbackImage.height = 450;
            fallbackImage.loading = 'lazy';
            fallbackImage.decoding = 'async';
            fallbackImage.classList.add("media-card");

            let video = document.createElement('video');
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.preload = "none";
            video.dataset.src = project.video;
            video.setAttribute('aria-label', project.title);
            video.classList.add("media-card", "project-video");

            video.addEventListener('playing', () => {
                fallbackImage.style.visibility = 'hidden';
                video.classList.add("project-video--playing");
            });

            video.addEventListener('error', () => {
                video.style.display = 'none';
                fallbackImage.style.visibility = 'visible';
            });

            videoContainer.appendChild(fallbackImage);
            videoContainer.appendChild(video);
            media.appendChild(videoContainer);

            videosInOrder.push(video);
            videoVisibility.observe(video);
        }

        if (evenNumber % 2 == 1) {//pourchanger l'ordre
            card.classList.add("card-type1", "card");
            card.appendChild(text);
            card.appendChild(media);
        }else{
            card.classList.add("card-type2", "card");
            card.appendChild(media);
            card.appendChild(text);
        }

        let titleAction;
        if (project.action) {
            titleAction = document.createElement('a');
            titleAction.href = project.action;
            titleAction.target = '_blank';
            titleAction.rel = 'noopener';
        }else{
            titleAction = document.createElement('div');
        }
        
        const title = document.createElement('h3');
        title.textContent = project.title;
        title.classList.add("title-card", "underline-blue")
        titleAction.appendChild(title);
        text.appendChild(titleAction);

        const description = document.createElement('p');
        description.textContent = project.description;
        description.classList.add("description-card");
        text.appendChild(description);

        const langages = document.createElement('div');
        langages.classList.add("langages-card")
        project.langage.forEach(l => {
            const langage = document.createElement('p');
            langage.textContent = l
            langages.appendChild(langage);
        })
        text.appendChild(langages);

        
        const boutons = document.createElement('div');
        boutons.classList.add("boutons-card")

        if (project.code) {
            const button = document.createElement('a');
            button.href = project.code;
            button.target = '_blank';
            button.rel = 'noopener';
            button.classList.add("button-card-code")
            button.innerHTML = `<svg style="width: 21px; fill: none; stroke-width: 1.9px; stroke-linecap: round; stroke-linejoin: round; opacity: 1;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.05 20.31"><g><path d="M7.26 16.34c-4.11 1.23-4.11-2.06-5.76-2.47M13 18.81V15.62a2.78 2.78 0 0 0-.77-2.15c2.59-.28 5.3-1.26 5.3-5.76a4.46 4.46 0 0 0-1.23-3.08 4.18 4.18 0 0 0-.08-3.11s-1-.29-3.22 1.22a11 11 0 0 0-5.76 0C5 1.23 4 1.52 4 1.52A4.18 4.18 0 0 0 4 4.63 4.48 4.48 0 0 0 2.73 7.74c0 4.46 2.72 5.44 5.31 5.76a2.8 2.8 0 0 0-.78 2.12v3.19"></path></g></svg>`;

            boutons.appendChild(button);
        }    
        if (project.run) {
            const button = document.createElement('a');
            button.href = project.run;
            button.target = '_blank';
            button.rel = 'noopener';
            button.classList.add("button-card-run")
            button.innerHTML = `<svg style="width: 21px; fill: none; stroke-width: 1.9px; stroke-linecap: round; stroke-linejoin: round; opacity: 1;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.09 18.64"><g><path d="M14.55 7.52 4.62 1.78A2.08 2.08 0 0 0 1.5 3.58V15.05a2.08 2.08 0 0 0 3.12 1.8l9.93-5.73A2.08 2.08 0 0 0 14.55 7.52Z"></path></g></svg>`; 

            boutons.appendChild(button);
        }    

        const date = document.createElement('p');
        date.classList.add("date-card", "project-date")
        date.textContent = project.anne;

        const divBTNEtDate = document.createElement('div');
        divBTNEtDate.classList.add("project-footer")
        divBTNEtDate.appendChild(boutons);
        divBTNEtDate.appendChild(date);


        text.appendChild(divBTNEtDate)
        evenNumber++;
        container.appendChild(card);
    });
}

// Exécute la fonction au chargement
document.addEventListener('DOMContentLoaded', generateCards);