
var cardsCollection = [
  {
    title: "GLaDOS Project",
    description: "Video summarizing the creation process of GLaDOS, my new connected home assistant inspired by the game Portal, from modeling its head, 3D printing, developing the internal AI, enabling it to speak with its authentic voice, and more.",
    langage: ["C", "python", "3D modeling", "3D printing", "AI"],
    video: "img/videoProject/PresGlados.mp4",
    image: "img/imageProject/PresGlados.jpg",
    run: "https://www.youtube.com/watch?v=4LW9Yb6zW9s",
    action: "https://www.youtube.com/watch?v=4LW9Yb6zW9s",
    code: "https://github.com/prof-redstone/GLaDOS-PC-arduino",
    anne: "2024"
  },
  {
    title: "3D Fractals Raymarching",
    description: "A GLSL shader that enables immersion into the world of 3D folding space fractals using \"ray marching\". It generates intricate and dynamic fractal patterns by combining space-folding transformations, iterative scaling, and advanced lighting techniques.",
    langage: ["GLSL", "JS"],
    video: "img/videoProject/RayMarching.mp4",
    image: "img/imageProject/RayMarching.jpg",
    code: "https://github.com/prof-redstone/porte-folios-V4/tree/master/p5js/FractalRaymarching",
    action: "p5js/FractalRaymarching/index.html",
    run: "p5js/FractalRaymarching/index.html",
    anne: "2023"
  },
  {
    title: "Fractals generator",
    description: "A program for visualizing and navigating Mandelbrot fractals, the Julia set, and the Burning Ship. The program is written in C++ using SFML, with customizable colors and rendering parameters.",
    langage: ["C++", "SFML"],
    video: "img/videoProject/PresFractalC++.mp4",
    image: "img/imageProject/PresFractalC++.jpg",
    code: "https://github.com/prof-redstone/fractals-generator",
    action: "https://github.com/prof-redstone/fractals-generator",
    anne: "2021"
  },
  {
    title: "Sandbox simulation",
    description: "C++ sandbox simulation built from scratch, using SFML library for rendering. The simulation features a variety of materials, each with unique physical properties and behaviors, such as reacting to heat, dissolving in water, or being set on fire... Dynamic interactions include lava cooling into stone, water evaporating into steam, and acid corroding materials, allowing for the creation of complex, interactive environments.",
    langage: ["C++", "SFML"],
    video: "img/videoProject/Sandbox.mp4",
    image: "img/imageProject/Sandbox.jpg",
    code: "https://github.com/prof-redstone/sandbox",
    action: "https://github.com/prof-redstone/sandbox",
    anne: "2022"
  },
  {
    title: "Board game online",
    description: "A Node.js server using Socket.io that enables turn-based board games to be played from anywhere in the world. It features the ability to create public or private game rooms that can be joined with a code, includes an integrated instant chat, and allows users to customize their nickname.",
    langage: ["NodeJS", "Socket.io", "JS", "html", "CSS"],
    video: "img/videoProject/BoardGame.mp4",
    image: "img/imageProject/BoardGame.jpg",
    code: "https://github.com/prof-redstone/online-game-board",
    action: "https://github.com/prof-redstone/online-game-board",
    anne: "2020",
  },
  {
    title: "TIPE",
    description: "High school Supervised Personal Initiative Project (TIPE), abacus simulation to study randomness and variance in the results of games of chance like the lottery, depending on chosen parameters and initial conditions. Combining Newtonian physics, probability, and computer simulation.",
    langage: ["C++", "Python"],
    video: "img/videoProject/Tipe.mp4",
    image: "img/imageProject/Tipe.jpg",
    code: "https://github.com/prof-redstone/TIPE",
    action: "https://github.com/prof-redstone/TIPE",
    anne: "2024",
  },
];

var imagesCards1 = [{
    source: "img/fractal/0.png",
    action: "/ext/polygoneFractal/index.html"
  },
  {
    source: "img/fractal/1.png",
    action: "/ext/AngleFlower/index.html"
  },
  {
    source: "img/fractal/2.png",
    action: "/ext/ChaosFractal/index.html"
  },
  {
    source: "img/fractal/3.png",
    action: "/ext/DragonCurve/index.html"
  },
  {
    source: "img/fractal/4.png",
    action: "/ext/ChaosFractal2/index.html"
  },
  {
    source: "img/fractal/5.png",
    action: "/ext/FractalRaymarching/index.html"
  },
  {
    source: "img/fractal/6.png",
    action: "/ext/fractal_tree/index.html"
  },
  {
    source: "img/fractal/7.png",
    action: "/ext/fractalGen/index.html"
  },
  {
    source: "img/fractal/8.png",
    action: "/ext/NewtonFractal/index.html"
  },
  {
    source: "img/fractal/9.png",
    action: "/ext/LorenzAttractor/index.html"
  },
]

var imagesCards2 = [{
  source: "img/tiling/1.png",
  action: "ext/growingCircle/index.html"
},
{
  source: "img/tiling/2.png",
  action: "ext/pavageFlower/index.html"
},
{
  source: "img/tiling/3.png",
  action: "ext/pavageHex/index.html"
},
{
  source: "img/tiling/4.png",
  action: "ext/pavageKite/index.html"
},
{
  source: "img/tiling/5.png",
  action: "ext/pavageTriangle/index.html"
},
{
  source: "img/tiling/6.png",
  action: "ext/penroseTiling/index.html"
},
{
  source: "img/tiling/7.png",
  action: "ext/triangleMaze/index.html"
},
{
  source: "img/tiling/8.png",
  action: "ext/starPattern/index.html"
},
{
  source: "img/tiling/9.png",
  action: "ext/tiling/index.html"
},
]

var imagesCards3 = [{
  source: "img/simulation/1.png",
  action: "ext/GameOfLife/index.html"
},
{
  source: "img/simulation/2.png",
  action: "ext/grassSimulation/index.html"
},
{
  source: "img/simulation/3.png",
  action: "ext/particleLife/index.html"
},
{
  source: "img/simulation/4.png",
  action: "ext/DinoGame/index.html"
},
{
  source: "img/simulation/5.png",
  action: "ext/BlackHoleShader/index.html"
},
{
  source: "img/simulation/6.png",
  action: "ext/environment_projectV2/index.html"
},
{
  source: "img/simulation/7.png",
  action: "ext/neuron_web/index.html"
},
{
  source: "img/simulation/8.png",
  action: "ext/ClockBackground/index.html"
},
{
  source: "img/simulation/9.png",
  action: "ext/matrixFullScreen/index.html"
},
{
  source: "img/simulation/10.png",
  action: "ext/flower/index.html"
},
{
  source: "img/simulation/11.png",
  action: "ext/FluidSimulation/index.html"
},
{
  source: "img/simulation/12.png",
  action: "ext/DVDanimation/index.html"
},
{
  source: "img/simulation/13.png",
  action: "ext/reactionDiffusion/index.html"
},
{
  source: "img/simulation/14.png",
  action: "ext/geneticNeuralNetwork/index.html"
},
{
  source: "img/simulation/15.png",
  action: "ext/IAcarsNeuroevolution/index.html"
},
]