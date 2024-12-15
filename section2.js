//pour avoir l'animation du titre
var autoTypeHelloText = new AutoType({
    parent: document.getElementById("WhoAmITitle"),
    writeSpeed: 100,
    deleteSpeed: 200,
    opacityTransition: 0.2,
    className: ["rotHover"]
})
.Write("Who am I ?")
.Start()
