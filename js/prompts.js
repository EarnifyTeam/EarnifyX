/**
 * EarnifyX Lab - Master Prompts Controller
 * Handles prompt copying, modal previews, unlock triggers, and filtering.
 */

// Copy prompt text to clipboard
// Pro members see every prompt unlocked
window.isPromptLocked = function (prompt) {
    if (!prompt || !prompt.locked) return false;
    const user = window.AuthUI ? window.AuthUI.getUser() : null;
    return !(user && user.isPro === true);
};

window.copyPromptText = async function (promptId, event) {
    if (event) event.stopPropagation();

    const prompt = (window.PROMPTS_DATA || []).find(p => p.id === promptId);
    if (!prompt) return;

    if (window.isPromptLocked(prompt)) {
        openUnlockModal(prompt.title);
        return;
    }

    try {
        await navigator.clipboard.writeText(prompt.promptText);
        if (window.showToast) {
            window.showToast(`📋 Copied "${prompt.title}" to clipboard!`);
        }
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = prompt.promptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        if (window.showToast) {
            window.showToast(`📋 Copied "${prompt.title}" to clipboard!`);
        }
    }
};

// Open prompt details modal
window.openPromptModal = function (promptId) {
    const raw = (window.PROMPTS_DATA || []).find(p => p.id === promptId);
    if (!raw) return;
    if (window.AuthUI) AuthUI.recordViewed("Prompts", raw.title);
    const locked = window.isPromptLocked(raw);
    const prompt = window.Components ? window.Components.safe(raw) : raw;

    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalContent = document.getElementById("globalModalContent");
    if (!modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 0.5rem;">
                <span class="badge badge-${prompt.badgeType || 'success'}">${prompt.badge}</span>
                <span class="text-muted" style="font-size: 0.8rem;">Category: ${prompt.category}</span>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">${prompt.title}</h2>
            ${(prompt.shortDescription || "").trim().length > 3 ? `<p class="text-secondary" style="font-size: 0.9rem; margin-top: 0.35rem;">${prompt.shortDescription}</p>` : ""}
        </div>

        <div>
            <div class="flex items-center justify-between">
                <span style="font-size: 0.82rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">Prompt Template</span>
                ${!locked ? `<span style="font-size: 0.78rem; color: var(--text-muted);">Recommended for: ${prompt.model}</span>` : ''}
            </div>

            <div class="prompt-full-box">
                ${locked ? (prompt.previewText || 'This prompt is locked. Upgrade to EarnifyX Pro to unlock full access.') : prompt.promptText}
            </div>
        </div>

        <div class="flex items-center justify-between" style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
            ${locked ? `
                <button class="btn btn-primary" style="width: 100%;" onclick="openUnlockModal('${prompt.title}')">
                    🔒 Unlock Full Prompt with Pro
                </button>
            ` : `
                <button class="btn btn-primary" onclick="copyPromptText('${prompt.id}'); closeModal();">
                    📋 Copy Full Prompt
                </button>
                <button class="btn btn-secondary" onclick="toggleSaveItem('prompt', '${prompt.id}', '${prompt.title}', event)">
                    ❤️ Save to Library
                </button>
            `}
        </div>
    `;

    modalOverlay.classList.add("active");
};

// Open premium unlock modal
window.openUnlockModal = function (title) {
    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalContent = document.getElementById("globalModalContent");
    if (!modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
        <div style="text-align: center; padding: 1rem 0;">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">👑</div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
                Unlock EarnifyX Premium
            </h2>
            <p class="text-secondary" style="font-size: 0.9rem; max-width: 440px; margin: 0 auto 1.5rem auto;">
                Get instant unlimited access to <strong>${window.escapeHtml ? window.escapeHtml(title) : title}</strong>, plus our full library of 500+ Master Prompts, exclusive software downloads, and automation templates.
            </p>

            <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; text-align: left;">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Included with Pro:</div>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem; color: var(--text-secondary);">
                    <li>✓ 500+ Tested Prompts with regular weekly updates</li>
                    <li>✓ Unrestricted direct downloads for all software</li>
                    <li>✓ Pre-configured Make.com & n8n automation blueprints</li>
                    <li>✓ Private creator Discord community access</li>
                </ul>
            </div>

            <!-- FUTURE PAYMENT INTEGRATION (Stripe / Razorpay Checkout) -->
            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="demoUpgradeClick()">
                Upgrade to Pro — $9 / month
            </button>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.75rem;">
                Cancel anytime. 100% money-back guarantee.
            </div>
        </div>
    `;

    modalOverlay.classList.add("active");
};

window.demoUpgradeClick = function () {
    if (window.showToast) {
        window.showToast("🚀 Checkout mockup: Future Stripe / Razorpay checkout integration");
    }
    setTimeout(() => {
        if (window.closeModal) window.closeModal();
    }, 1500);
};
