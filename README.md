
## Démo en ligne : <a href="https://tomd.ovh">https://tomd.ovh</a>



Mon portfolio personnel.

Le site est écrit entièrement en **HTML / CSS / JavaScript vanilla**, aucun framework, aucun outil de build. Toutes les animations sont faites à la main en `<canvas>`.

Le dépôt contient aussi **`ext/`**, une collection de ~59 mini-expériences web interactives (fractales, pavages, simulations, shaders GLSL) directement jouables dans le navigateur.

---


## Les sections du site

| Section | Contenu |
|---|---|
| **Home** | Présentation |
| **About** | Parcours et photo |
| **Projects** | Cartes des meilleurs projets avec **vidéo de démo**, technologies et liens GitHub |
| **Slides** | 3 carrousels d'**expériences interactives** |
| **Skills** | 7 catégories cliquables (Dev logiciel, Front, Back, Graphics, ML, Design, Autres) avec icônes |
| **Contact** | GitHub / LinkedIn / e-mail |

---

## Projets vedettes

| Projet | Année | Technologies | Lien |
|---|---|---|---|
| **Minecraft Clone** | 2025 | C++, OpenGL, GLFW, GLSL | [GitHub](https://github.com/prof-redstone/minecraft) |
| **GLaDOS Project** | 2024 | C, Python, IA, modélisation & impression 3D | [Vidéo](https://www.youtube.com/watch?v=4LW9Yb6zW9s) · [GitHub](https://github.com/prof-redstone/GLaDOS-PC-arduino) |
| **3D Fractals Raymarching** | 2023 | GLSL, JS | [Jouer en ligne](ext/FractalRaymarching/index.html) |
| **Sandbox simulation** | 2022 | C++, SFML | [GitHub](https://github.com/prof-redstone/sandbox) |
| **Fractals generator** | 2021 | C++, SFML | [GitHub](https://github.com/prof-redstone/fractals-generator) |
| **Board game online** *(archivé)* | 2020 | NodeJS, Socket.io, JS | [GitHub](https://github.com/prof-redstone/online-game-board) |
| **TIPE** *(archivé)* | 2024 | C++, Python | [GitHub](https://github.com/prof-redstone/TIPE) |

---

## `ext/` — ~59 expériences interactives

Chaque dossier est une page web autonome, jouable directement dans le navigateur depuis le site (section *Slides*).

- **Fractales & mathématiques** — Mandelbrot (GPU & écran), Julia / Chaos, Newton, Dragon Curve, courbe de Lorenz, arbre fractal, rose des vents fractale…
- **Pavages & motifs** — Penrose, pavages en hexagones / trapèzes / triangles, labyrinthes triangéraux, motifs étoilés…
- **Simulations & automates** — Game of Life, vie des particules, réaction-diffusion, fluides (SPH), ondes, boids, trou noir, neuroévolution de voitures, réseau de neurones génétique…
- **Shaders & effets** — raymarching fractal 3D, matrice plein écran, horloge, pluie, DVD animé…

---

## Stack & architecture

```
porte-folios-V4/
├── index.html          # page unique (toutes les sections)
├── css/                # styles (navbar, sections, animations de texte…)
├── JS/                 # logique par section, cartes projets, auto-typage
├── canvasScript/       # neuron web, tuiles, simulation d'herbe
├── ext/                # ~59 expériences web autonomes (+ libraries/)
└── img/                # icônes, photos, vignettes et vidéos de projets
```

- **Vanilla JS**, sans dépendance
- Typographie [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)
- Animations `<canvas>` écrites à la main
- Images en WebP ; vidéos préchargées en arrière-plan après la page sur desktop, jouées uniquement à l'écran (chargement à la demande sur mobile ou connexion lente)

---

## Contact

- **GitHub :** [prof-redstone](https://github.com/prof-redstone)
- **LinkedIn :** [in/tom-demagny](https://www.linkedin.com/in/tom-demagny/)
- **Mail :** [tom.demagny@gmail.com](mailto:tom.demagny@gmail.com)
