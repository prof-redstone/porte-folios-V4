info();
console.log("input info() for further information");
var canvas;
var ctx;
var H;
var W;

var time;
var mode = 'road' //change after when the road is finally edited

var mousebtndown = false;
var mousePos = [];

var roadPoint = [];
var spawnPoint = [0, 0];
var finishPoint = [0, 0];

var nbcars = 100;
var carscollec = [];

var maxTimeGeneration = 600;
var thisGenerationTime = 0;

function setup() {
    var canvas = document.getElementById("IAcarsNeuroevolution");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    H = ctx.canvas.height;
    W = ctx.canvas.width;
    time = 0;

    for (let i = 0; i < nbcars; i++) {
        carscollec[i] = new car();
        carscollec[i].init(i);
        carscollec[i].reset();
    }

    SetupNeuroevolutionNetwork({
        nbEntity: nbcars,
        pattern: [5, 5, 5, 4]
    })

    roadPoint = [[103, 142],[93, 281],[313, 304],[645, 267],[924, 300],[1068, 333],[1149, 464],[1060, 558],[1001, 654],[1130, 678],[1366, 658],[1377, 274],[1381, 93],[921, 106],[562, 72],[245, 90],[105, 146],[98, 146]]
    spawnPoint = [189, 208]
    finishPoint = [1092, 621]
    startSimulation()
    setInterval(loop, 30);


}


function loop() {
    ctx.fillStyle = "#EEE"
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = "rgba(0,0,255,1)"
    //draw road
    ctx.lineWidth = 8
    ctx.lineCap = "round";
    for (let i = 0; i < roadPoint.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(roadPoint[i][0], roadPoint[i][1]);
        ctx.lineTo(roadPoint[i + 1][0], roadPoint[i + 1][1]);
        ctx.stroke();
    }
    ctx.lineWidth = 3

    //draw spawn and finish point
    ctx.beginPath();
    ctx.arc(spawnPoint[0], spawnPoint[1], 5, 0, 6)
    ctx.fillStyle = "#F00";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(finishPoint[0], finishPoint[1], 5, 0, 6)
    ctx.fillStyle = "#0F0";
    ctx.fill();

    
    ctx.strokeStyle = "rgba(0,0,0,0.2)"

    //phase principale
    if (mode == "training") {

        for (let i = 0; i < carscollec.length; i++) {
            carscollec[i].sensorsUpdate();
            carscollec[i].processe();
            carscollec[i].update();
            carscollec[i].collision();
        }
        for (let i = 0; i < carscollec.length; i++) {
            carscollec[i].render();
        }


        time++
        thisGenerationTime++
        if (thisGenerationTime >= maxTimeGeneration) {//to make the new generation
            thisGenerationTime = 0;
            //newGeneration();
            var scoreByIndex = []
            for (let i = 0; i < carscollec.length; i++) {
                scoreByIndex.push([carscollec[i].getScore(), carscollec[i].geneIndex]);
            }
            getScoreOfGeneration(scoreByIndex);

            nextGeneration();

            //cars.reset()
            for (let i = 0; i < carscollec.length; i++) {
                carscollec[i].reset();
            }
        }
    }
}

function startSimulation() {
    mode = "training";
    for (let i = 0; i < carscollec.length; i++) {
        carscollec[i].reset()
    }
}

