let myShader; //shader principal

let maskShader; //recup l'information de l'image (heuristique)
let maskBuffer;

let frameCount = 0;
var percentageOfNonDivergence = 0;

let appReady = false; // vrai quand setup() est terminé
let startPending = false; // l'utilisateur a demandé à démarrer mais setup() n'était pas prêt

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
let dialogueTimeoutId = null;
let helpMenu;

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
        .setPosition(width / 2 - bubbleSize / 2, 50)
        .setSize(bubbleSize, 120)
        .setAnimationSpeed(3000, 2000, 60)
        .enableBlur(true);

    helpMenu = new HelpMenu();
    helpMenu.onNextPosition          = () => NextPosition();
    helpMenu.onPreviousPosition      = () => PreviousPosition();
    helpMenu.getCurrentPositionIndex = () => positionIndex;
    helpMenu.getPositionsCount       = () => posArray.length;
    helpMenu.getCurrentAxes          = () => [ax1, ax2];
    helpMenu.onUserInteract          = () => userTakeControl();
    helpMenu.onGoToPlane = (nax1, nax2) => {
        userTakeControl();
        moveQueue = [];
        transition.active = false;
        moveRequest(nax1, nax2, [...shift], 150, zoom);  // 15 frames ≈ 250ms
    }; 
    
    helpMenu.onResetPan = () => {
        userTakeControl();
        moveQueue = [];
        transition.active = false;
        // tout à zéro sauf a=2 → Mandelbrot à c=0
        moveRequest(ax1, ax2, [0, 0, 0, 0, 2, 0], 150, zoom);
    };
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
    u1 = u1.map(x => x / normVec(u1));
    u2 = u2.map(x => x / normVec(u2));
    v1 = v1.map(x => x / normVec(v1));
    v2 = v2.map(x => x / normVec(v2));

    let proj_u1_v1 = dotVec(u1, v1);
    let proj_u1_v2 = dotVec(u1, v2);
    let proj_u2_v1 = dotVec(u2, v1);
    let proj_u2_v2 = dotVec(u2, v2);

    let alignment = proj_u1_v1 * proj_u1_v1 + proj_u1_v2 * proj_u1_v2 +
        proj_u2_v1 * proj_u2_v1 + proj_u2_v2 * proj_u2_v2;

    return alignment;
}

function projOnPlane(x, u1, u2) {
    let U = [u1, u2];
    let proj = [0, 0, 0, 0, 0, 0];
    for (let u of U) {
        let coeff = dotVec(x, u) / dotVec(u, u);
        proj = proj.map((pi, i) => pi + coeff * u[i]);
    }
    return proj;
}

function planeShift(p1, u1, u2, p2, v1, v2) {
    let p1_to_p2 = subVec(p1, p2);
    let proj_p1_on_plane2 = projOnPlane(p1_to_p2, v1, v2);
    let dist1 = normVec(subVec(p1_to_p2, proj_p1_on_plane2));

    let p2_to_p1 = subVec(p2, p1);
    let proj_p2_on_plane1 = projOnPlane(p2_to_p1, u1, u2);
    let dist2 = normVec(subVec(p2_to_p1, proj_p2_on_plane1));

    return (dist1 + dist2) / 2;
}

function distanceAlignement(u1, u2, v1, v2) {
    let align = planeAlignment(u1, u2, v1, v2);
    return 2 - align;
}

function distanceShift(p1, u1, u2, p2, v1, v2) {
    return planeShift(p1, u1, u2, p2, v1, v2);
}

function distanceToPlane(p1, u1, u2, p2, v1, v2) {
    let alignDist = distanceAlignement(u1, u2, v1, v2);
    let shiftDist = distanceShift(p1, u1, u2, p2, v1, v2);
    return shiftDist + alignDist;
}

