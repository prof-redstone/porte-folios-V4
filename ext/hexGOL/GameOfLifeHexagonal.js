var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var slider = document.getElementById("speedSlider");
var InpLong = document.getElementById("long")
var InpLarg = document.getElementById("larg")
var Button = document.getElementById("1frame")
var InpSize = document.getElementById("size")


var gride = new HexagonalGride(100,100)
gride.hexRadius = 5
gride.ligneDirection = 0
gride.init()

var grideCopie = new HexagonalGride(200,200)
grideCopie.hexRadius = 3
grideCopie.ligneDirection = 0
grideCopie.init()

var size = gride.SizeGride()
canvas.width = size[0]
canvas.height = size[1]

var interval = setInterval(draw, 200)

var dirty = [];
var fullDraw = true;

function draw(){
    update()
    show()
}

function show(){
    if (fullDraw || dirty.length === 0) {
        let size = gride.SizeGride()
        ctx.fillStyle = "#363946";
        ctx.fillRect(0,0,size[0], size[1]);
        ctx.strokeStyle = "#2a2c36";
        ctx.lineWidth = 1;
        for (let i = 0; i < gride.width; i++) {
            for (let j = 0; j < gride.height; j++) {
                let pos = gride.GetXYCoordinate(i,j)
                gride.PathDrawHex(pos[0], pos[1], ctx);
                if (gride.gride[j][i] == 1) {
                    ctx.fillStyle = "#58A4B0";
                    ctx.fill();
                } else {
                    ctx.fillStyle = "#363946";
                    ctx.fill();
                }
                ctx.stroke();
            }
        }
        fullDraw = false;
    } else {
        ctx.strokeStyle = "#2a2c36";
        ctx.lineWidth = 1;
        for (let k = 0; k < dirty.length; k++) {
            let i = dirty[k][0];
            let j = dirty[k][1];
            let pos = gride.GetXYCoordinate(i,j)
            gride.PathDrawHex(pos[0], pos[1], ctx);
            if (gride.gride[j][i] == 1) {
                ctx.fillStyle = "#58A4B0";
                ctx.fill();
            } else {
                ctx.fillStyle = "#363946";
                ctx.fill();
            }
            ctx.stroke();
        }
    }
}

function initGride(){
    for (let i = 0; i < gride.height; i++) {
        for (let j = 0; j < gride.width; j++) {
            gride.gride[i][j] = nb_random(0,1)
            
        }
    }
    draw()
}

function update(){
    dirty = [];
    for(var i = 0; i < gride.height; i++){
        for(var j = 0; j < gride.width; j++){
            grideCopie.gride[i][j] = gride.gride[i][j];
        }
    }

    for(var i = 0; i < gride.height; i++){
        for(var j = 0; j < gride.width; j++){

            let voisins = grideCopie.GetNeighbourCoordinate(j,i)
            let nbV = 0
            for (let k = 0; k < voisins.length; k++) {
                if (voisins[k][0] != undefined || voisins[k][1] != undefined) {
                    if (grideCopie.gride[voisins[k][1]][voisins[k][0]] == 1) {
                        nbV++
                    }
                }
            }

            let newVal = gride.gride[i][j];
            if(grideCopie.gride[i][j] == 1){
                if(!(nbV == 3)){
                    gride.gride[i][j] = 0;
                }
            }else{
                if(nbV == 2){
                    gride.gride[i][j] = 1;
                }
            }
            if (gride.gride[i][j] !== newVal) {
                dirty.push([j, i]);
            }
        }
    }
}

function ChangeFrameRate(val){
        clearInterval(interval)
        if(val != 0){
            interval = setInterval(draw, val);
        }
}

function ChangeSize(long=100, larg=100, size = 5){
    fullDraw = true;
    dirty = [];
    gride = new HexagonalGride(parseInt(long),parseInt(larg));
    gride.hexRadius = parseInt(size);
    gride.ligneDirection = 0;
    gride.init();

    grideCopie = new HexagonalGride(parseInt(long),parseInt(larg));
    grideCopie.hexRadius = parseInt(size);
    grideCopie.ligneDirection = 0;
    grideCopie.init();

    size = gride.SizeGride();
    canvas.width = size[0];
    canvas.height = size[1];
    
    initGride();
}

slider.oninput = function() {
    if(slider.value == 10){
        ChangeFrameRate(0)
    }else{
        ChangeFrameRate(50*slider.value)
    }
}

Button.onclick = function(){
    draw()
}

InpLong.oninput = function() {
    ChangeSize(InpLong.value, InpLarg.value, InpSize.value)
}

InpLarg.oninput = function() {
    ChangeSize(InpLong.value, InpLarg.value, InpSize.value)
}

InpSize.oninput = function() {
    ChangeSize(InpLong.value, InpLarg.value, InpSize.value)
}

canvas.onclick = function(e){
    console.log(e)
    let pos = gride.GetGrideCoordinate(e.x, e.y)
    console.log(pos)
    gride.gride[pos[0]][pos[1]] = 1
    show();
}

function nb_random(min, max){ //fonction générant un nobre aléatoir  min et max inclue
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

initGride()

//var timer = setInterval(draw, 200)
