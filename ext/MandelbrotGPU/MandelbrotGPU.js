let myShader; //shader principal

let maskShader; //recup l'information de l'image (heuristique)
let maskBuffer;

let frameCount = 0;
var percentageOfNonDivergence = 0;

let appReady = false;      // vrai quand setup() est terminé
let startPending = false;  // l'utilisateur a demandé à démarrer mais setup() n'était pas prêt

let zoom = 1;
let centerX = 0.0;
let centerY = 0.0;
let it = 400;

let e1 = [1.0, 0.0, 0.0, 0.0, 0.0, 0.0];
let e2 = [0.0, 1.0, 0.0, 0.0, 0.0, 0.0];
let e3 = [0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
let e4 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0];
let e5 = [0.0, 0.0, 0.0, 0.0, 1.0, 0.0];
let e6 = [0.0, 0.0, 0.0, 0.0, 0.0, 1.0];

// z0 z0 c c a a
let ax1 = [0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
let ax2 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0];
let shift = [0.0, 0.0, -0.5, 0.0, 2.0, 0.0];

let mousePos6D = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

//postion et transitions
let positions = [];
let posArray;
let positionIndex = 0;
let moveQueue = [];

//music sounds 
let audioStarted = false; // pour vérifier si l'audio a déjà été démarré
let tracks = [];
let nbTracks = 7;
let actionSound;
let tracksNormaliseVolume = [2.0, 1.0, 1.0, 0.7, 1.0, 0.7, 1.0]; // pour ajuster le volume de chaque piste
let mainGain;
let lowpass; // le filtre

let bubble;

