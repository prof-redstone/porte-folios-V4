// DialogueBubble.js - Système de bulle de dialogue zen avec HTML/CSS
// Version HTML pour compatibilité WEBGL - CORRIGÉE

class DialogueBubble {
    constructor() {
        // Configuration
        this.config = {
            // Position (pourcentages ou pixels)
            x: 50,              // pixels depuis la gauche
            y: 50,              // pixels depuis le haut
            width: 350,         // largeur en pixels
            minHeight: 100,     // hauteur minimum
            
            // Style
            backgroundColor: 'rgba(58, 58, 58, 0.31)',
            borderColor: 'rgba(255, 255, 255, 0)',
            borderWidth: '1px',
            borderRadius: '40px',
            textColor: '#ffffffde',
            fontSize: '30px',
            
            // Animations zen (en ms)
            fadeInDuration: 3000,
            fadeOutDuration: 2000,
            typewriterSpeed: 80,
            displayDuration: 10000,  // Durée par défaut plus courte
            pauseBetweenTexts: 1000,
            
            // Options
            useTypewriter: false,
            useBlur: true,
        };
        
        // État
        this.currentText = "";
        this.isVisible = false;
        this.animationState = "hidden";
        this.typewriterIndex = 0;
        this.textQueue = [];
        this.currentQueueIndex = 0;
        this.autoMode = false;
        
        // Éléments DOM
        this.container = null;
        this.textElement = null;
        this.buttonElement = null;
        
        // Timers
        this.fadeTimer = null;
        this.typewriterTimer = null;
        this.displayTimer = null;
        
        this.createElements();
    }
    
