let myShader;

let zoom = 1;
let centerX = 0.0;
let centerY = 0.0;
let it = 500;

let e1 = [1.0, 0.0, 0.0, 0.0, 0.0, 0.0];
let e2 = [0.0, 1.0, 0.0, 0.0, 0.0, 0.0];
let e3 = [0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
let e4 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0];
let e5 = [0.0, 0.0, 0.0, 0.0, 1.0, 0.0];
let e6 = [0.0, 0.0, 0.0, 0.0, 0.0, 1.0];

// z0 z0 c c a a
let ax1 =   [0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
let ax2 =   [0.0, 0.0, 0.0, 1.0, 0.0, 0.0];
let shift = [0.0, 0.0, -0.5, 0.0, 3.0, 0.0];

let mousePos6D = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];


let positions = [];
let positionIndex = 0;

let moveQueue = [];

let moveRequest = function(newAx1, newAx2, newShift, duration = 250, newZoom = null) { 
    moveQueue.push({newAx1, newAx2, newShift, duration, newZoom});    
}


let transition = {
    active: false,
    t: 0,
    duration: 250,
    startShift: null,
    startAx1: null,
    startAx2: null,
    startZoom: null,

    endShift: null,
    endAx1: null,
    endAx2: null,
    endZoom: null
}

function moveManager(){
    if(!transition.active && moveQueue.length > 0){
        let move = moveQueue.shift();

        transition.active = true;
        transition.t = 0;
        transition.duration = move.duration;
        transition.startShift = [...shift];
        transition.startAx1 = [...ax1];
        transition.startAx2 = [...ax2];
        transition.startZoom = zoom;
        transition.endShift = [...move.newShift];
        transition.endAx1 = [...move.newAx1];
        transition.endAx2 = [...move.newAx2];
        transition.endZoom = move.newZoom;
    }

    if(transition.active){
        transition.t++;
        let tt = transition.t / transition.duration;
        if(tt >= 1){
            tt = 1;
            transition.t = 0;
            transition.active = false;                    
        }
        let smoott = tt*tt*tt*(tt*(6*tt - 15) + 10); //smootherstep

        shift = addVec( mulVec(transition.startShift, 1-smoott), mulVec(transition.endShift, smoott) );
        ax1 = addVec( mulVec(transition.startAx1, 1-smoott), mulVec(transition.endAx1, smoott) );
        ax2 = addVec( mulVec(transition.startAx2, 1-smoott), mulVec(transition.endAx2, smoott) );
        if(transition.endZoom != null){
            zoom = transition.startZoom * pow( transition.endZoom/transition.startZoom, smoott);
        }
    }
}



function preload() {
    myShader = loadShader('shader.vert', 'shader.frag');    
    positions = loadJSON("positions.json");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(60);
    pixelDensity(1);

    let firstPos = getPosition(0);
    moveRequest(firstPos.ax1, firstPos.ax2, firstPos.shift, 250, firstPos.zoom);
}

function getPosition(index) {
  if (positions[index]) {
    return positions[index];
  } else if(index == 0) {
    console.log("Transition inexistante :", index);
    return null;
  }else{
    console.log("Transition inexistante :", index, "Retour à la position 0");
    positionIndex = 0;
    return positions[0];
  }
}

function logPosition() {
    console.log("{");
    console.log("  \"ax1\": [" + ax1.map(v => v.toFixed(6)).join(", ") + "],");
    console.log("  \"ax2\": [" + ax2.map(v => v.toFixed(6)).join(", ") + "],");
    console.log("  \"shift\": [" + shift.map(v => v.toFixed(6)).join(", ") + "],");
    console.log("  \"zoom\": " + zoom.toFixed(6));
    console.log("},");
}

function addVec(a, b) {
  return a.map((v, i) => v + b[i]);
}
function mulVec(a, s) {
  return a.map(v => v * s);
}

