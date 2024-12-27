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
        }else{
            media = document.createElement('div');
        }


        if (project.video) {
            let videoContainer = document.createElement('div');
            videoContainer.style.position = 'relative';
            videoContainer.style.width = '100%';
            videoContainer.style.height = '100%';
        
            let video = document.createElement('video');
            video.loop = true;
            video.muted = true; 
            video.autoplay = true;
            video.preload = "auto";
            video.classList.add("media-card");
            video.style.position = 'absolute';
            video.style.opacity = "0";
        
            const source = document.createElement('source');
            source.src = project.video;
            source.type = "video/mp4";
            video.appendChild(source);
        
            let fallbackImage = document.createElement('img');
            fallbackImage.src = project.image;
            fallbackImage.alt = project.title;
            fallbackImage.classList.add("media-card");

            video.addEventListener('canplaythrough', () => {
                console.log('Video loaded successfully');
                video.style.position = "relative"
                fallbackImage.style.display = 'none'; 
                video.style.opacity = "1";
            });
        
            video.addEventListener('error', () => {
                console.error('Video failed to load');
                video.style.display = 'none'; 
            });
        
            videoContainer.appendChild(fallbackImage);
            videoContainer.appendChild(video);
            media.appendChild(videoContainer);
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
            button.classList.add("button-card-code")
            button.innerHTML = `<svg style="width: 21px; fill: none; stroke-width: 1.9px; stroke-linecap: round; stroke-linejoin: round; opacity: 1;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.05 20.31"><g><path d="M7.26 16.34c-4.11 1.23-4.11-2.06-5.76-2.47M13 18.81V15.62a2.78 2.78 0 0 0-.77-2.15c2.59-.28 5.3-1.26 5.3-5.76a4.46 4.46 0 0 0-1.23-3.08 4.18 4.18 0 0 0-.08-3.11s-1-.29-3.22 1.22a11 11 0 0 0-5.76 0C5 1.23 4 1.52 4 1.52A4.18 4.18 0 0 0 4 4.63 4.48 4.48 0 0 0 2.73 7.74c0 4.46 2.72 5.44 5.31 5.76a2.8 2.8 0 0 0-.78 2.12v3.19"></path></g></svg>`;

            boutons.appendChild(button);
        }    
        if (project.run) {
            const button = document.createElement('a');
            button.href = project.run;
            button.target = '_blank';
            button.classList.add("button-card-run")
            button.innerHTML = `<svg style="width: 21px; fill: none; stroke-width: 1.9px; stroke-linecap: round; stroke-linejoin: round; opacity: 1;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.09 18.64"><g><path d="M14.55 7.52 4.62 1.78A2.08 2.08 0 0 0 1.5 3.58V15.05a2.08 2.08 0 0 0 3.12 1.8l9.93-5.73A2.08 2.08 0 0 0 14.55 7.52Z"></path></g></svg>`; 

            boutons.appendChild(button);
        }    

        const date = document.createElement('p');
        date.style.marginRight = "10px"
        date.style.marginLeft = "10px"
        date.classList.add("date-card")
        date.textContent = project.anne;

        const divBTNEtDate = document.createElement('div');
        divBTNEtDate.style.display = "flex"
        divBTNEtDate.style.alignItems = "center"
        divBTNEtDate.style.marginTop = "15px"
        divBTNEtDate.style.justifyContent = "space-between"
        divBTNEtDate.style.width = "100%"
        divBTNEtDate.appendChild(boutons);
        divBTNEtDate.appendChild(date);


        text.appendChild(divBTNEtDate)
        evenNumber++;
        container.appendChild(card);
    });
}

// Exécute la fonction au chargement
document.addEventListener('DOMContentLoaded', generateCards);