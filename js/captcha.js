/**
 * EarnifyX Lab - Visual Alphanumeric Captcha System
 * Generates secure canvas-based distorted text & number codes (e.g. K8X9W2)
 * with noise lines, rotation, refresh button, and validation.
 */

(function () {
    class CaptchaManager {
        constructor() {
            this.instances = new Map();
        }

        /**
         * Generate a random alphanumeric string (excluding confusing characters like 0, O, I, l)
         */
        generateCode(length = 6) {
            const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
            let code = '';
            for (let i = 0; i < length; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        }

        /**
         * Render the visual captcha on an HTML5 Canvas
         */
        drawCaptcha(canvas, code) {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const width = canvas.width = 180;
            const height = canvas.height = 46;

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            // Background gradient
            const bgGrad = ctx.createLinearGradient(0, 0, width, height);
            if (isDark) {
                bgGrad.addColorStop(0, '#1e293b');
                bgGrad.addColorStop(1, '#0f172a');
            } else {
                bgGrad.addColorStop(0, '#f1f5f9');
                bgGrad.addColorStop(1, '#e2e8f0');
            }
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Add background noise dots
            for (let i = 0; i < 40; i++) {
                ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${Math.random() * 0.15})` : `rgba(0, 0, 0, ${Math.random() * 0.12})`;
                ctx.beginPath();
                ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Add security disturbance lines
            for (let i = 0; i < 4; i++) {
                ctx.strokeStyle = isDark
                    ? `rgba(96, 165, 250, ${0.2 + Math.random() * 0.25})`
                    : `rgba(37, 99, 235, ${0.15 + Math.random() * 0.2})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(Math.random() * width, Math.random() * height);
                ctx.bezierCurveTo(
                    Math.random() * width, Math.random() * height,
                    Math.random() * width, Math.random() * height,
                    Math.random() * width, Math.random() * height
                );
                ctx.stroke();
            }

            // Draw individual characters with rotation, offset and colors
            const charWidth = width / (code.length + 1);
            const fonts = ['600 24px "Inter", sans-serif', '700 23px "Courier New", monospace', '800 22px "Arial", sans-serif'];
            const colorsLight = ['#1e40af', '#6b21a8', '#0369a1', '#047857', '#b91c1c', '#c2410c'];
            const colorsDark = ['#60a5fa', '#c084fc', '#38bdf8', '#34d399', '#f87171', '#fb923c'];

            for (let i = 0; i < code.length; i++) {
                const char = code[i];
                ctx.save();
                
                const x = charWidth * (i + 0.8) + (Math.random() * 4 - 2);
                const y = height / 2 + (Math.random() * 6 - 3) + 7;
                const angle = (Math.random() * 36 - 18) * Math.PI / 180;

                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.font = fonts[Math.floor(Math.random() * fonts.length)];
                ctx.fillStyle = isDark
                    ? colorsDark[Math.floor(Math.random() * colorsDark.length)]
                    : colorsLight[Math.floor(Math.random() * colorsLight.length)];
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = 3;
                ctx.fillText(char, 0, 0);
                ctx.restore();
            }
        }

        /**
         * Initialize captcha in a container
         * @param {string} containerId - The ID of the container element
         */
        init(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const code = this.generateCode(6);
            this.instances.set(containerId, { code });

            container.innerHTML = `
                <div class="captcha-component">
                    <label class="captcha-label" for="${containerId}_input">
                        <span>Security Verification</span>
                        <span class="captcha-hint">(Type the code shown)</span>
                    </label>
                    <div class="captcha-box-row">
                        <div class="captcha-canvas-wrap" title="Security verification code">
                            <canvas id="${containerId}_canvas" class="captcha-canvas" width="180" height="46" aria-label="Captcha visual code"></canvas>
                        </div>
                        <button type="button" class="captcha-refresh-btn" id="${containerId}_refresh" title="Get new captcha code" aria-label="Refresh Captcha">
                            <svg class="captcha-refresh-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                            </svg>
                        </button>
                    </div>
                    <div class="captcha-input-wrap">
                        <input type="text" id="${containerId}_input" class="captcha-input" 
                               placeholder="Enter 6-character code" 
                               autocomplete="off" 
                               spellcheck="false" 
                               maxlength="6"
                               required />
                    </div>
                </div>
            `;

            const canvas = document.getElementById(`${containerId}_canvas`);
            this.drawCaptcha(canvas, code);

            const refreshBtn = document.getElementById(`${containerId}_refresh`);
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                refreshBtn.classList.add('spinning');
                this.refresh(containerId);
                setTimeout(() => refreshBtn.classList.remove('spinning'), 500);
            });

            // Redraw on theme toggle if theme changes
            const observer = new MutationObserver(() => {
                const current = this.instances.get(containerId);
                if (current) {
                    this.drawCaptcha(canvas, current.code);
                }
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        }

        /**
         * Refresh a specific captcha instance
         */
        refresh(containerId) {
            const newCode = this.generateCode(6);
            this.instances.set(containerId, { code: newCode });
            const canvas = document.getElementById(`${containerId}_canvas`);
            const input = document.getElementById(`${containerId}_input`);
            if (canvas) this.drawCaptcha(canvas, newCode);
            if (input) {
                input.value = '';
                input.classList.remove('captcha-error', 'captcha-success');
            }
        }

        /**
         * Validate user input against current instance code
         * @param {string} containerId - The ID of the container element
         * @returns {boolean} - true if correct, false otherwise
         */
        validate(containerId) {
            const instance = this.instances.get(containerId);
            const input = document.getElementById(`${containerId}_input`);
            if (!instance || !input) return false;

            const userVal = input.value.trim();
            if (!userVal) {
                input.classList.add('captcha-error');
                if (typeof window.showToast === 'function') {
                    window.showToast('⚠️ Please enter the security Captcha code.');
                }
                input.focus();
                return false;
            }

            // Case-insensitive match for friendly user experience
            if (userVal.toLowerCase() === instance.code.toLowerCase()) {
                input.classList.remove('captcha-error');
                input.classList.add('captcha-success');
                return true;
            } else {
                input.classList.add('captcha-error');
                input.classList.remove('captcha-success');
                if (typeof window.showToast === 'function') {
                    window.showToast('❌ Incorrect Captcha code! A new code has been generated.');
                }
                this.refresh(containerId);
                input.focus();
                return false;
            }
        }
    }

    window.EarnifyCaptcha = new CaptchaManager();
})();