    createElements() {
        // Container principal
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            left: ${this.config.x}px;
            top: ${this.config.y}px;
            width: fit-content;
            max-width: 800px;
            text-align: center;
            box-sizing: border-box;
            background: ${this.config.backgroundColor};
            border: ${this.config.borderWidth} solid ${this.config.borderColor};
            border-radius: ${this.config.borderRadius};
            padding: 20px;
            z-index: 9999;
            opacity: 0;
            text-align: center;
            transform: translateY(10px);
            transition: all 2.0s ease;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            pointer-events: none;
        `;
        
        // Effet de flou si demandé
        if (this.config.useBlur) {
            this.container.style.backdropFilter = 'blur(5px)';
            this.container.style.webkitBackdropFilter = 'blur(5px)';
        }
        
        // Texte
        this.textElement = document.createElement('div');
        this.textElement.style.cssText = `
            color: ${this.config.textColor};
            font-size: ${this.config.fontSize};
            line-height: 1.4;
            min-height: 60px;
        `;
        
        // Bouton (caché par défaut)
        this.buttonElement = document.createElement('button');
        this.buttonElement.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            color: ${this.config.textColor};
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            display: none;
            transform: translateY(5px);
            pointer-events: none;
        `;
        
        this.buttonElement.addEventListener('mouseenter', () => {
            this.buttonElement.style.background = 'rgba(255, 255, 255, 0.2)';
            this.buttonElement.style.transform = 'translateY(0px)';
        });
        
        this.buttonElement.addEventListener('mouseleave', () => {
            this.buttonElement.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        // Assemblage
        this.container.appendChild(this.textElement);
        this.container.appendChild(this.buttonElement);
        document.body.appendChild(this.container);
    }
    
    // Configuration facile
    setPosition(x, y) {
        this.config.x = x;
        this.config.y = y;
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
        return this;
    }
    
    setSize(width, minHeight) {
        this.config.width = width;
        this.config.minHeight = minHeight;
        this.container.style.width = `${width}px`;
        this.container.style.minHeight = `${minHeight}px`;
        return this;
    }
    
    setAnimationSpeed(fadeIn, fadeOut, typewriter) {
        this.config.fadeInDuration = fadeIn;
        this.config.fadeOutDuration = fadeOut;
        this.config.typewriterSpeed = typewriter;
        return this;
    }
    
    // NOUVEAU: méthode pour définir la durée d'affichage
    setDisplayDuration(duration) {
        this.config.displayDuration = duration;
        return this;
    }
    
    setStyle(bgColor, textColor, borderColor) {
        if (bgColor) {
            this.config.backgroundColor = bgColor;
            this.container.style.background = bgColor;
        }
        if (textColor) {
            this.config.textColor = textColor;
            this.textElement.style.color = textColor;
            this.buttonElement.style.color = textColor;
        }
        if (borderColor) {
            this.config.borderColor = borderColor;
            this.container.style.borderColor = borderColor;
        }
        return this;
    }
    
    enableBlur(enable) {
        this.config.useBlur = enable;
        if (enable) {
            this.container.style.backdropFilter = 'blur(5px)';
            this.container.style.webkitBackdropFilter = 'blur(5px)';
        } else {
            this.container.style.backdropFilter = 'none';
            this.container.style.webkitBackdropFilter = 'none';
        }
        return this;
    }
    
    // Afficher un texte avec bouton optionnel
    showText(text, buttonText = null, buttonCallback = null, duration = null) {
        this.clearTimers();
        
        this.currentText = text;
        this.typewriterIndex = 0;
        this.isVisible = true;
        this.animationState = "fading_in";
        
        // Configuration du bouton
        if (buttonText && buttonCallback) {
            this.buttonElement.textContent = buttonText;
            this.buttonElement.onclick = () => {
                buttonCallback();
                this.hide();
            };
        } else {
            this.buttonElement.style.opacity = '0';
            this.buttonElement.style.pointerEvents = 'none';
        }
        
        // Animation d'entrée
        this.container.style.pointerEvents = 'auto';
        this.container.style.opacity = '1';
        this.container.style.transform = 'translateY(0px)';
        
        // Démarrer le typewriter
        if (this.config.useTypewriter) {
            this.startTypewriter();
        } else {
            this.textElement.innerHTML = text;  // Changé en innerHTML
            this.showButton();
        }
        
        // Timer de disparition automatique (si pas de bouton ET pas en mode auto)
        if (!buttonText && !this.autoMode) {
            const displayTime = duration || this.config.displayDuration;
            if (displayTime > 0) {
                this.displayTimer = setTimeout(() => {
                    this.hide();
                }, displayTime);
            }
        }
        
        return this;
    }
    
    startTypewriter() {
        this.textElement.innerHTML = "";  // Changé en innerHTML
        this.typewriterIndex = 0;
        
        // Pour le typewriter avec HTML, on doit traiter différemment
        // On va créer un div temporaire pour parser le HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.currentText;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        const typeNextChar = () => {
            if (this.typewriterIndex < plainText.length) {
                // Pour l'effet typewriter, on utilise le texte brut
                this.textElement.textContent = plainText.substring(0, this.typewriterIndex + 1);
                this.typewriterIndex++;
                this.typewriterTimer = setTimeout(typeNextChar, this.config.typewriterSpeed);
            } else {
                // Une fois terminé, on affiche le HTML complet
                this.textElement.innerHTML = this.currentText;
                this.showButton();
            }
        };
        
        typeNextChar();
    }
    
    showButton() {
        if (this.buttonElement.textContent.trim() !== '') {
            setTimeout(() => {
                this.buttonElement.style.opacity = '1';
                this.buttonElement.style.transform = 'translateY(0px)';
                this.buttonElement.style.pointerEvents = 'auto';
            }, 500); // petit délai après la fin du texte
        }
    }
    
    // File d'attente de textes
    addTexts(texts) {
        this.textQueue = Array.isArray(texts) ? texts : [texts];
        this.currentQueueIndex = 0;
        return this;
    }
    
    startAutoMode() {
        if (this.textQueue.length > 0) {
            this.autoMode = true;
            this.currentQueueIndex = 0;
            this.showNextInQueue();
        }
        return this;
    }
    
    // MÉTHODE CORRIGÉE - Une seule fois
    showNextInQueue() {
        if (!this.autoMode || this.textQueue.length === 0) {
            return;
        }
        
        const text = this.textQueue[this.currentQueueIndex];
        console.log(`Affichage du texte ${this.currentQueueIndex}: "${text}"`); // Debug
        
        // Afficher le texte actuel
        this.showText(text, null, null, null);
        
        // Programmer la transition vers le texte suivant
        const displayTime = this.config.displayDuration;
        console.log(`Timer programmé pour ${displayTime}ms`); // Debug
        
        this.displayTimer = setTimeout(() => {
            console.log("Timer expiré, transition vers le texte suivant"); // Debug
            
            this.hide(() => {
                // Passer au texte suivant
                this.currentQueueIndex++;
                console.log(`Index suivant: ${this.currentQueueIndex}`); // Debug
                
                // Vérifier s'il reste des textes à afficher
                if (this.currentQueueIndex < this.textQueue.length) {
                    // Il reste des textes, continuer
                    setTimeout(() => {
                        if (this.autoMode) {
                            this.showNextInQueue();
                        }
                    }, this.config.pauseBetweenTexts);
                } else {
                    // Tous les textes ont été affichés, arrêter le mode auto
                    console.log("Tous les textes ont été affichés, arrêt du mode auto");
                    this.autoMode = false;
                }
            });
        }, displayTime);
    }
    
    // Cacher la bulle
    hide(callback = null) {
        this.clearTimers();
        this.animationState = "fading_out";
        
        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(-10px)';
        this.buttonElement.style.opacity = '0';
        this.buttonElement.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.isVisible = false;
            this.animationState = "hidden";
            this.container.style.pointerEvents = 'none';
            if (callback) callback();
        }, 500);
    }
    
    // Arrêter le mode auto
    stopAutoMode() {
        this.autoMode = false;
        this.clearTimers();
        console.log("Mode automatique arrêté"); // Debug
    }
    
    clearTimers() {
        if (this.fadeTimer) {
            clearTimeout(this.fadeTimer);
            this.fadeTimer = null;
        }
        if (this.typewriterTimer) {
            clearTimeout(this.typewriterTimer);
            this.typewriterTimer = null;
        }
        if (this.displayTimer) {
            clearTimeout(this.displayTimer);
            this.displayTimer = null;
        }
    }
    
    // Nettoyer complètement
    destroy() {
        this.clearTimers();
        this.stopAutoMode();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Exemple d'utilisation corrigée :
/*
let bubble;

function setup() {
    createCanvas(800, 600, WEBGL);
    
    let bubbleSize = 800;
    bubble = new DialogueBubble()
        .setPosition(width/2-bubbleSize/2, 70)
        .setSize(bubbleSize, 120)
        .setAnimationSpeed(2000, 1500, 60)
        .setDisplayDuration(3000)  // 3 secondes d'affichage
        .enableBlur(true);

    bubble.addTexts([
        "Welcome to the fascinating world of the Mandelbrot fractal,",
        "The Mandelbrot fractal is governed by a single rule: Z = Z<sup>a</sup> + C.",
        "Each point represents a complex number...",
        "Watch as the patterns emerge from simple mathematics..."
    ]).startAutoMode();
}

function draw() {
    background(20);
    // Votre rendu WEBGL ici...
}

// Arrêter le mode auto avec la barre d'espace
function keyPressed() {
    if (key === ' ') {
        bubble.stopAutoMode();
    }
}
*/