function keyboardInput(){

    let speed = -0.005 / zoom;

    if (keyIsDown(LEFT_ARROW)) {
        shift = addVec(shift, mulVec(e1, -speed));
    }
    if (keyIsDown(RIGHT_ARROW)) {
        shift = addVec(shift, mulVec(e1, speed));
    }
    if (keyIsDown(UP_ARROW)) {
        shift = addVec(shift, mulVec(e2, speed));
    }
    if (keyIsDown(DOWN_ARROW)) {
        shift = addVec(shift, mulVec(e2, -speed));
    }

    if (keyIsDown(81)) { // Q
        shift = addVec(shift, mulVec(e3, -speed));
    }
    if (keyIsDown(68)) { // D
        shift = addVec(shift, mulVec(e3, speed));
    }
    if (keyIsDown(90)) { // Z
        shift = addVec(shift, mulVec(e4, speed));
    }
    if (keyIsDown(83)) { // S
        shift = addVec(shift, mulVec(e4, -speed));
    }

    //space to increase postion index, positions.lenght n'existe pas ou ne fonctionne pas
    if (keyIsDown(32) && this.spacePressed != true) { // SPACE
        this.spacePressed = true;
        NextPosition();
    }else if (!keyIsDown(32)){
        this.spacePressed = false;
    }  
}

function NextPosition(){
    //positionIndex = (positionIndex + 1)// % positions.length;
    positionIndex = (positionIndex + 1) % 4;

    moveQueue = [];
    transition.active = false;

    let pos = getPosition(positionIndex);
    if (pos) {
        console.log("Transition vers la position", positionIndex);
        let baseDuration = 20; // durée minimale en ms
        let scaleFactor = 40;  // facteur d'échelle
        if(zoom > 2.0){
            //juste dézoomer
            //calculer le temps de dézoom
            let logDistance = Math.abs(Math.log2(1.0 / zoom));
            let zoomDuration = baseDuration + (logDistance * scaleFactor);
            moveRequest(ax1, ax2, shift, zoomDuration, 1.0);
        }
        //setupTransition(pos.ax1, pos.ax2, pos.shift, pos.zoom);
        moveRequest(pos.ax1, pos.ax2, pos.shift, 250, 1.0);

        let logDistance = Math.abs(Math.log2(1.0 / pos.zoom));
        let zoomDuration = baseDuration + (logDistance * scaleFactor);
        moveRequest(pos.ax1, pos.ax2, pos.shift, zoomDuration, pos.zoom);

    }
}

function mousePressed() {
    if (mouseButton === LEFT) {//centrer sur la souris
        updateMousePosition();

        moveQueue = [];
        transition.active = false;
        moveRequest(ax1, ax2, [...mousePos6D], 50, zoom);        
    }
    if (mouseButton === RIGHT) {//rotation de l'espace sur la souris
        updateMousePosition();
        moveQueue = [];
        transition.active = false;
        rotateSpace();
    }
}

function mouseWheel(event) {
    if (event.delta > 0) {
        zoom *= 0.8;
    } else if (event.delta < 0) {
        zoom *= 1.25;
    }
    return false;
}

