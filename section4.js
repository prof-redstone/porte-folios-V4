let OtherProjects = new AutoType({
    parent: document.getElementById("Otherprojects"),
    writeSpeed: 50,
    deleteSpeed: 200,
    opacityTransition: 0.2,
    className: ["rotHover"]
})
    .Write("Other projects")
let OtherProjectsWritten = false

function StartSection4() {
    document.querySelectorAll(".carrousel-track").forEach(track => track.classList.add("carrousel-track--play"));
    if (!OtherProjectsWritten) {
        OtherProjectsWritten = true;
        OtherProjects.Start()
    }
}

function StopSection4() {
    document.querySelectorAll(".carrousel-track").forEach(track => track.classList.remove("carrousel-track--play"));
}

class Carousel {
    constructor({ id, list, direction = "right" }) {
        this.container = document.getElementById(id);
        this.list = list;
        this.direction = direction;
        this.itemSize = 200;
        this.gap = 20;
        this.slotDuration = 4000;
    }

    generate() {
        const track = document.createElement("div");
        track.className = "carrousel-track" + (this.direction === "left" ? " carrousel-track--reverse" : "");

        const firstSet = this.list.map(item => this.buildItem(item));
        firstSet.forEach(el => track.appendChild(el));
        firstSet.forEach(el => track.appendChild(el.cloneNode(true)));

        this.container.appendChild(track);

        const setWidth = this.list.length * (this.itemSize + this.gap);
        const duration = this.list.length * this.slotDuration;
        track.style.setProperty("--shift", `-${setWidth}px`);
        track.style.setProperty("--duration", `${duration}ms`);
    }

    buildItem({ source, action }) {
        const link = document.createElement("a");
        link.href = action;
        link.target = "_blank";

        const hold = document.createElement("div");
        hold.className = "holdImg-carrousel";

        const img = document.createElement("img");
        img.className = "img-carrousel";
        img.src = source;
        img.alt = "project preview";

        hold.appendChild(img);
        link.appendChild(hold);
        return link;
    }
}

new Carousel({ id: "carrouselImages1", list: imagesCards1, direction: "right" }).generate();
new Carousel({ id: "carrouselImages3", list: imagesCards3, direction: "right" }).generate();
new Carousel({ id: "carrouselImages2", list: imagesCards2, direction: "left" }).generate();