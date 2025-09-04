var canvas
var ctx
let width = 600
let height = 600
const gpu = new window.GPU.GPU();


let prevState;
let currState;
let time = 0;
let mouseX = 0;
let mouseY = 0;
let isMouseLeftDown = false;
let bord = 0;

canvas = document.getElementById("waveSimulation");
ctx = canvas.getContext("2d");
ctx.canvas.width = width
ctx.canvas.height = height
canvas.style.height = '100%';
let colorIntensity = 10;
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;

function create2DArray(w, h) {
    return Array.from({
        length: h
    }, () => Array(w).fill(0));
}

function initializeStates() {
    prevState = create2DArray(width, height);
    currState = create2DArray(width, height);
}
initializeStates();


const stepKernel = gpu.createKernel(function (curr, prev) {
    const x = this.thread.x;
    const y = this.thread.y;
    const speed = 0.2
    const center = curr[y][x];
    const up = y > 0 ? curr[y - 1][x] : 0;
    const down = y < this.constants.height - 1 ? curr[y + 1][x] : 0;
    const left = x > 0 ? curr[y][x - 1] : 0;
    const right = x < this.constants.width - 1 ? curr[y][x + 1] : 0;

    const laplacian = up + down + left + right - 4 * center;

    // équation d'onde discrète basique : u_{n+1} = 2u_n - u_{n-1} + c² * laplacian(u_n)
    return 2 * center - prev[y][x] + speed * laplacian;
}, {
    output: [width, height],
    constants: {
        width,
        height
    }
});


function drawGrid(grid) {
    const imageData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const threshold = 0.01;
            const v = grid[y][x];
            const color = Math.floor((v * 2 + 1) / 2 * 255);
            const index = (y * width + x) * 4;
            imageData.data[index] = 0;
            imageData.data[index + 1] = 0;
            imageData.data[index + 2] = 0;
            imageData.data[index + 3] = 255;
            if (v > threshold) {
                imageData.data[index] = 255 * v * colorIntensity;
            }
            if (v < -threshold) {
                imageData.data[index + 2] = -255 * v * colorIntensity;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function loop() {
    const nextState = stepKernel(currState, prevState);

    drawGrid(nextState);
    //addPeriodicSource(currState, Math.floor(width / 2), Math.floor(height / 2), time, 1, 0.1);
    if (isMouseLeftDown) {
        currState[Math.floor(mouseY)][Math.floor(mouseX)] = 1;
    }

    prevState = currState;
    currState = nextState.map(row => Array.from(row));

    requestAnimationFrame(loop);
    time++;
}


function addPeriodicSource(grid, x, y, time, frequency, amplitude) {
    grid[y][x] += amplitude * Math.sin(2 * Math.PI * frequency * time / 60); // Assuming 60 FPS roughly
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = Math.floor((e.clientX - rect.left) * scaleX);
    mouseY = Math.floor((e.clientY - rect.top) * scaleY);
    console.log(mouseX, mouseY)
});

// Écouteur d'événement pour le clic gauche enfoncé sur le canvas
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // 0 correspond au bouton gauche
        isMouseLeftDown = true;
        console.log("press")
    }
});

// Écouteur d'événement pour le relâchement du clic gauche sur le canvas
canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        isMouseLeftDown = false;
        console.log("release")
    }
});
document.getElementById('resetButton').addEventListener('click', () => {
    time = 0;
    initializeStates()
});

document.getElementById('intensitySlider').addEventListener('input', function () {
    colorIntensity = parseInt(this.value);
    document.getElementById('intensityValue').textContent = colorIntensity;
});


loop()