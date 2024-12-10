console.log('bonour !')

var canvas;
var ctx;
var grid1 = [];
var grid2 = [];
var currentGrid = 1;
var gridWidth;
var gridHeight;
var gridCellSize = 5;
var colorBackground = "#111";
var colorCell = "#0B0"; //555
var mousseX;
var mousseY;
var clickBool = false;

var filtre = [0.68, -0.9, 0.68,
    -0.9, 0.66, -0.9,
    0.68, -0.9, 0.68
]

var activationType = "inverseBelleCurve"

function setup() {
    canvas = document.getElementById("NeuralCellularAutomata");
    ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;


    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;


    gridHeight = Math.ceil(canvas.height / gridCellSize) + 1;
    gridWidth = Math.ceil(canvas.width / gridCellSize) + 1;


    //init des grids
    for (var i = 0; i < gridWidth; i++) {
        grid1[i] = new Array(gridHeight);
        grid2[i] = new Array(gridHeight);
    }

    for (var x = 0; x < gridWidth; x++) {
        for (var y = 0; y < gridHeight; y++) {
            grid1[x][y] = 0;
            grid2[x][y] = 0;
        }
    }


    InitGridCells() // pour démarrer une generation random
    grid1[10][10] = 0.5


    IntervalTime = setInterval(loop, 20);
}

function loop() {

    ctx.fillStyle = colorBackground; //met le plan en noir
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    Processe();


    ctx.strokeStyle = colorCell;

    for (var x = 0; x < gridWidth; x++) {
        for (var y = 0; y < gridHeight; y++) {
            if (currentGrid == 1) {
                DrawCell(x, y, grid1[x][y]);
            }
            if (currentGrid == 2) {
                DrawCell(x, y, grid2[x][y]);
            }
        }
    }

    //switch btw 1 and 2 for cureent grid
    if (currentGrid == 1) {
        currentGrid = 2;
    } else if (currentGrid == 2) {
        currentGrid = 1;
    }
}


function Processe() {


    for (var x = 0; x < gridWidth; x++) {
        for (var y = 0; y < gridHeight; y++) {
            let filtering = 0;
            if (currentGrid == 1) {
                filtering = Filtre(grid1[mod(x - 1, gridWidth)][mod(y - 1, gridHeight)], grid1[mod(x, gridWidth)][mod(y - 1, gridHeight)], grid1[mod(x + 1, gridWidth)][mod(y - 1, gridHeight)],
                    grid1[mod(x - 1, gridWidth)][mod(y, gridHeight)], grid1[mod(x, gridWidth)][mod(y, gridHeight)], grid1[mod(x + 1, gridWidth)][mod(y, gridHeight)],
                    grid1[mod(x - 1, gridWidth)][mod(y + 1, gridHeight)], grid1[mod(x, gridWidth)][mod(y + 1, gridHeight)], grid1[mod(x + 1, gridWidth)][mod(y + 1, gridHeight)]);

                grid2[x][y] = activationF(filtering);
            } else {
                filtering = Filtre(grid2[mod(x - 1, gridWidth)][mod(y - 1, gridHeight)], grid2[mod(x, gridWidth)][mod(y - 1, gridHeight)], grid2[mod(x + 1, gridWidth)][mod(y - 1, gridHeight)],
                    grid2[mod(x - 1, gridWidth)][mod(y, gridHeight)], grid2[mod(x, gridWidth)][mod(y, gridHeight)], grid2[mod(x + 1, gridWidth)][mod(y, gridHeight)],
                    grid2[mod(x - 1, gridWidth)][mod(y + 1, gridHeight)], grid2[mod(x, gridWidth)][mod(y + 1, gridHeight)], grid2[mod(x + 1, gridWidth)][mod(y + 1, gridHeight)]);
                grid1[x][y] = activationF(filtering);
            }


        }
    }


}



function Filtre(a, b, c, d, e, f, g, h, i) {
    return a * filtre[0] + b * filtre[1] + c * filtre[2] + d * filtre[3] + e * filtre[4] + f * filtre[5] + g * filtre[6] + h * filtre[7] + i * filtre[8];
}

function DrawCell(x, y, a) {
    if (a > 0) {
        //console.log(x,y, gridCellSize, a)
        ctx.fillStyle = colorCell;
        /*ctx.beginPath();
        ctx.arc(x * gridCellSize, y * gridCellSize, 5, 0, 2 * Math.PI, true);
        ctx.stroke();*/
        ctx.beginPath();
        ctx.fillRect(x * gridCellSize, y * gridCellSize, gridCellSize, gridCellSize);
        ctx.fill();
    }
}

function InitGridCells() {
    //nothing for the moment
    for (var x = 0; x < gridWidth - 1; x++) { //-1 sinon ça marche pas mais jsp pq
        for (var y = 0; y < gridHeight; y++) {
            grid1[x][y] = nb_random(0, 1);
        }
    }
}

function activationF(x) {
    if (activationType == "identity") {
        if (x < 0) {
            return 0
        }
        if (x > 1) {
            return 1
        }
        return x;
    }

    if(activationType == "inverseBelleCurve"){
        return -1/(2**(0.6*(x**2)))+1
    }

    if(activationType = "GOL"){
        if(x== 3 || x==11 || x==12){
            return 1;
        }else{
            return 0;
        }
    }
}



function mod(x, a) {
    let b = x % a;
    if (b < 0) {
        return a + b
    } else {
        return b
    }
}

function MouseCoordonate(event) { //fonction permettant de récupérer les coordonnés x y de la souris sur la page
    if (event.clientX != 0 && event.clientY != 0) {
        mousseX = event.clientX - 8
        mousseY = event.clientY - 8
    }

    if (clickBool) {
        var x = Math.round(mousseX / gridCellSize);
        var y = Math.round(mousseY / gridCellSize);
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if(currentGrid == 1){
                    grid1[x+i][y+j] = 1;
                }
                if(currentGrid == 2){
                    grid2[x+i][y+j] = 1;
                }
            }
        }
    }
}

function Click(val) {
    clickBool = val;
}


function nb_random(min, max) { //fonction générant un nobre aléatoir  min et max inclue
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


setup()