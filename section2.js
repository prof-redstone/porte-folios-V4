let WhoAmI = new AutoType({
    parent: document.getElementById("WhoAmITitle"),
    writeSpeed: 100,
    deleteSpeed: 200,
    opacityTransition: 0.2,
    className: ["rotHover"]
})
.Write("Who am I ?");
let WhoAmIWritten = false;

function StartSection2(){
    if(!WhoAmIWritten){
        WhoAmI.Start();
        WhoAmIWritten = true;
    }
}

function StopSection2(){
}
