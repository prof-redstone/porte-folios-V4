let blinkState
let blinker
let helloText
let autoTypeHelloText
let autoTypeImTom
let autoTypewebDeveloper1
let autoTypewebDeveloper2
let intervalAnimLetter

//underscore animation blinking
blinkState = 1;
blinker = setInterval(() => {
    blinkState = (blinkState == 1) ? 0 : 1
    document.querySelectorAll(".cursorBlinker").forEach(el => {
        el.style.opacity = blinkState
    })
}, 700)

//animation auto type
helloText = document.getElementById("hello-text-WrittingText")
autoTypeHelloText = new AutoType({
        parent: helloText,
        writeSpeed: 200,
        deleteSpeed: 200,
        opacityTransition: 0.2,
        loop: true,
        className: ["rotHover", "rotEvent"]
    })
    .Write("Hi !")
    .Sleep(6000)
    .Delete(100)
    .Write("Welcome,")
    .Sleep(6000)
    .Delete(100)
    .Write("Hello,")
    .Sleep(5300)
    .Delete(1)
    .Write(" World !")
    .Sleep(2700)
    .Delete(100)
    .Start()

//auto type write 
autoTypeImTom = new AutoType({
    parent: document.getElementById("ImTom-WrittingText"),
    writeSpeed: 150,
    opacityTransition: 0.2,
    className: ["rotHover", "rotEvent"]
}).Write("{ User : Tom }").Start()

//auto type write 
autoTypewebDeveloper1 = new AutoType({
    parent: document.getElementById("web-WrittingText"),
    writeSpeed: 200,
    deleteSpeed: 200,
    opacityTransition: 0.2,
    loop: true,
    className: ["rotHover", "rotEvent", "colorRed"]
})
.Write("web")
.Sleep(5000)
.Delete(100)
.Write("C++")
.Sleep(5000)
.Delete(100)
.Start()
//espace insécable :   
autoTypewebDeveloper2 = new AutoType({
    parent: document.getElementById("developer-WrittingText"),
    writeSpeed: 150,
    opacityTransition: 0.2,
    className: ["rotHover", "rotEvent", "colorRed"]
}).Sleep(600).Write("developer").Start()

//animation hover des lettres (délégation : fonctionne aussi sur les lettres ajoutées ensuite)
document.addEventListener("mouseover", (event) => {
    if (!(event.target instanceof Element)) return;
    const letter = event.target.closest(".rotHover");
    if (!letter || letter === event.relatedTarget || letter.contains(event.relatedTarget)) return;
    letter.classList.add("rotationAnimation");
});
document.addEventListener("animationend", (event) => {
    if (event.target instanceof Element && event.target.classList.contains("rotationAnimation")) {
        event.target.classList.remove("rotationAnimation");
    }
});
//characters random qui toune tous les 4s
intervalAnimLetter = setInterval(() => {
    var el = document.getElementsByClassName('rotEvent');
    var nb = nb_random(0, el.length - 1)
    var classes = ["Yrotation", "Zrotation", "Xrotation"]
    var nbClass = nb_random(0, classes.length - 1)
    el[nb].classList.add(classes[nbClass])
    setTimeout(function(el, classes) {
        for (let u = 0; u < classes.length; u++) {
            el.classList.remove(classes[u])
        }
    }, 2000, el[nb], classes)
}, 4000)

function StartSection1(){
    
    NeuronWebCanvas.StartNeuroneWeb()
}


function StopSection1(){
    NeuronWebCanvas.StopNeuronWeb()
}