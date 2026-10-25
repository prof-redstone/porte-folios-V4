
var cardsCollection = [
  {
    title: "Minecraft Clone",
    description: "A from-scratch recreation of Minecraft's core gameplay in C++ and OpenGL, with no game engine. I first built my own 3D engine (lighting, shadow mapping, skybox), then grew it into a voxel world: chunk streaming, Perlin-noise terrain, multiple biomes with procedural trees and vegetation, 29 block types, block placing/breaking via voxel raycasting, real-time shadows and player physics. Everything from meshing to world generation was written by hand.",
    langage: ["C++", "OpenGL", "GLFW", "GLSL"],
    video: "img/videoProject/Minecraft.mp4",
    image: "img/imageProject/Minecraft.webp",
    code: "https://github.com/prof-redstone/minecraft",
    action: "https://github.com/prof-redstone/minecraft",
    anne: "2025"
  },
  {
    title: "GLaDOS Project",
    description: "Video summarizing the creation process of GLaDOS, my new connected home assistant inspired by the game Portal, from modeling its head, 3D printing, developing the internal AI, enabling it to speak with its authentic voice, and more.",
    langage: ["C", "python", "3D modeling", "3D printing", "AI"],
    video: "img/videoProject/PresGlados.mp4",
    image: "img/imageProject/PresGlados.webp",
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
    image: "img/imageProject/RayMarching.webp",
    code: "https://github.com/prof-redstone/porte-folios-V4/tree/master/ext/FractalRaymarching",
    action: "ext/FractalRaymarching/index.html",
    run: "ext/FractalRaymarching/index.html",
    anne: "2023"
  },
  {
    title: "Sandbox simulation",
    description: "C++ sandbox simulation built from scratch, using SFML library for rendering. The simulation features a variety of materials, each with unique physical properties and behaviors, such as reacting to heat, dissolving in water, or being set on fire... Dynamic interactions include lava cooling into stone, water evaporating into steam, and acid corroding materials, allowing for the creation of complex, interactive environments.",
    langage: ["C++", "SFML"],
    video: "img/videoProject/Sandbox.mp4",
    image: "img/imageProject/Sandbox.webp",
    code: "https://github.com/prof-redstone/sandbox",
    action: "https://github.com/prof-redstone/sandbox",
    anne: "2022"
  },
  {
    title: "Mandelbrot 6D",
    description: "An immersive fractal experience, extending the Mandelbrot set to complex exponents with a 6D camera. You can explore the fractal freely, rotate in real time between Mandelbrot and Julia planes. Watch the visuals evolve with the geometry and a reactive soundtrack. A scripted guided journey introduces the mathematics step by step, making the experience accessible to anyone.  Built with p5.js and custom GLSL shaders.",
    langage: ["p5.js", "GLSL"],
    video: "img/videoProject/MandelBrotGPU.mp4",
    image: "img/imageProject/MandelBrotGPU.webp",
    code: "https://github.com/prof-redstone/porte-folios-V4/tree/master/ext/MandelbrotGPU",
    action: "ext/MandelbrotGPU/index.html",
    run: "ext/MandelbrotGPU/index.html",
    anne: "2025"
  },
];

var archivedCardsCollection = [
  {
    title: "Board game online",
    description: "A Node.js server using Socket.io that enables turn-based board games to be played from anywhere in the world. It features the ability to create public or private game rooms that can be joined with a code, includes an integrated instant chat, and allows users to customize their nickname.",
    langage: ["NodeJS", "Socket.io", "JS", "html", "CSS"],
    video: "img/videoProject/BoardGame.mp4",
    image: "img/imageProject/BoardGame.webp",
    code: "https://github.com/prof-redstone/online-game-board",
    action: "https://github.com/prof-redstone/online-game-board",
    anne: "2020",
  },
  {
    title: "TIPE",
    description: "High school Supervised Personal Initiative Project (TIPE), abacus simulation to study randomness and variance in the results of games of chance like the lottery, depending on chosen parameters and initial conditions. Combining Newtonian physics, probability, and computer simulation.",
    langage: ["C++", "Python"],
    video: "img/videoProject/Tipe.mp4",
    image: "img/imageProject/Tipe.webp",
    code: "https://github.com/prof-redstone/TIPE",
    action: "https://github.com/prof-redstone/TIPE",
    anne: "2024",
  },
];

