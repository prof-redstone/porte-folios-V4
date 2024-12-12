tilingCanvas.Start()

var SomeofmyProjectsTitle = new AutoType({
    parent: document.getElementById("SomeofmyProjectsTitle"),
    writeSpeed: 100,
    deleteSpeed: 200,
    opacityTransition: 0.2,
    className: ["rotHover", "rotEvent"]
})
.Write("Some of my projects")
.Start()

function generateCards() {
    const container = document.getElementById('project-cards-container');
    let evenNumber = 0
    cardsCollection.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card';

        const text = document.createElement('div');
        text.classList.add('text-card', "color2")

        if (evenNumber % 2 == 1) {
            card.classList.add("card-type1", "card");
            card.appendChild(text);
        }

        if (project.image) {
            const img = document.createElement('img');
            img.src = project.image;
            img.alt = project.title;
            img.classList.add("image-card")
            card.appendChild(img);
        } else if (project.video) {
            const video = document.createElement('video');
            video.src = project.video;
            video.controls = true;
            video.classList.add("video-card")
            card.appendChild(video);
        }

        if (evenNumber % 2 == 0) {
            card.classList.add("card-type2", "card");
            card.appendChild(text);
        }

        
        const title = document.createElement('h3');
        title.textContent = project.title;
        title.classList.add("title-card")

        const description = document.createElement('p');
        description.textContent = project.description;
        description.classList.add("description-card");
        
        text.appendChild(title);
        text.appendChild(description);

        
        const boutons = document.createElement('div');
        boutons.classList.add("boutons-card")

        if (project.code) {
            const button = document.createElement('a');
            button.href = project.code;
            button.target = '_blank';
            button.classList.add("button-card")
            button.innerHTML = `<svg style="width: 21px; fill: none; stroke-width: 1.9px; stroke-linecap: round; stroke-linejoin: round; stroke: #ebf0f5; opacity: 1;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.05 20.31"><g><path d="M7.26 16.34c-4.11 1.23-4.11-2.06-5.76-2.47M13 18.81V15.62a2.78 2.78 0 0 0-.77-2.15c2.59-.28 5.3-1.26 5.3-5.76a4.46 4.46 0 0 0-1.23-3.08 4.18 4.18 0 0 0-.08-3.11s-1-.29-3.22 1.22a11 11 0 0 0-5.76 0C5 1.23 4 1.52 4 1.52A4.18 4.18 0 0 0 4 4.63 4.48 4.48 0 0 0 2.73 7.74c0 4.46 2.72 5.44 5.31 5.76a2.8 2.8 0 0 0-.78 2.12v3.19"></path></g></svg>`;

            boutons.appendChild(button);
        }    
        if (project.run) {
            const button = document.createElement('a');
            button.href = project.run;
            button.target = '_blank';
            button.classList.add("button-card")
            button.innerHTML = `<svg style="width: 21px; fill: none; stroke-width: 1.9px; stroke-linecap: round; stroke-linejoin: round; stroke: #ebf0f5; opacity: 1;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.09 18.64"><g><path d="M14.55 7.52 4.62 1.78A2.08 2.08 0 0 0 1.5 3.58V15.05a2.08 2.08 0 0 0 3.12 1.8l9.93-5.73A2.08 2.08 0 0 0 14.55 7.52Z"></path></g></svg>`; 

            boutons.appendChild(button);
        }    
        text.appendChild(boutons)
        evenNumber++;
        container.appendChild(card);
    });
}

// Exécute la fonction au chargement
document.addEventListener('DOMContentLoaded', generateCards);