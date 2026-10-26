const PLANE_PRESETS = [
    { key: 'mandel',   label: 'c',          full: 'c-plane — Mandelbrot',     ax1: [0, 0, 1, 0, 0, 0], ax2: [0, 0, 0, 1, 0, 0] },
    { key: 'julia',    label: 'z₀',         full: 'z₀-plane — Julia',         ax1: [1, 0, 0, 0, 0, 0], ax2: [0, 1, 0, 0, 0, 0] },
    { key: 'exp',      label: 'a',          full: 'a-plane — exposant',       ax1: [0, 0, 0, 0, 1, 0], ax2: [0, 0, 0, 0, 0, 1] },
    { key: 'z0_c',     label: 'z₀ + c',     full: 'z₀ + c — diagonale z₀/c',  ax1: [Math.SQRT1_2, 0, Math.SQRT1_2, 0, 0, 0], ax2: [0, Math.SQRT1_2, 0, Math.SQRT1_2, 0, 0] },
    { key: 'c_re_a',   label: 'c + a',      full: 'c + Re(a) — diagonale',    ax1: [0, 0, Math.SQRT1_2, 0, Math.SQRT1_2, 0], ax2: [0, 0, 0, Math.SQRT1_2, 0, Math.SQRT1_2] },
    { key: 'z0_re_a',  label: 'z₀ + a',     full: 'z₀ + Re(a) — diagonale',   ax1: [Math.SQRT1_2, 0, 0, 0, Math.SQRT1_2, 0], ax2: [0, Math.SQRT1_2, 0, 0, 0, Math.SQRT1_2] },
];

class HelpMenu {
    constructor() {
        this.config = { fadeOutDelay: 2000, fadeInDuration: 300, fadeOutDuration: 800 };
        this.isOpen = false;
        this.isButtonVisible = false;
        this.lastMouseMove = 0;
        this.planeButtons = {};
        this.positionTextEl = null;

        this.onNextPosition = null;
        this.onPreviousPosition = null;
        this.onGoToPlane = null;
        this.onResetPan = null;   // ★ nouveau
        this.onUserInteract = null;
        this.getCurrentPositionIndex = null;
        this.getPositionsCount = null;
        this.getCurrentAxes = null;

        this.createElements();
        this.setupEventListeners();
    }

    createElements() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.textContent = '?';
        this.button.style.cssText = `
            position: fixed; top: 24px; left: 24px;
            width: 50px; height: 50px; border-radius: 50%;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.28);
            color: rgba(255,255,255,0.85);
            font-size: 22px; font-weight: bold; cursor: pointer;
            z-index: 9000; opacity: 0; pointer-events: none;
            transition: opacity 300ms ease, background 200ms ease;
            backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            padding: 0; line-height: 1;
        `;
        this.button.addEventListener('mouseenter', () => this.button.style.background = 'rgba(255,255,255,0.20)');
        this.button.addEventListener('mouseleave', () => this.button.style.background = 'rgba(255,255,255,0.08)');
        ['mousedown','mouseup','click','pointerdown','pointerup'].forEach(evt =>
            this.button.addEventListener(evt, e => e.stopPropagation()));
        this.button.addEventListener('click', e => { e.stopPropagation(); this.toggle(); });

        this.panel = document.createElement('div');
        this.panel.style.cssText = `
            position: fixed; top: 88px; left: 24px;
            width: 330px; max-width: calc(100vw - 48px);
            max-height: calc(100vh - 130px); overflow-y: auto;
            background: rgba(25,25,30,0.55);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 18px;
            color: rgba(255,255,255,0.92);
            font-family: Arial, sans-serif; font-size: 14px;
            padding: 18px; z-index: 9001; box-sizing: border-box;
            opacity: 0; pointer-events: none;
            transform: translateY(-6px);
            transition: opacity 250ms ease, transform 250ms ease;
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.45);
            line-height: 1.5;
        `;
        ['mousedown','mouseup','click','pointerdown','pointerup','wheel'].forEach(evt =>
            this.panel.addEventListener(evt, e => e.stopPropagation()));