function keyboardInput() {
    let speed = -0.005 / zoom;
    let userMoved = false;

    if (keyIsDown(LEFT_ARROW))  { shift = addVec(shift, mulVec(e1, -speed)); userMoved = true; }
    if (keyIsDown(RIGHT_ARROW)) { shift = addVec(shift, mulVec(e1,  speed)); userMoved = true; }
    if (keyIsDown(UP_ARROW))    { shift = addVec(shift, mulVec(e2,  speed)); userMoved = true; }
    if (keyIsDown(DOWN_ARROW))  { shift = addVec(shift, mulVec(e2, -speed)); userMoved = true; }
    if (keyIsDown(81))          { shift = addVec(shift, mulVec(e3, -speed)); userMoved = true; } // Q
    if (keyIsDown(68))          { shift = addVec(shift, mulVec(e3,  speed)); userMoved = true; } // D
    if (keyIsDown(90))          { shift = addVec(shift, mulVec(e4,  speed)); userMoved = true; } // Z
    if (keyIsDown(83))          { shift = addVec(shift, mulVec(e4, -speed)); userMoved = true; } // S

    // ★ Nouveaux axes : e5 = a.real, e6 = a.imag
    if (keyIsDown(65))          { shift = addVec(shift, mulVec(e5, -speed)); userMoved = true; } // A
    if (keyIsDown(69))          { shift = addVec(shift, mulVec(e5,  speed)); userMoved = true; } // E
    if (keyIsDown(82))          { shift = addVec(shift, mulVec(e6,  speed)); userMoved = true; } // R
    if (keyIsDown(70))          { shift = addVec(shift, mulVec(e6, -speed)); userMoved = true; } // F

    if (userMoved) userTakeControl();

    if (keyIsDown(32) && this.spacePressed != true) {
        this.spacePressed = true;
        actionSound.rate(0.5);
        actionSound.setVolume(0.2);
        NextPosition();
    } else if (!keyIsDown(32)) {
        this.spacePressed = false;
    }
}

function eventIsOnCanvas(e) {
    if (e && e.target) return e.target.tagName === 'CANVAS';
    const el = document.elementFromPoint(mouseX, mouseY);
    return el && el.tagName === 'CANVAS';
}

function mousePressed(event) {
    if (!eventIsOnCanvas(event)) return;
    userTakeControl();

    if (mouseButton === LEFT) {
        updateMousePosition();
        moveQueue = [];
        transition.active = false;
        moveRequest(ax1, ax2, [...mousePos6D], 50, zoom);
    }
    if (mouseButton === RIGHT) {
        if (audioStarted) {
            actionSound.rate(0.5);
            actionSound.setVolume(0.2);
            actionSound.play();
        }
        updateMousePosition();
        moveQueue = [];
        transition.active = false;
        rotateSpace();
    }
}

function mouseWheel(event) {
    if (!eventIsOnCanvas(event)) return;
    userTakeControl();
    if (event.delta > 0)      zoom *= 0.8;
    else if (event.delta < 0) zoom *= 1.25;
    return false;
}

function NextPosition()     { goToPosition(positionIndex + 1); }
function PreviousPosition() { goToPosition(positionIndex - 1); }

function stopDialogue() {
    if (dialogueTimeoutId !== null) {
        clearTimeout(dialogueTimeoutId);
        dialogueTimeoutId = null;
    }
    if (bubble) bubble.stopAutoMode();
}

function userTakeControl() {
    if (!bubble || !bubble.isVisible) return;
    stopDialogue();
    bubble.hide();
}

function scheduleDialogue(pos) {
    if (dialogueTimeoutId !== null) {
        clearTimeout(dialogueTimeoutId);
        dialogueTimeoutId = null;
    }
    const delayMs = pos.dialDelay != undefined ? pos.dialDelay * 1000 : 0;
    if (delayMs > 0) {
        dialogueTimeoutId = setTimeout((bubble, dialogue) => {
            dialogueTimeoutId = null;
            bubble.addTexts(dialogue);
            bubble.startAutoMode();
        }, delayMs, bubble, pos.dialogue);
    } else {
        bubble.addTexts(pos.dialogue);
        bubble.startAutoMode();
    }
}

function goToPosition(targetIndex) {
    if (!appReady) { startPending = true; return; }

    positionIndex = ((targetIndex % posArray.length) + posArray.length) % posArray.length;
    moveQueue = [];
    transition.active = false;

    let pos = getPosition(positionIndex);
    if (!pos) return;

    stopDialogue();

    console.log("Transition vers la position", positionIndex);
    let baseDuration = 20, scaleFactor = 40;
    if (zoom > 2.0) {
        let logDistance = Math.abs(Math.log2(1.0 / zoom));
        moveRequest(ax1, ax2, shift, baseDuration + logDistance * scaleFactor, 1.0);
    }
    if (pos.zoom < 1.0) {
        moveRequest(pos.ax1, pos.ax2, pos.shift, 250, pos.zoom);
    } else {
        moveRequest(pos.ax1, pos.ax2, pos.shift, 250, 1.0);
    }
    let logDistance  = Math.abs(Math.log2(1.0 / pos.zoom));
    moveRequest(pos.ax1, pos.ax2, pos.shift, baseDuration + logDistance * scaleFactor, pos.zoom);

    if (pos.note == "Rotate Space") rotateSpace(pos.shift, 1);

    if (pos.dialogue != undefined) scheduleDialogue(pos);
}

