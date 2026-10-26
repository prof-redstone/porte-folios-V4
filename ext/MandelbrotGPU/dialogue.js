class DialogueBubble {
    constructor() {
        this.config = {
            x: 50, y: 50, width: 350, minHeight: 100,
            backgroundColor: 'rgba(58, 58, 58, 0.26)',
            borderColor: 'rgba(255, 255, 255, 0)',
            borderWidth: '1px',
            borderRadius: '40px',
            textColor: '#ffffffde',
            fontSize: '35px',
            fadeInDuration: 3000,
            fadeOutDuration: 2000,
            typewriterSpeed: 80,
            displayDuration: 8000,
            pauseBetweenTexts: 1000,
            useTypewriter: false,
            useBlur: true,
        };

        this.currentText = "";
        this.isVisible = false;
        this.animationState = "hidden";
        this.typewriterIndex = 0;
        this.textQueue = [];
        this.currentQueueIndex = 0;
        this.autoMode = false;
        this.autoRunId = 0;   // incrémenté à chaque start/stop → invalide les anciens runs

        this.container = null;
        this.textElement = null;
        this.buttonElement = null;

        this.fadeTimer = null;
        this.typewriterTimer = null;
        this.displayTimer = null;
        this.hideTimer = null;

        this.createElements();
    }

    createElements() {
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
            transform: translateY(10px);
            transition: all 2.0s ease;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            pointer-events: none;             /* ★ ne bloque JAMAIS les clics */
        `;
        if (this.config.useBlur) {
            this.container.style.backdropFilter = 'blur(5px)';
            this.container.style.webkitBackdropFilter = 'blur(5px)';
        }

        this.textElement = document.createElement('div');
        this.textElement.style.cssText = `
            color: ${this.config.textColor};
            font-size: ${this.config.fontSize};
            line-height: 1.4;
            min-height: 60px;
        `;

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

        this.container.appendChild(this.textElement);
        this.container.appendChild(this.buttonElement);
        document.body.appendChild(this.container);
    }

    setPosition(x, y) { this.config.x = x; this.config.y = y; this.container.style.left = `${x}px`; this.container.style.top = `${y}px`; return this; }
    setSize(width, minHeight) { this.config.width = width; this.config.minHeight = minHeight; this.container.style.width = `${width}px`; this.container.style.minHeight = `${minHeight}px`; return this; }
    setAnimationSpeed(fadeIn, fadeOut, typewriter) { this.config.fadeInDuration = fadeIn; this.config.fadeOutDuration = fadeOut; this.config.typewriterSpeed = typewriter; return this; }
    setDisplayDuration(duration) { this.config.displayDuration = duration; return this; }
    setStyle(bgColor, textColor, borderColor) {
        if (bgColor)    { this.config.backgroundColor = bgColor; this.container.style.background = bgColor; }
        if (textColor)  { this.config.textColor = textColor; this.textElement.style.color = textColor; this.buttonElement.style.color = textColor; }
        if (borderColor){ this.config.borderColor = borderColor; this.container.style.borderColor = borderColor; }
        return this;
    }
    enableBlur(enable) {
        this.config.useBlur = enable;
        if (enable) { this.container.style.backdropFilter = 'blur(5px)'; this.container.style.webkitBackdropFilter = 'blur(5px)'; }
        else        { this.container.style.backdropFilter = 'none';       this.container.style.webkitBackdropFilter = 'none'; }
        return this;
    }

    showText(text, buttonText = null, buttonCallback = null, duration = null) {
        this.clearTimers();

        this.currentText = text;
        this.typewriterIndex = 0;
        this.isVisible = true;
        this.animationState = "fading_in";

        if (buttonText && buttonCallback) {
            this.buttonElement.textContent = buttonText;
            this.buttonElement.style.display = 'block';
            this.buttonElement.onclick = () => { buttonCallback(); this.hide(); };
        } else {
            this.buttonElement.style.opacity = '0';
            this.buttonElement.style.display = 'none';
            this.buttonElement.style.pointerEvents = 'none';
        }

        this.container.offsetHeight;   // reflow
        requestAnimationFrame(() => {
            this.container.style.opacity = '1';
            this.container.style.transform = 'translateY(0px)';
        });

        if (this.config.useTypewriter) {
            this.startTypewriter();
        } else {
            this.textElement.innerHTML = text;
            this.showButton();
        }

        if (!buttonText && !this.autoMode) {
            const displayTime = duration || this.config.displayDuration;
            if (displayTime > 0) {
                this.displayTimer = setTimeout(() => this.hide(), displayTime);
            }
        }
        return this;
    }

    startTypewriter() {
        this.textElement.innerHTML = "";
        this.typewriterIndex = 0;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.currentText;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const typeNextChar = () => {
            if (this.typewriterIndex < plainText.length) {
                this.textElement.textContent = plainText.substring(0, this.typewriterIndex + 1);
                this.typewriterIndex++;
                this.typewriterTimer = setTimeout(typeNextChar, this.config.typewriterSpeed);
            } else {
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
            }, 500);
        }
    }

    // ★ CORRIGÉ : stoppe proprement l'ancien mode avant d'en démarrer un nouveau
    addTexts(texts) {
        this.stopAutoMode();
        this.textQueue = Array.isArray(texts) ? texts : [texts];
        this.currentQueueIndex = 0;
        return this;
    }

    // ★ CORRIGÉ : un runId unique par run, qui invalide toutes les anciennes chaînes
    startAutoMode() {
        if (this.textQueue.length > 0) {
            this.stopAutoMode();                        // invalide tout run précédent
            this.autoMode = true;
            this.currentQueueIndex = 0;
            this.autoRunId++;
            const runId = this.autoRunId;
            setTimeout(() => {
                if (this.autoMode && this.autoRunId === runId) {
                    this.showNextInQueue(runId);
                }
            }, 100);
        }
        return this;
    }

    // ★ CORRIGÉ : accepte et vérifie le runId à chaque callback
    showNextInQueue(runId) {
        if (!this.autoMode || this.autoRunId !== runId || this.textQueue.length === 0) return;

        const text = this.textQueue[this.currentQueueIndex];
        this.showText(text, null, null, null);

        this.displayTimer = setTimeout(() => {
            if (this.autoRunId !== runId) return;
            this.hide(() => {
                if (this.autoRunId !== runId) return;
                this.currentQueueIndex++;
                if (this.currentQueueIndex < this.textQueue.length) {
                    setTimeout(() => {
                        if (this.autoMode && this.autoRunId === runId) {
                            this.showNextInQueue(runId);
                        }
                    }, this.config.pauseBetweenTexts);
                } else {
                    this.autoMode = false;
                }
            });
        }, this.config.displayDuration);
    }

    hide(callback = null) {
        this.clearTimers();
        this.animationState = "fading_out";

        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(-10px)';
        this.buttonElement.style.opacity = '0';
        this.buttonElement.style.pointerEvents = 'none';

        this.hideTimer = setTimeout(() => {
            this.hideTimer = null;
            this.isVisible = false;
            this.animationState = "hidden";
            if (callback) callback();
        }, 500);
    }

    // ★ CORRIGÉ : incrémente autoRunId + clearTimers
    stopAutoMode() {
        this.autoMode = false;
        this.autoRunId++;
        this.clearTimers();
    }

    clearTimers() {
        if (this.fadeTimer)       { clearTimeout(this.fadeTimer);       this.fadeTimer = null; }
        if (this.typewriterTimer) { clearTimeout(this.typewriterTimer); this.typewriterTimer = null; }
        if (this.displayTimer)    { clearTimeout(this.displayTimer);    this.displayTimer = null; }
        if (this.hideTimer)       { clearTimeout(this.hideTimer);       this.hideTimer = null; }
    }

    destroy() {
        this.clearTimers();
        this.stopAutoMode();
        if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    }
}