        document.body.appendChild(this.button);
        document.body.appendChild(this.panel);
        this.buildContent();
    }

    arrClose(a, b, eps = 0.05) {
        if (!a || !b) return false;
        for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > eps) return false;
        return true;
    }

    matchPlane(ax1, ax2) {
        if (!ax1 || !ax2) return null;
        for (const p of PLANE_PRESETS) if (this.arrClose(p.ax1, ax1) && this.arrClose(p.ax2, ax2)) return p.key;
        return null;
    }

    computeActivePlane() {
        if (!this.getCurrentAxes) return null;
        const [a1, a2] = this.getCurrentAxes();
        return this.matchPlane(a1, a2);
    }

    buildContent() {
        const planeButtonsHtml = PLANE_PRESETS.map(p => `
            <button type="button" data-plane="${p.key}" title="${p.full}"
                style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
                       color:white;padding:6px 8px;border-radius:8px;cursor:pointer;
                       font-size:12px;font-family:inherit;
                       transition:background 220ms ease, border-color 220ms ease;">${p.label}</button>
        `).join('');

        this.panel.innerHTML = `

            <div style="margin-bottom:16px;">
                <div style="font-weight:bold;color:#8f94ff;margin-bottom:6px;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Controls</div>
                <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 12px;font-size:13px;">
                    <div>Left click</div><div>Center on cursor</div>
                    <div>Right click</div><div>Rotate to Julia set</div>
                    <div>Scroll</div><div>Zoom in / out</div>
                    <div>← / →</div><div>Move along z₀.real</div>
                    <div>↑ / ↓</div><div>Move along z₀.imag</div>
                    <div>Q / D</div><div>Move along c.real</div>
                    <div>Z / S</div><div>Move along c.imag</div>
                    <div>A / E</div><div>Move along a.real</div>
                    <div>R / F</div><div>Move along a.imag</div>
                    <div>Space</div><div>Next position</div>
                </div>
            </div>

            <div style="margin-bottom:16px;">
                <div style="font-weight:bold;color:#8f94ff;margin-bottom:6px;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Planes</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    ${planeButtonsHtml}
                </div>
                <button type="button" data-action="reset-pan"
                        title="Reset the affine offset to (0,0) in the current plane (axes unchanged)"
                        style="width:100%;margin-top:6px;background:rgba(255,255,255,0.08);
                               border:1px solid rgba(255,255,255,0.2);color:white;padding:7px;
                               border-radius:8px;cursor:pointer;font-size:12px;font-family:inherit;
                               transition:background 200ms ease;">
                    Center
                </button>
            </div>

            <div>
                <div style="font-weight:bold;color:#8f94ff;margin-bottom:6px;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Navigation</div>
                <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <button type="button" data-action="prev"
                            style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
                                   color:white;padding:8px;border-radius:8px;cursor:pointer;font-size:13px;font-family:inherit;">Previous</button>
                    <button type="button" data-action="next"
                            style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
                                   color:white;padding:8px;border-radius:8px;cursor:pointer;font-size:13px;font-family:inherit;">Next</button>
                </div>
                <div data-position-text style="font-size:12px;">Position –</div>
            </div>
        `;

        this.planeButtons = {};
        this.panel.querySelectorAll('[data-plane]').forEach(btn => {
            this.planeButtons[btn.dataset.plane] = btn;
        });
        this.positionTextEl = this.panel.querySelector('[data-position-text]');

        this.panel.querySelector('[data-action="prev"]').onclick = e => {
            e.stopPropagation();
            if (this.onUserInteract) this.onUserInteract();
            if (this.onPreviousPosition) this.onPreviousPosition();
            this.updatePositionText();
            setTimeout(() => this.updatePlaneHighlight(this.computeActivePlane()), 500);
        };
        this.panel.querySelector('[data-action="next"]').onclick = e => {
            e.stopPropagation();
            if (this.onUserInteract) this.onUserInteract();
            if (this.onNextPosition) this.onNextPosition();
            this.updatePositionText();
            setTimeout(() => this.updatePlaneHighlight(this.computeActivePlane()), 500);
        };

        this.panel.querySelectorAll('[data-plane]').forEach(btn => {
            btn.onclick = e => {
                e.stopPropagation();
                const preset = PLANE_PRESETS.find(p => p.key === btn.dataset.plane);
                if (!preset || !this.onGoToPlane) return;
                this.onGoToPlane(preset.ax1, preset.ax2);
                setTimeout(() => this.updatePlaneHighlight(this.computeActivePlane()), 300);
            };
        });

        // ★ Center (0,0)
        const resetBtn = this.panel.querySelector('[data-action="reset-pan"]');
        resetBtn.addEventListener('mouseenter', () => resetBtn.style.background = 'rgba(255,255,255,0.20)');
        resetBtn.addEventListener('mouseleave', () => resetBtn.style.background = 'rgba(255,255,255,0.08)');
        resetBtn.onclick = e => {
            e.stopPropagation();
            if (this.onUserInteract) this.onUserInteract();
            if (this.onResetPan) this.onResetPan();
        };

        this.updatePlaneHighlight(this.computeActivePlane());
        this.updatePositionText();
    }

    updatePlaneHighlight(activeKey) {
        // Pas de highlight actif (comportement voulu)
        for (const [key, btn] of Object.entries(this.planeButtons)) {
            btn.style.background = 'rgba(255,255,255,0.08)';
            btn.style.borderColor = 'rgba(255,255,255,0.2)';
        }
    }

    updatePositionText() {
        if (!this.positionTextEl) return;
        const total = this.getPositionsCount ? this.getPositionsCount() : 0;
        const rawIdx = this.getCurrentPositionIndex ? this.getCurrentPositionIndex() : 0;
        const idx = total > 0 ? ((rawIdx % total) + total) % total : 0;
        this.positionTextEl.textContent = total > 0 ? `Position ${idx + 1} / ${total}` : 'Position –';
    }

    setupEventListeners() {
        document.addEventListener('pointermove', (e) => this.onMouseMove(e));
        document.addEventListener('click', e => {
            if (this.isOpen && !this.panel.contains(e.target) && !this.button.contains(e.target)) this.close();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
        setInterval(() => this.checkIdle(), 200);
    }

    isExperienceStarted() {
        const overlay = document.getElementById('warning-overlay');
        return !!overlay && overlay.classList.contains('hidden');
    }

    onMouseMove(e) {
        if (!this.isExperienceStarted()) return;
        this.lastMouseMove = performance.now();
        if (!this.isButtonVisible) this.showButton();
    }

    checkIdle() {
        if (!this.isExperienceStarted()) {
            if (this.isButtonVisible) this.hideButton();
            return;
        }
        if (this.isOpen) {
            if (!this.isButtonVisible) this.showButton();
            return;
        }
        if (!this.isButtonVisible) return;
        if (performance.now() - this.lastMouseMove > this.config.fadeOutDelay) this.hideButton();
    }

    showButton() { this.isButtonVisible = true; this.button.style.opacity = '1'; this.button.style.pointerEvents = 'auto'; }
    hideButton() { this.isButtonVisible = false; this.button.style.opacity = '0'; this.button.style.pointerEvents = 'none'; }

    open() {
        this.isOpen = true;
        this.buildContent();
        this.panel.style.opacity = '1';
        this.panel.style.pointerEvents = 'auto';
        this.panel.style.transform = 'translateY(0)';
        this.showButton();
    }

    close() {
        this.isOpen = false;
        this.panel.style.opacity = '0';
        this.panel.style.pointerEvents = 'none';
        this.panel.style.transform = 'translateY(-6px)';
        this.lastMouseMove = performance.now();
    }

    toggle() { this.isOpen ? this.close() : this.open(); }

    destroy() { this.button.remove(); this.panel.remove(); }
}