function rotateSpace(newShiftP = [...mousePos6D], destination = null) {
    let newAx1 = [ax1[2], ax1[3], ax1[0], ax1[1], ax1[4], ax1[5]];
    let newAx2 = [ax2[2], ax2[3], ax2[0], ax2[1], ax2[4], ax2[5]];
    let newShift = [newShiftP[0], newShiftP[1], newShiftP[2], newShiftP[3], newShiftP[4], newShiftP[5]];

    let sum34 = Math.abs(ax1[2]) + Math.abs(ax1[3]) + Math.abs(ax2[2]) + Math.abs(ax2[3]);
    let sum12 = Math.abs(ax1[0]) + Math.abs(ax1[1]) + Math.abs(ax2[0]) + Math.abs(ax2[1]);

    if ((sum34 > sum12 && destination == null) || destination == 1) {
        console.log("vers Julia")
        newAx1 = [1.0, 0.0, 0.0, 0.0, ax1[4], ax1[5]];
        newAx2 = [0.0, 1.0, 0.0, 0.0, ax2[4], ax2[5]];
        moveRequest(newAx1, newAx2, newShift, 250, 10.0);
        moveRequest(newAx1, newAx2, newShift, 100, 1.0);
    } else {
        newAx1 = [0.0, 0.0, 1.0, 0.0, ax1[4], ax1[5]];
        newAx2 = [0.0, 0.0, 0.0, 1.0, ax2[4], ax2[5]];

        newShift = [0, 0, mousePos6D[2], mousePos6D[3], mousePos6D[4], mousePos6D[5]];
        console.log("vers Mandelbrot")
        if (zoom > 2.0) {
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
const FPS_MIN = 24;
const FPS_TARGET = 30;
const FPS_COMFORT = 40;
const DENSITY_MIN = 0.25;
const DENSITY_STEP = 0.05;
const IDLE_DENSITY = 1;
const IDLE_FRAMES = 6;
const ADAPT_FRAMES = 8;
const SKIP_AFTER_RESIZE = 2;
const CEIL_MS = 4000;
const CEIL_MAX_MS = 32000;
const PERF_DEBUG = false;

let curDensity = 1;
let motionDensity = 1;
let lastState = null;
let stillFrames = 0;
let perfN = 0, perfT = 0, perfSkip = 0;
let lastAdaptWasUp = false, densityBeforeUp = 1, densityCeil = 1, ceilUntil = 0, ceilMs = CEIL_MS;

function quantDensity(d) {
    d = Math.round(d / DENSITY_STEP) * DENSITY_STEP;
    d = Math.min(1, Math.max(DENSITY_MIN, d));
    return Math.round(d * 1000) / 1000;
}

function applyDensity(d) {
    d = quantDensity(d);
    if (Math.abs(d - curDensity) < 1e-6) return false;
    curDensity = d;
    pixelDensity(d);
    perfN = 0; perfT = 0; perfSkip = SKIP_AFTER_RESIZE;
    if (PERF_DEBUG) console.log("pixelDensity ->", d);
    return true;
}

function adaptDensity() {
    if (perfSkip > 0) { perfSkip--; return; }
    if (deltaTime > 500) return;
    perfN++; perfT += deltaTime;
    if (perfN < ADAPT_FRAMES) return;

    const fps = 1000 * perfN / perfT;
    perfN = 0; perfT = 0;
    const now = millis();

    if (fps < FPS_MIN) {
        if (curDensity <= DENSITY_MIN) { lastAdaptWasUp = false; return; }
        let target;
        if (lastAdaptWasUp) {
            target = densityBeforeUp;
            densityCeil = densityBeforeUp;
            ceilUntil = now + ceilMs;
            ceilMs = Math.min(ceilMs * 2, CEIL_MAX_MS);
        } else {
            target = curDensity * Math.sqrt(fps / FPS_TARGET);
            if (quantDensity(target) >= curDensity) target = curDensity - DENSITY_STEP;
        }
        lastAdaptWasUp = false;
        if (applyDensity(target)) motionDensity = curDensity;
        return;
    }

    if (lastAdaptWasUp) { lastAdaptWasUp = false; ceilMs = CEIL_MS; }

    const ceil = now < ceilUntil ? densityCeil : 1;
    if (curDensity >= ceil) return;
    if (fps <= FPS_COMFORT) return;

    let target = curDensity * Math.min(1.15, Math.sqrt(fps / FPS_TARGET));
    if (quantDensity(target) <= curDensity) target = curDensity + DENSITY_STEP;
    target = Math.min(target, ceil);
    const before = curDensity;
    if (applyDensity(target)) {
        densityBeforeUp = before;
        lastAdaptWasUp = true;
        motionDensity = curDensity;
    }
}

function sceneState() {
    return [...shift, ...ax1, ...ax2, zoom, it, width, height];
}

function sameState(a, b) {
    if (!a || !b) return false;
    for (let i = 0; i < a.length; i++)
        if (a[i] !== b[i]) return false;
    return true;
}
// --- END ADAPTIVE -----------------------------------------------------------

function draw() {
    moveManager();
    keyboardInput();
    updateMousePosition();

    const state = sceneState();
    const changed = !sameState(state, lastState);
    lastState = state;
    let redraw = changed;

    if (changed) {
        if (stillFrames > 0) applyDensity(motionDensity);
        stillFrames = 0;
        adaptDensity();
    } else {
        stillFrames++;
        if (stillFrames === IDLE_FRAMES && applyDensity(IDLE_DENSITY)) redraw = true;
    }

    if (redraw) {
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

    if (changed) {
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

        maskBuffer.loadPixels();

        let BlackCount = 0;
        let GreyCount = 0;
        for (let i = 0; i < maskBuffer.pixels.length; i += 4) {
            if (maskBuffer.pixels[i + 3] > 250) BlackCount++;
            if (maskBuffer.pixels[i + 3] > 10)  GreyCount++;
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
    let shaped = pow(caveness, 3);
    let freq = map(shaped, 0, 1, 130, 8000);
    lowpass.freq(freq);

    let dist = 1;
    let distminforall = 1;
    let distFactor = 0.1;
    let targetVolumes = new Array(nbTracks).fill(0);

    dist = distanceToPlane(shift, ax1, ax2, [0, 0, 0, 0, 2, 0], e3, e4);
    distminforall = min(dist, distminforall);
    if (dist < distFactor) {
        targetVolumes[0] = (tracksNormaliseVolume[0] * (1.0 - (1 / distFactor) * dist));
    } else {
        dist = distanceAlignement(ax1, ax2, e3, e4) * 2 + abs(shift[5]);
        distminforall = min(dist, distminforall);
        if (dist < distFactor) {
            targetVolumes[2] = (tracksNormaliseVolume[2] * (1.0 - (1 / distFactor) * dist));
        } else {
            dist = distanceAlignement(ax1, ax2, e3, e4) * 2;
            distminforall = min(dist, distminforall);
            if (dist < distFactor) {
                targetVolumes[3] = (tracksNormaliseVolume[3] * (1.0 - (1 / distFactor) * dist));
            }
        }
    }

    dist = distanceAlignement(ax1, ax2, e1, e2);
    distminforall = min(dist, distminforall);
    if (dist < distFactor) {
        targetVolumes[1] = (tracksNormaliseVolume[1] * (1.0 - (1 / distFactor) * dist));
    }

    dist = min(distanceAlignement(ax1, ax2, e5, e6), distanceAlignement(ax1, ax2, e1, e6));
    distminforall = min(dist, distminforall);
    if (dist < distFactor) {
        targetVolumes[4] = (tracksNormaliseVolume[4] * (1.0 - (1 / distFactor) * dist));
    }

    dist = min(distanceAlignement(ax1, ax2, addVec(e3, e5), addVec(e4, e6)),
               distanceAlignement(ax1, ax2, addVec(e5, e1), addVec(e2, e6)));
    distminforall = min(dist, distminforall);
    if (dist < distFactor) {
        targetVolumes[5] = (tracksNormaliseVolume[5] * (1.0 - (1 / distFactor) * dist));
    }

    if (distminforall > 0.4) {
        targetVolumes[6] = (tracksNormaliseVolume[6] * min(distminforall - 0.4, 0.1) * 10);
    }

    for (let i = 0; i < tracks.length; i++) {
        previousVolumes[i] = previousVolumes[i] + (targetVolumes[i] - previousVolumes[i]) * smoothingFactor;
        if (abs(tracks[i].getVolume() - previousVolumes[i]) > 0.0) {
            tracks[i].setVolume(previousVolumes[i]);
        }
    }
}

function getVolumeOfAllTracks() {
    for (let i = 0; i < tracks.length; i++) {
        console.log("track i = ", i, ", v = ", tracks[i].getVolume());
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

document.addEventListener('contextmenu', e => e.preventDefault());