function rotateSpace() {  
    //inverser les dimension 1 et 2 avec 3 et 4  
    let newAx1 = [ax1[2], ax1[3], ax1[0], ax1[1], ax1[4], ax1[5]];
    let newAx2 = [ax2[2], ax2[3], ax2[0], ax2[1], ax2[4], ax2[5]];
    let newShift = [mousePos6D[0], mousePos6D[1], mousePos6D[2], mousePos6D[3], mousePos6D[4], mousePos6D[5]];

    //faire une condition avec la somme en val absolue des ax1[2] ax1[3] ax2[2] ax2[3], et comparer avec ax1[0] ax1[1] ax2[0] ax2[1]
    //si la somme des 3 et 4 est plus grande, on remet les ax1 et ax2 a leur position initiale
    let sum34 = Math.abs(ax1[2]) + Math.abs(ax1[3]) + Math.abs(ax2[2]) + Math.abs(ax2[3]);
    let sum12 = Math.abs(ax1[0]) + Math.abs(ax1[1]) + Math.abs(ax2[0]) + Math.abs(ax2[1]);

    if(sum34 > sum12){//on est plus dans le plan de Mandelbrot que de Julia
        console.log("vers Julia")
        newAx1 = [1.0, 0.0, 0.0, 0.0, ax1[4], ax1[5]];
        newAx2 = [0.0, 1.0, 0.0, 0.0, ax2[4], ax2[5]];
        moveRequest(newAx1, newAx2, newShift, 250, 10.0);
        moveRequest(newAx1, newAx2, newShift, 100, 1.0);

    }else{//Julia vers Mandelbrot
        newAx1 = [0.0, 0.0, 1.0, 0.0, ax1[4], ax1[5]];
        newAx2 = [0.0, 0.0, 0.0, 1.0, ax2[4], ax2[5]];
        
        newShift = [0, 0, mousePos6D[2], mousePos6D[3], mousePos6D[4], mousePos6D[5]]; //mandelbrot bien que centré.
        console.log("vers Mandelbrot")
        if(zoom > 2.0){
            //juste dézoomer
            let logDistance = Math.abs(Math.log2(1.0 / zoom));
            let baseDuration = 20;
            let scaleFactor = 20;
            let zoomDuration = baseDuration + (logDistance * scaleFactor);
            moveRequest(ax1, ax2, shift, zoomDuration, 1.0);
        }
        moveRequest(newAx1, newAx2, newShift, 250, 4.0);
    }

}

function updateMousePosition() {
    let mouseXNorm = mouseX / width;
    let mouseYNorm = (height-mouseY) / height;
    
    let uv_x = (2.0 * mouseXNorm - 1.0) * (1 / zoom);
    let uv_y = (2.0 * mouseYNorm - 1.0) * (1 / zoom);
    
    uv_x *= (width / height);
    
    // Mettre à jour les variables globales
    centerX = uv_x;
    centerY = uv_y;
    let P4_x = shift[0] + ax1[0] * centerX + ax2[0] * centerY;
    let P4_y = shift[1] + ax1[1] * centerX + ax2[1] * centerY;
    let P4_z = shift[2] + ax1[2] * centerX + ax2[2] * centerY;
    let P4_w = shift[3] + ax1[3] * centerX + ax2[3] * centerY;
    let P2_x = shift[4] + ax1[4] * centerX + ax2[4] * centerY;
    let P2_y = shift[5] + ax1[5] * centerX + ax2[5] * centerY;

    mousePos6D = [P4_x, P4_y, P4_z, P4_w, P2_x, P2_y];
}



function draw() {
    
    moveManager();
    keyboardInput();
    updateMousePosition();

    
    //pas de vec6 dans les shaders, on splitte en vec4 et vec2
    myShader.setUniform('resolution', [width, height]);
    myShader.setUniform('mouse', [centerX, centerY]);
    myShader.setUniform('time', millis() / 1000.0);
    myShader.setUniform('izoom', 1/zoom);
    myShader.setUniform('imaxIt', it);

    myShader.setUniform('shift4', [shift[0], shift[1], shift[2], shift[3]]); 
    myShader.setUniform('shift2', [shift[4], shift[5]]);

    myShader.setUniform('ax1_4', [ax1[0], ax1[1], ax1[2], ax1[3]]);
    myShader.setUniform('ax1_2', [ax1[4], ax1[5]]);

    myShader.setUniform('ax2_4', [ax2[0], ax2[1], ax2[2], ax2[3]]);
    myShader.setUniform('ax2_2', [ax2[4], ax2[5]]);

    shader(myShader);
    rect(0, 0, width, height);    
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

document.addEventListener('contextmenu', e => e.preventDefault()); //desactive le menu contextuel au clic droit