var imagesCards1 = [{
    source: "img/fractal/0.webp",
    title: "Polygonal fractal",
    action: "ext/polygoneFractal/index.html"
  },
  {
    source: "img/fractal/1.webp",
    title: "Angle flower",
    action: "ext/AngleFlower/index.html"
  },
  {
    source: "img/fractal/2.webp",
    title: "Chaos fractal",
    action: "ext/ChaosFractal/index.html"
  },
  {
    source: "img/fractal/3.webp",
    title: "Dragon curve",
    action: "ext/DragonCurve/index.html"
  },
  {
    source: "img/fractal/4.webp",
    title: "Chaos fractal II",
    action: "ext/ChaosFractal2/index.html"
  },
  {
    source: "img/fractal/5.webp",
    title: "3D raymarching",
    action: "ext/FractalRaymarching/index.html"
  },
  {
    source: "img/fractal/6.webp",
    title: "Fractal tree",
    action: "ext/fractal_tree/index.html"
  },
  {
    source: "img/fractal/7.webp",
    title: "Fractal generator",
    action: "ext/fractalGen/index.html"
  },
  {
    source: "img/fractal/8.webp",
    title: "Newton fractal",
    action: "ext/NewtonFractal/index.html"
  },
  {
    source: "img/fractal/9.webp",
    title: "Lorenz attractor",
    action: "ext/LorenzAttractor/index.html"
  },
  {
    source: "img/fractal/10.webp",
    title: "Mandelbrot GPU",
    action: "ext/MandelbrotGPU/index.html"
  }
]

var imagesCards2 = [{
  source: "img/tiling/1.webp",
  title: "Growing circles",
  action: "ext/growingCircle/index.html"
},
{
  source: "img/tiling/2.webp",
  title: "Flower tiling",
  action: "ext/pavageFlower/index.html"
},
{
  source: "img/tiling/3.webp",
  title: "Hexagonal tiling",
  action: "ext/pavageHex/index.html"
},
{
  source: "img/tiling/4.webp",
  title: "Kite tiling",
  action: "ext/pavageKite/index.html"
},
{
  source: "img/tiling/5.webp",
  title: "Triangle tiling",
  action: "ext/pavageTriangle/index.html"
},
{
  source: "img/tiling/6.webp",
  title: "Penrose tiling",
  action: "ext/penroseTiling/index.html"
},
{
  source: "img/tiling/7.webp",
  title: "Triangle maze",
  action: "ext/triangleMaze/index.html"
},
{
  source: "img/tiling/8.webp",
  title: "Star pattern",
  action: "ext/starPattern/index.html"
},
{
  source: "img/tiling/9.webp",
  title: "Circular tiling",
  action: "ext/tiling/index.html"
},
]

var imagesCards3 = [{
  source: "img/simulation/1.webp",
  title: "Game of Life",
  action: "ext/GameOfLife/index.html"
},
{
  source: "img/simulation/2.webp",
  title: "Grass simulation",
  action: "ext/grassSimulation/index.html"
},
{
  source: "img/simulation/3.webp",
  title: "Particle life",
  action: "ext/particleLife/index.html"
},
{
  source: "img/simulation/4.webp",
  title: "Dino game",
  action: "ext/DinoGame/index.html"
},
{
  source: "img/simulation/5.webp",
  title: "Black hole shader",
  action: "ext/BlackHoleShader/index.html"
},
{
  source: "img/simulation/6.webp",
  title: "Environment project",
  action: "ext/environment_projectV2/index.html"
},
{
  source: "img/simulation/7.webp",
  title: "Neuron web",
  action: "ext/neuron_web/index.html"
},
{
  source: "img/simulation/8.webp",
  title: "Clock background",
  action: "ext/ClockBackground/index.html"
},
{
  source: "img/simulation/9.webp",
  title: "Matrix full screen",
  action: "ext/matrixFullScreen/index.html"
},
{
  source: "img/simulation/11.webp",
  title: "Fluid simulation",
  action: "ext/FluidSimulation/index.html"
},
{
  source: "img/simulation/13.webp",
  title: "Reaction diffusion",
  action: "ext/reactionDiffusion/index.html"
},
{
  source: "img/simulation/14.webp",
  title: "Genetic neural network",
  action: "ext/geneticNeuralNetwork/index.html"
},
{
  source: "img/simulation/15.webp",
  title: "AI cars neuroevolution",
  action: "ext/IAcarsNeuroevolution/index.html"
},
{
  source: "img/simulation/16.webp",
  title: "Hexagonal Game of Life",
  action: "ext/hexGOL/index.html"
},
{
  source: "img/simulation/17.webp",
  title: "Wave simulation",
  action: "ext/WaveSimulation/index.html"
}
]