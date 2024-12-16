
var autoTypeHelloText = new AutoType({
    parent: document.getElementById("Otherprojects"),
    writeSpeed: 100,
    deleteSpeed: 200,
    opacityTransition: 0.2,
    className: ["rotHover"]
})
.Write("Other projects")
.Start()

function carrousel(id, list, toRight){    
    this.array = []
    this.timeCarrousel = 0;
    this.imgesSizeCarrousel = 200;
    this.imageMargeCarrousel = 20;
    this.nombreImageCarrousel = 0;
    this.speedCarrousel = toRight ? this.imgesSizeCarrousel + this.imageMargeCarrousel : -this.imgesSizeCarrousel - this.imageMargeCarrousel;
    this.slideImagesInterval;
    this.id = id;
    this.list = list;
    this.time2translate = 4000;
    this.transitionValue = ["all "+this.time2translate/1000+"s linear","all "+this.time2translate/1000+"s cubic-bezier(0.25, 0.1, 0.25, 1)"];
    this.mode = 0 //l linear, b bezier


    this.generate = function(){
        let container = document.getElementById(this.id);
        let counter = 0
        this.list.forEach(project => {
            let a = document.createElement('a');
            a.href = project.action;
            a.target = '_blank';
            let holdImg = document.createElement('div');
            holdImg.style.width = `${this.imgesSizeCarrousel}px`
            holdImg.style.height = `${this.imgesSizeCarrousel}px`
            let img = document.createElement('img');
            img.src = project.source;
            img.style.width = `${this.imgesSizeCarrousel}px`
            img.style.height = `${this.imgesSizeCarrousel}px`
            holdImg.classList.add("holdImg-carrousel")
            img.classList.add("img-carrousel")
            container.appendChild(a);
            a.appendChild(holdImg);
            holdImg.appendChild(img);
            let margeLeft = counter * (this.imageMargeCarrousel + this.imgesSizeCarrousel)
            holdImg.style.marginLeft = `${margeLeft}px`
            this.array.push([holdImg, counter]);
            counter++;
        })
        this.nombreImageCarrousel = counter;
        container.style.maxWidth = `${(this.nombreImageCarrousel-2)*(this.imgesSizeCarrousel + this.imageMargeCarrousel)}px`
        container.style.height = `${this.imgesSizeCarrousel}px`

        container.addEventListener("mouseenter", () => {
            this.pause = true;
        });
        container.addEventListener("mouseleave", () => {
            this.pause = false;
        });

        this.slideImages(this)
        this.slideImagesInterval = setInterval(this.slideImages, this.time2translate, this);
    }

    this.slideImages = function(obj){
        if(!obj.pause){
            obj.array.forEach(element => {
                if(obj.speedCarrousel > 0){
                    let margeLeft = (element[1] * (obj.imageMargeCarrousel + obj.imgesSizeCarrousel) + obj.timeCarrousel*obj.speedCarrousel) % ((obj.nombreImageCarrousel) * (obj.imageMargeCarrousel + obj.imgesSizeCarrousel))
    
                    if(margeLeft <= 0){                    
                        element[0].style.transition = "none"
                        element[0].style.marginLeft = `${-(obj.imageMargeCarrousel + obj.imgesSizeCarrousel)}px`
                    }else{
                        element[0].style.transition = obj.transitionValue[obj.mode]
                        element[0].style.marginLeft = `${margeLeft -(obj.imageMargeCarrousel + obj.imgesSizeCarrousel)}px`
                    }
         
                }else{
                    let margeLeft = (element[1] * (obj.imageMargeCarrousel + obj.imgesSizeCarrousel) - obj.timeCarrousel*obj.speedCarrousel) % ((obj.nombreImageCarrousel) * (obj.imageMargeCarrousel + obj.imgesSizeCarrousel))
    
                    if(margeLeft <= 0){                    
                        element[0].style.transition = "none"
                        element[0].style.marginLeft = `${(obj.nombreImageCarrousel - 3) * (obj.imageMargeCarrousel + obj.imgesSizeCarrousel)+(obj.imageMargeCarrousel + obj.imgesSizeCarrousel)}px`
                    }else{
                        element[0].style.transition = obj.transitionValue[obj.mode]
                        element[0].style.marginLeft = `${(obj.nombreImageCarrousel - 3) * (obj.imageMargeCarrousel + obj.imgesSizeCarrousel) - margeLeft + (obj.imageMargeCarrousel + obj.imgesSizeCarrousel)}px`
                    }
                }
            })
            obj.timeCarrousel++;
        }
    }
}



var carrousel1 = new carrousel('carrouselImages1',imagesCards1, true);
var carrousel2 = new carrousel('carrouselImages2', imagesCards2, false);
var carrousel3 = new carrousel('carrouselImages3', imagesCards3, true);
setTimeout(function() {carrousel1.generate()}, 0);
setTimeout(function() {carrousel3.generate()}, 0);   
setTimeout(function() {carrousel2.generate()}, 0);