function car() {
    this.x;
    this.y;
    this.angle;
    this.geneIndex;
    this.score;
    this.alive;
    this.timeAlive;
    this.color;
    this.maxLenghtSensor;
    this.speed;
    this.maxSpeed = 5;
    this.speedRot;
    this.sensorsAngle = []; //angle btw sensors and orientation, + indicate nb of sensor
    
    // output
    this.turn; //-1 left, 0 forward, 1 right
    this.move; //move forward or not

    //input
    this.sensors = []; //the value of sensors

    this.init = function(geneIndex) {
        this.geneIndex = geneIndex;
        this.color = getRndColor();
        this.speed = 2;
        this.speedRot = 0.05;
        this.turn = 0;
        this.maxLenghtSensor = 300;
        this.sensorsAngle = [-1.57, -0.78, 0, 0.78, 1.57]; //in rad
        this.reset()
    }

    this.reset = function() {
        this.alive = true;
        this.x = spawnPoint[0];
        this.y = spawnPoint[1];
        this.angle = 0;
        this.score = 0;
        this.timeAlive = 0;
    }

    this.update = function() {
        if (this.alive) {
            this.x += this.move * this.speed * Math.cos(this.angle)
            this.y += this.move * this.speed * Math.sin(this.angle)
            this.angle += (this.turn - 0.5) * this.speedRot
            this.timeAlive++;
        }
    }

    this.collision = function() {
        for (let i = 0; i < roadPoint.length - 1; i++) {
            if (lineCircle(roadPoint[i][0], roadPoint[i][1], roadPoint[i + 1][0], roadPoint[i + 1][1], this.x, this.y, 10)) {
                this.alive = false;
            }
        }
    }

    this.sensorsUpdate = function() {
        for (let i = 0; i < this.sensorsAngle.length; i++) {
            let dist = 0;
            for (let j = 0; j < roadPoint.length - 1; j++) {
                let newDist = SensorCollision(
                    this.x,
                    this.y,
                    this.x + this.maxLenghtSensor * Math.cos(this.angle + this.sensorsAngle[i]),
                    this.y + this.maxLenghtSensor * Math.sin(this.angle + this.sensorsAngle[i]),
                    roadPoint[j][0],
                    roadPoint[j][1],
                    roadPoint[j + 1][0],
                    roadPoint[j + 1][1],
                );
                if (newDist > dist) {
                    dist = newDist;
                }

            }

            this.sensors[i] = dist;
        }
    }

    this.render = function() {
        //ball
        const size = 20; // Taille du triangle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Calculer les trois sommets du triangle
        const x1 = this.x + size * Math.cos(this.angle); // Pointe avant
        const y1 = this.y + size * Math.sin(this.angle);
        const x2 = this.x + size * 0.5 * Math.cos(this.angle + Math.PI * 2 / 3); // Coin gauche
        const y2 = this.y + size * 0.5 * Math.sin(this.angle + Math.PI * 2 / 3);
        const x3 = this.x + size * 0.5 * Math.cos(this.angle - Math.PI * 2 / 3); // Coin droit
        const y3 = this.y + size * 0.5 * Math.sin(this.angle - Math.PI * 2 / 3);

        // Tracer le triangle
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();

        // Little line pointer direction
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 20 * Math.cos(this.angle), this.y + 20 * Math.sin(this.angle));
        ctx.stroke();

        // Sensors
        for (let i = 0; i < this.sensorsAngle.length; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + (1 - this.sensors[i]) * this.maxLenghtSensor * Math.cos(this.angle + this.sensorsAngle[i]),
                this.y + (1 - this.sensors[i]) * this.maxLenghtSensor * Math.sin(this.angle + this.sensorsAngle[i])
            );
            ctx.stroke();
        }
    }

    this.processe = function() {
        //processe the neural network by passing inputs and get back output to move in consequence
        let input = [
            [this.sensors[0]],
            [this.sensors[1]],
            [this.sensors[2]],
            [this.sensors[3]],
            [this.sensors[4]],
            [Math.sqrt((this.x - finishPoint[0]) * (this.x - finishPoint[0]) + (this.y - finishPoint[1]) * (this.y - finishPoint[1]))/100] //distance to goal
        ]
        //console.log(this.sensors[2])
        let output = networkProcesse(input, this.geneIndex);

        this.move = output[0][0];

        this.turn = 0;
        if (output[1][0] > 0.5) {
            this.turn += 1
        }
        if (output[2][0] > 0.5) {
            this.turn += -1
        }
        this.speed = Math.min(Math.max(output[3][0]*this.maxSpeed,0), this.maxSpeed);
    }

    this.getScore = function() {
        let distToGoal = Math.sqrt((this.x - finishPoint[0]) * (this.x - finishPoint[0]) + (this.y - finishPoint[1]) * (this.y - finishPoint[1]));
        let distOfStartToGoal = Math.sqrt((spawnPoint[0] - finishPoint[0]) * (spawnPoint[0] - finishPoint[0]) + (spawnPoint[1] - finishPoint[1]) * (spawnPoint[1] - finishPoint[1]));
        let proportionScore = 10;
        this.score = (distOfStartToGoal - distToGoal) * proportionScore + this.timeAlive;
        return this.score;
    }

}

//Line to line collision detector modified
function SensorCollision(x1, y1, x2, y2, x3, y3, x4, y4) {

    // calculate the distance to intersection point
    let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

        // optionally, draw a circle where the lines meet
        let intersectionX = x1 + (uA * (x2 - x1));
        let intersectionY = y1 + (uA * (y2 - y1));

        let dist = Math.sqrt((x1 - intersectionX) * (x1 - intersectionX) + (y1 - intersectionY) * (y1 - intersectionY));
        //normalize lenght btw 0 and 1
        dist = dist / (Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));
        //invert, lim -> 1 quand + en + proche du mur
        dist = 1 - dist;

        return dist;
    }
    return 0;
}

function RoadEdit(option) {
    if (option != undefined) {
        if (option[0] == "mousedown" && mode == "road") {
            roadPoint.push([option[1], option[2]])
        }
    }
}


addEventListener('mousedown', (event) => {
    mousebtndown = true;
    //to place a new wall
    RoadEdit(["mousedown", event.clientX, event.clientY])
});

addEventListener('mouseup', (event) => {
    mousebtndown = false;
    RoadEdit(["mouseup"])
});

document.addEventListener('keydown', function(event) {
    if (mode == "road") {
        if (event.keyCode == 83) { //s for spawn point
            spawnPoint = [mousePos[0], mousePos[1]];
        } else if (event.keyCode == 70) { //f for finish point
            finishPoint = [mousePos[0], mousePos[1]];
        } else if (event.keyCode == 32) { //space to start
            time = 0;
            startSimulation();
        } else if (event.keyCode == 8) { //backspace to reset road
            roadPoint = [];
        }
    } else if (mode == 'training') {
        if (event.keyCode == 37) { //left to decrease thisTimeGeneration 
            maxTimeGeneration -= 100;
            console.log("MaxTimeGeneration : ", maxTimeGeneration);
        } else if (event.keyCode == 39) { //right to increase thisTimeGeneration 
            maxTimeGeneration += 100;
            console.log("MaxTimeGeneration : ", maxTimeGeneration);
        } else if (event.keyCode == 32) { //space to start
            mode = "road";
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (mode == 'training') {
        
    }
});


addEventListener("mousemove", (event) => {
    //met a jour la pos de la souris
    mousePos = [event.clientX, event.clientY]
});



function nb_random(min, max) { //fonction générant un nombre aléatoire entier min et max inclue [min;max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRndColor() {
    var r = 255 * Math.random() | 0,
        g = 255 * Math.random() | 0,
        b = 255 * Math.random() | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}


function info(){
    console.log("Press right-click to place wall, 's' to place spawn point, 'f' for the end of track, then presse 'space' to start simulation.")
    console.log("Make sure to close path of wall to prevent car exhaust");
    console.log("During the car training, press left-arrow to decrease the time for each generation, and right-arrow to increase it.")
}


setup()