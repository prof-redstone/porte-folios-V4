let Howtocontactme = new AutoType({
        parent: document.getElementById("Howtocontactme"),
        writeSpeed: 100,
        deleteSpeed: 200,
        opacityTransition: 0.2,
        className: ["rotHover"]
    })
    .Write("How to contact me ?")
let HowtocontactmeWritten = false;

function StartSection6() {
    if (!HowtocontactmeWritten) {
        HowtocontactmeWritten = true;
        Howtocontactme.Start()
    }

    grassSimulationCanvas.StartGrassSimulation()
}


function StopSection6() {
    grassSimulationCanvas.StopGrassSimulation()
}