function preload() {
    myShader = loadShader('shader.vert', 'shader.frag');
    positions = loadJSON("positions.json");

    maskShader = loadShader('shader.vert', 'mask.frag');

    //sound
    //ambiance = loadSound("sounds/mandelbrot.mp3");
    tracks[0] = loadSound("sounds/mandelbrot2.mp3");
    tracks[1] = loadSound("sounds/julia.mp3");
    tracks[2] = loadSound("sounds/mandelbrot3.mp3");
    tracks[3] = loadSound("sounds/mandelbrotImaginary.mp3");
    tracks[4] = loadSound("sounds/anotherPlan.mp3");
    tracks[5] = loadSound("sounds/anotherPlan2.mp3");
    tracks[6] = loadSound("sounds/unconfortablePlan.mp3");
    //Pas oublier update nbTracks !!!!!!!
    actionSound = loadSound("sounds/rightclick.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(60);
    pixelDensity(1);

    maskBuffer = createGraphics(64, 64, WEBGL); // petit canvas debug
    maskBuffer.noStroke();

    posArray = Object.values(positions);

    let bubbleSize = 800;
    bubble = new DialogueBubble()
        .setPosition(width/2-bubbleSize/2, 50)
        .setSize(bubbleSize, 120)
        .setAnimationSpeed(3000, 2000, 60)
        .enableBlur(true);

    //let firstPos = getPosition(0);
    //moveRequest(firstPos.ax1, firstPos.ax2, firstPos.shift, 250, firstPos.zoom);

    //sounds
    setupSound();

    appReady = true;
    if (startPending) {
        startPending = false;
        document.getElementById('warning-overlay').classList.add('hidden');
        NextPosition();
    }
}

function setupSound() {
    mainGain = new p5.Gain();
    mainGain.connect();

    lowpass = new p5.LowPass();

    document.addEventListener('click', () => { //necessite un click pour démarrer le son
        

        if (!audioStarted) {
            mainGain.disconnect();
            mainGain.connect(lowpass);

            for (let t of tracks) {
                t.disconnect(); // on coupe la sortie directe
                t.connect(mainGain);
                t.loop(); // joue en boucle
                t.setVolume(0); // commence muet
            }
            audioStarted = true;
        }
    });
}

let moveRequest = function (newAx1, newAx2, newShift, duration = 250, newZoom = null) {
    moveQueue.push({
        newAx1,
        newAx2,
        newShift,
        duration,
        newZoom
    });
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

function moveManager() {
    if (!transition.active && moveQueue.length > 0) {
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

    if (transition.active) {
        transition.t++;
        let tt = transition.t / transition.duration;
        if (tt >= 1) {
            tt = 1;
            transition.t = 0;
            transition.active = false;
        }
        let smoott = tt * tt * tt * (tt * (6 * tt - 15) + 10); //smootherstep

        shift = addVec(mulVec(transition.startShift, 1 - smoott), mulVec(transition.endShift, smoott));
        ax1 = addVec(mulVec(transition.startAx1, 1 - smoott), mulVec(transition.endAx1, smoott));
        ax2 = addVec(mulVec(transition.startAx2, 1 - smoott), mulVec(transition.endAx2, smoott));
        if (transition.endZoom != null) {
            zoom = transition.startZoom * pow(transition.endZoom / transition.startZoom, smoott);
        }
    }
}

function getPosition(index) {
    if (posArray[index]) {
        return posArray[index];
    } else if (index == 0) {
        console.log("Transition inexistante :", index);
        return null;
    } else {
        console.log("Transition inexistante :", index, "Retour à la position 0");
        positionIndex = 0;
        return posArray[0];
    }
}

function logPosition() {
    //reafaire ça en 1 console.log
    console.log(",{ \"ax1\": [" + ax1.map(v => v.toFixed(6)).join(", ") + "],\n \"ax2\": [" +
        ax2.map(v => v.toFixed(6)).join(", ") + "],\n \"shift\": [" +
        shift.map(v => v.toFixed(6)).join(", ") + "],\n \"zoom\": " +
        zoom.toFixed(6) + ",\n \"note\": \"\"" + "\n}");
}

function dotVec(a, b) {
    return a.reduce((s, ai, i) => s + ai * b[i], 0);
}

function normVec(a) {
    return Math.sqrt(dotVec(a, a));
}

function subVec(a, b) {
    return a.map((x, i) => x - b[i]);
}

function addVec(a, b) {
    return a.map((v, i) => v + b[i]);
}

function mulVec(a, s) {
    return a.map(v => v * s);
}

function planeAlignment(u1, u2, v1, v2) {
    // Matrice des projections de la base du plan 1 sur la base du plan 2
    u1 = u1.map(x => x / normVec(u1));
    u2 = u2.map(x => x / normVec(u2));
    v1 = v1.map(x => x / normVec(v1));
    v2 = v2.map(x => x / normVec(v2));

    let proj_u1_v1 = dotVec(u1, v1);
    let proj_u1_v2 = dotVec(u1, v2);
    let proj_u2_v1 = dotVec(u2, v1);
    let proj_u2_v2 = dotVec(u2, v2);
    
    // Matrice de projection 2x2
    let M = [[proj_u1_v1, proj_u1_v2],
             [proj_u2_v1, proj_u2_v2]];
    
    // Mesure d'alignement : norme de Frobenius au carré
    let alignment = proj_u1_v1*proj_u1_v1 + proj_u1_v2*proj_u1_v2 + 
                   proj_u2_v1*proj_u2_v1 + proj_u2_v2*proj_u2_v2;
    
    return alignment; // Valeur entre 0 (orthogonaux) et 2 (identiques)
}

function projOnPlane(x, u1, u2){
  let U = [u1,u2];
  let proj = [0,0,0,0,0,0];
  for(let u of U){
    let coeff = dotVec(x,u)/dotVec(u,u);
    proj = proj.map((pi,i)=>pi+coeff*u[i]);
  }
  return proj;
}

function planeShift(p1, u1, u2, p2, v1, v2) {
    // Distance de p1 au plan défini par (p2, v1, v2)
    let p1_to_p2 = subVec(p1, p2);
    let proj_p1_on_plane2 = projOnPlane(p1_to_p2, v1, v2);
    let dist1 = normVec(subVec(p1_to_p2, proj_p1_on_plane2));
    
    // Distance de p2 au plan défini par (p1, u1, u2)  
    let p2_to_p1 = subVec(p2, p1);
    let proj_p2_on_plane1 = projOnPlane(p2_to_p1, u1, u2);
    let dist2 = normVec(subVec(p2_to_p1, proj_p2_on_plane1));
    
    // Pour des plans parallèles, dist1 ≈ dist2
    // Pour des plans non-parallèles, on prend la moyenne
    return (dist1 + dist2) / 2;
}

function distanceAlignement(u1, u2, v1, v2) {
    let align = planeAlignment(u1, u2, v1, v2);
    return 2 - align; // entre 0 et 2
}

function distanceShift(p1, u1, u2, p2, v1, v2) {
    let shift = planeShift(p1, u1, u2, p2, v1, v2);
    return shift;
}

function distanceToPlane(p1, u1, u2, p2, v1, v2) {
    let alignDist = distanceAlignement(u1, u2, v1, v2); // entre 0 et 2
    let shiftDist = distanceShift(p1, u1, u2, p2, v1, v2); // entre 0 et +infini
    return shiftDist + alignDist; // entre 0 et +infini
}

function keyboardInput() {

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
            actionSound.rate(0.5);
            actionSound.setVolume(0.2)
            //actionSound.play();
        NextPosition();
    } else if (!keyIsDown(32)) {
        this.spacePressed = false;
    }
}


function mousePressed() {
    if (mouseButton === LEFT) { //centrer sur la souris
        updateMousePosition();

        moveQueue = [];
        transition.active = false;
        moveRequest(ax1, ax2, [...mousePos6D], 50, zoom);
    }
    if (mouseButton === RIGHT) { //rotation de l'espace sur la souris
        if(audioStarted){
            actionSound.rate(0.5);
            actionSound.setVolume(0.2)
            actionSound.play();
        }
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

function NextPosition() {
    if (!appReady) {
        startPending = true;
        return;
    }


    positionIndex = (positionIndex + 1) % posArray.length;

    moveQueue = [];
    transition.active = false;

    let pos = getPosition(positionIndex);
    if (pos) {
        console.log("Transition vers la position", positionIndex);
        let baseDuration = 20; // durée minimale en ms
        let scaleFactor = 40; // facteur d'échelle
        if (zoom > 2.0) {
            // juste dézoomer
            let logDistance = Math.abs(Math.log2(1.0 / zoom));
            let zoomDuration = baseDuration + (logDistance * scaleFactor);
            moveRequest(ax1, ax2, shift, zoomDuration, 1.0);
        }
        if(pos.zoom < 1.0){
            moveRequest(pos.ax1, pos.ax2, pos.shift, 250, pos.zoom);
        }else{
            moveRequest(pos.ax1, pos.ax2, pos.shift, 250, 1.0);
        }

        let logDistance = Math.abs(Math.log2(1.0 / pos.zoom));
        let zoomDuration = baseDuration + (logDistance * scaleFactor);
        moveRequest(pos.ax1, pos.ax2, pos.shift, zoomDuration, pos.zoom);


        if (pos.note == "Rotate Space") { //go at location then turn into Julia
            console.log("Rotation de l'espace demandé par la position");
            rotateSpace(pos.shift, 1);
        }

        if(pos.dialogue != undefined){
            if(pos.dialDelay != undefined){
                setTimeout((bubble)=>{
                    console.log("oui")
                    bubble.addTexts(pos.dialogue)
                    bubble.startAutoMode()
                }, pos.dialDelay*1000, bubble)
            }else{
                console.log("non")
                bubble.addTexts(pos.dialogue)
                bubble.startAutoMode()
            }
        }
    }
}

//rotation au tour de la sourie par défaut, ou autour d'un point donné, calcule automatique du plan de destination, précisiser 0 ou 1 pour forcer mandelbrot ou julia
function rotateSpace(newShiftP = [...mousePos6D], destination = null) {
    //inverser les dimension 1 et 2 avec 3 et 4  
    let newAx1 = [ax1[2], ax1[3], ax1[0], ax1[1], ax1[4], ax1[5]];
    let newAx2 = [ax2[2], ax2[3], ax2[0], ax2[1], ax2[4], ax2[5]];
    let newShift = [newShiftP[0], newShiftP[1], newShiftP[2], newShiftP[3], newShiftP[4], newShiftP[5]];

    //faire une condition avec la somme en val absolue des ax1[2] ax1[3] ax2[2] ax2[3], et comparer avec ax1[0] ax1[1] ax2[0] ax2[1]
    //si la somme des 3 et 4 est plus grande, on remet les ax1 et ax2 a leur position initiale
    let sum34 = Math.abs(ax1[2]) + Math.abs(ax1[3]) + Math.abs(ax2[2]) + Math.abs(ax2[3]);
    let sum12 = Math.abs(ax1[0]) + Math.abs(ax1[1]) + Math.abs(ax2[0]) + Math.abs(ax2[1]);

    if ((sum34 > sum12 && destination == null) || destination == 1) { //on est plus dans le plan de Mandelbrot que de Julia
        console.log("vers Julia")
        newAx1 = [1.0, 0.0, 0.0, 0.0, ax1[4], ax1[5]];
        newAx2 = [0.0, 1.0, 0.0, 0.0, ax2[4], ax2[5]];
        moveRequest(newAx1, newAx2, newShift, 250, 10.0);
        moveRequest(newAx1, newAx2, newShift, 100, 1.0);

    } else { //Julia vers Mandelbrot
        newAx1 = [0.0, 0.0, 1.0, 0.0, ax1[4], ax1[5]];
        newAx2 = [0.0, 0.0, 0.0, 1.0, ax2[4], ax2[5]];

        newShift = [0, 0, mousePos6D[2], mousePos6D[3], mousePos6D[4], mousePos6D[5]]; //mandelbrot bien que centré.
        console.log("vers Mandelbrot")
        if (zoom > 2.0) {
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
    let mouseYNorm = (height - mouseY) / height;

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


// --- BEGIN ADAPTIVE ---------------------------------------------------------
// Résolution adaptative : on mesure le framerate pendant les mouvements et on ajuste
// pixelDensity pour rester au dessus de FPS_MIN. Quand l'image ne bouge plus, on repasse
// en pleine définition ; quand ça rebouge, on repart de la dernière densité qui marchait.
const FPS_MIN = 24;          // en dessous : on baisse la définition
const FPS_TARGET = 30;       // fps visé quand on baisse
const FPS_COMFORT = 40;      // au dessus : on a de la marge, on peut remonter
const DENSITY_MIN = 0.25;    // jamais plus flou que ça
const DENSITY_STEP = 0.05;   // la densité est arrondie à ce pas (évite les micro-redimensionnements)
const IDLE_DENSITY = 1;      // définition quand l'image est immobile
const IDLE_FRAMES = 6;       // frames sans changement avant de passer en IDLE_DENSITY
const ADAPT_FRAMES = 8;      // nb de frames en mouvement mesurées avant chaque décision
const SKIP_AFTER_RESIZE = 2; // frames ignorées après un changement de densité (réallocation = frame lente)
const CEIL_MS = 4000;        // après une remontée ratée, durée pendant laquelle on ne retente pas (double à chaque échec)
const CEIL_MAX_MS = 32000;
const PERF_DEBUG = false;    // true : affiche les changements de densité dans la console

let curDensity = 1;          // densité appliquée au canvas
let motionDensity = 1;       // dernière densité choisie pendant un mouvement
let lastState = null;        // état de la dernière image dessinée
let stillFrames = 0;
let perfN = 0, perfT = 0, perfSkip = 0;
let lastAdaptWasUp = false, densityBeforeUp = 1, densityCeil = 1, ceilUntil = 0, ceilMs = CEIL_MS;

function quantDensity(d) {
    d = Math.round(d / DENSITY_STEP) * DENSITY_STEP;
    d = Math.min(1, Math.max(DENSITY_MIN, d));
    return Math.round(d * 1000) / 1000;
}

// applique une densité (arrondie) ; renvoie true si elle a changé
function applyDensity(d) {
    d = quantDensity(d);
    if (Math.abs(d - curDensity) < 1e-6) return false;
    curDensity = d;
    pixelDensity(d);
    perfN = 0; perfT = 0; perfSkip = SKIP_AFTER_RESIZE;
    if (PERF_DEBUG) console.log("pixelDensity ->", d);
    return true;
}

// appelée à chaque frame où l'image a changé : mesure le fps et ajuste la densité
function adaptDensity() {
    if (perfSkip > 0) { perfSkip--; return; }
    if (deltaTime > 500) return;                 // onglet en arrière-plan, gros hoquet... mesure non fiable
    perfN++; perfT += deltaTime;
    if (perfN < ADAPT_FRAMES) return;

    const fps = 1000 * perfN / perfT;
    perfN = 0; perfT = 0;
    const now = millis();

    // 1) trop lent : on baisse
    if (fps < FPS_MIN) {
        if (curDensity <= DENSITY_MIN) { lastAdaptWasUp = false; return; }
        let target;
        if (lastAdaptWasUp) {
            // on venait de remonter et ça ne tient pas : retour direct, et on attend de plus en plus longtemps avant de réessayer
            target = densityBeforeUp;
            densityCeil = densityBeforeUp;
            ceilUntil = now + ceilMs;
            ceilMs = Math.min(ceilMs * 2, CEIL_MAX_MS);
        } else {
            // le coût est ~ proportionnel au nombre de pixels (densité²)
            target = curDensity * Math.sqrt(fps / FPS_TARGET);
            if (quantDensity(target) >= curDensity) target = curDensity - DENSITY_STEP; // au moins un cran
        }
        lastAdaptWasUp = false;
        if (applyDensity(target)) motionDensity = curDensity;
        return;
    }

    // 2) assez rapide : la remontée précédente (si elle existe) a tenu
    if (lastAdaptWasUp) { lastAdaptWasUp = false; ceilMs = CEIL_MS; }

    // 3) peut-on remonter ?
    const ceil = now < ceilUntil ? densityCeil : 1;
    if (curDensity >= ceil) return;
    if (fps <= FPS_COMFORT) return;                                       // zone confortable (FPS_MIN..FPS_COMFORT) : on ne touche à rien

    let target = curDensity * Math.min(1.15, Math.sqrt(fps / FPS_TARGET)); // marge : on remonte doucement
    if (quantDensity(target) <= curDensity) target = curDensity + DENSITY_STEP;
    target = Math.min(target, ceil);
    const before = curDensity;
    if (applyDensity(target)) {
        densityBeforeUp = before;
        lastAdaptWasUp = true;
        motionDensity = curDensity;
    }
}

// tout ce qui influence l'image (le shader n'utilise ni time ni mouse)
function sceneState() {
    return [...shift, ...ax1, ...ax2, zoom, it, width, height];
}

function sameState(a, b) {
    if (!a || !b) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}
// --- END ADAPTIVE -----------------------------------------------------------

function draw() {    

    moveManager();
    keyboardInput();
    updateMousePosition();


    // --- résolution adaptative ---
    const state = sceneState();
    const changed = !sameState(state, lastState);
    lastState = state;
    let redraw = changed;

    if (changed) {
        // l'image bouge : si on était en pleine définition à l'arrêt, on repart de la dernière densité de mouvement
        if (stillFrames > 0) applyDensity(motionDensity);
        stillFrames = 0;
        adaptDensity();
    } else {
        stillFrames++;
        // image immobile : on repasse en pleine définition (une seule fois)
        if (stillFrames === IDLE_FRAMES && applyDensity(IDLE_DENSITY)) redraw = true;
    }

    // rien n'a changé -> on ne redessine pas (le canvas garde la dernière image)
    if (redraw) {
        //pas de vec6 dans les shaders, on splitte en vec4 et vec2
        myShader.setUniform('resolution', [width, height]);
        myShader.setUniform('mouse', [centerX, centerY]);
        myShader.setUniform('time', millis() / 1000.0);
        myShader.setUniform('izoom', 1 / zoom);
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


    // === partie masque de divergence ===
    if (changed) { // le masque ne dépend que de la scène : inutile de le relire si rien n'a bougé

        maskBuffer.shader(maskShader);

        maskShader.setUniform('resolution', [maskBuffer.width, maskBuffer.height]);
        maskShader.setUniform('mouse', [centerX, centerY]);
        maskShader.setUniform('time', millis() / 1000.0);
        maskShader.setUniform('izoom', 1 / zoom);
        maskShader.setUniform('imaxIt', it);

        maskShader.setUniform('shift4', [shift[0], shift[1], shift[2], shift[3]]);
        maskShader.setUniform('shift2', [shift[4], shift[5]]);
        maskShader.setUniform('ax1_4', [ax1[0], ax1[1], ax1[2], ax1[3]]);
        maskShader.setUniform('ax1_2', [ax1[4], ax1[5]]);
        maskShader.setUniform('ax2_4', [ax2[0], ax2[1], ax2[2], ax2[3]]);
        maskShader.setUniform('ax2_2', [ax2[4], ax2[5]]);

        maskBuffer.rect(0, 0, maskBuffer.width, maskBuffer.height);

        // récupérer pixels
        maskBuffer.loadPixels();

        let BlackCount = 0;
        let GreyCount = 0;
        for (let i = 0; i < maskBuffer.pixels.length; i += 4) {
            if (maskBuffer.pixels[i + 3] > 250) { // alpha > 0.5
                BlackCount++;
            }
            if (maskBuffer.pixels[i + 3] > 10) { // alpha > 0.5
                GreyCount++;
            }
        }
        percentageOfNonDivergence = BlackCount / (maskBuffer.width * maskBuffer.height);
        percentageOfHighDivergence = GreyCount / (maskBuffer.width * maskBuffer.height);
    }

    if (audioStarted) {
        updateSound(1 - percentageOfNonDivergence);
    }


    frameCount++;
}


let previousVolumes = new Array(nbTracks).fill(0);
const smoothingFactor = 0.05;


function updateSound(caveness) {
    caveness = constrain(caveness, 0, 1);

    // exponentiel pour mieux répartir
    let shaped = pow(caveness, 3);

    let freq = map(shaped, 0, 1, 130, 8000);//frequence du cutoff
    lowpass.freq(freq);


    
    //mandel avec exposant 2 (plan principal)
    let dist=1;
    let distminforall=1;
    let distFactor = 0.1;
    let targetVolumes = new Array(nbTracks).fill(0);
    
    
    dist = distanceToPlane(shift, ax1, ax2, [0, 0, 0, 0, 2, 0], e3, e4);
    distminforall = min(dist, distminforall);
    if (dist < distFactor) {
        targetVolumes[0] = (tracksNormaliseVolume[0] * (1.0- (1/distFactor)*dist));

    }else{
        //mandel avec exposant reel
        dist = distanceAlignement(ax1, ax2, e3, e4)*2 + abs(shift[5]);
        distminforall = min(dist, distminforall);
        if (dist < distFactor) {
            targetVolumes[2] = (tracksNormaliseVolume[2] * (1.0- (1/distFactor)*dist));
        }else{
            dist = distanceAlignement(ax1, ax2, e3, e4)*2
            distminforall = min(dist, distminforall);
            if(dist < distFactor){
                targetVolumes[3] = (tracksNormaliseVolume[3] * (1.0- (1/distFactor)*dist));
            }
        }
    }    

    //plan Julia
    dist = distanceAlignement(ax1, ax2, e1, e2);
    distminforall = min(dist, distminforall);
    if(dist < distFactor){
        targetVolumes[1] = (tracksNormaliseVolume[1] * (1.0- (1/distFactor)*dist));
    }

    dist = min(distanceAlignement(ax1, ax2, e5, e6), distanceAlignement(ax1, ax2, e1, e6))
    distminforall = min(dist, distminforall);
    if(dist < distFactor){
        targetVolumes[4] = (tracksNormaliseVolume[4] * (1.0- (1/distFactor)*dist));
    }

    dist = min(distanceAlignement(ax1, ax2, addVec(e3, e5), addVec(e4, e6)), distanceAlignement(ax1, ax2,addVec(e5, e1),addVec(e2, e6)))
    distminforall = min(dist, distminforall);
    if(dist < distFactor){
        targetVolumes[5] = (tracksNormaliseVolume[5] * (1.0- (1/distFactor)*dist));
    }

    if(distminforall > 0.4){
        targetVolumes[6] = (tracksNormaliseVolume[6] * min(distminforall-0.4, 0.1)*10);
    }

    for (let i = 0; i < tracks.length; i++) {
        // Interpolation linéaire vers le volume cible
        previousVolumes[i] = previousVolumes[i] + (targetVolumes[i] - previousVolumes[i]) * smoothingFactor;
        
        // Application seulement si le changement est significatif
        if (abs(tracks[i].getVolume() - previousVolumes[i]) > 0.0) {
            tracks[i].setVolume(previousVolumes[i]);
        }
    }
}

function getVolumeOfAllTracks(){
    for (let i = 0; i < tracks.length; i++) {
        console.log("track i = ", i, ", v = ", tracks[i].getVolume())
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

document.addEventListener('contextmenu', e => e.preventDefault()); //desactive le menu contextuel au clic droit

