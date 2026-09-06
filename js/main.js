/**
 * EarnifyX Lab - Main Application Controller
 * Handles global interactions, mobile navigation, toast alerts, and shared modals.
 */

// Toast notification helper
window.showToast = function (message, duration = 3000) {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast-item";
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.25s ease";
        setTimeout(() => toast.remove(), 250);
    }, duration);
};

// Global Modal Controller
window.closeModal = function () {
    const modalOverlay = document.getElementById("globalModalOverlay");
    if (modalOverlay) {
        modalOverlay.classList.remove("active");
    }
};

// Open Extension Details Modal
window.openExtensionModal = function (extId) {
    const ext = (window.EXTENSIONS_DATA || []).find(e => e.id === extId);
    if (!ext) return;
    if (window.AuthUI) AuthUI.recordViewed("Extensions", ext.name);

    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalContent = document.getElementById("globalModalContent");
    if (!modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem;">
            <div class="card-icon-box" style="background-color: ${ext.iconBg}; color: ${ext.iconColor}; width: 56px; height: 56px; font-size: 1.75rem; border-radius: var(--radius-lg);">
                ${ext.iconText}
            </div>
            <div>
                <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
                    <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">${ext.name}</h2>
                    <span class="badge badge-${ext.badgeType || 'success'}">${ext.badge}</span>
                </div>
                <div class="text-muted" style="font-size: 0.82rem;">
                    ${ext.version} • ⭐ ${ext.rating} (${ext.users} active creators)
                </div>
            </div>
        </div>

        <p class="text-secondary" style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.25rem;">
            ${ext.description}
        </p>

        <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Key Capabilities:</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.85rem; color: var(--text-secondary);">
                ${ext.features.map(f => `<li>✓ ${f}</li>`).join("")}
            </ul>
        </div>

        <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
            <a href="${ext.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="flex: 1; margin-right: 0.75rem;">
                Add to Chrome ↗
            </a>
            <button class="btn btn-secondary btn-lg" onclick="toggleSaveItem('extension', '${ext.id}', '${ext.name.replace(/'/g, "\\'")}', event)">
                ❤️ Save
            </button>
        </div>
    `;

    modalOverlay.classList.add("active");
};

// Open Software Details Modal
window.openSoftwareModal = function (softId) {
    const soft = (window.SOFTWARE_DATA || []).find(s => s.id === softId);
    if (!soft) return;
    if (window.AuthUI) AuthUI.recordViewed("Software", soft.name);

    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalContent = document.getElementById("globalModalContent");
    if (!modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem;">
            <div class="card-icon-box" style="background-color: ${soft.iconBg}; color: ${soft.iconColor}; width: 56px; height: 56px; font-size: 1.75rem; border-radius: var(--radius-lg);">
                ${soft.iconText}
            </div>
            <div>
                <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
                    <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">${soft.name}</h2>
                    <span class="badge badge-${soft.badgeType || 'primary'}">${soft.badge}</span>
                </div>
                <div class="text-muted" style="font-size: 0.82rem;">
                    ${soft.version} • Platform: ${soft.platform} • ⬇️ ${soft.downloads}
                </div>
            </div>
        </div>

        <p class="text-secondary" style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.25rem;">
            ${soft.description}
        </p>

        <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Features & Modules:</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.85rem; color: var(--text-secondary);">
                ${soft.features.map(f => `<li>✓ ${f}</li>`).join("")}
            </ul>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px dashed var(--border-color); padding-top: 0.65rem;">
                <strong>Requirements:</strong> ${soft.systemRequirements}
            </div>
        </div>

        <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
            <button class="btn btn-primary btn-lg" style="flex: 1; margin-right: 0.75rem;" onclick="triggerDownload('${soft.name.replace(/'/g, "\\'")}')">
                Download Official Installer ↓
            </button>
            <button class="btn btn-secondary btn-lg" onclick="toggleSaveItem('software', '${soft.id}', '${soft.name.replace(/'/g, "\\'")}', event)">
                ❤️ Save
            </button>
        </div>
    `;

    modalOverlay.classList.add("active");
};

// Open Blog Details Modal
window.openBlogModal = function (postId) {
    const post = (window.BLOG_DATA || []).find(p => p.id === postId);
    if (!post) return;

    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalContent = document.getElementById("globalModalContent");
    if (!modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
            <span class="badge badge-primary" style="margin-bottom: 0.5rem;">${post.category}</span>
            <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${post.title}</h2>
            <div class="text-muted" style="font-size: 0.82rem; margin-top: 0.4rem;">
                By ${post.author} • ${post.date} • ${post.readTime}
            </div>
        </div>

        <img src="${post.thumbnail}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.25rem;" />

        <div class="text-secondary" style="font-size: 0.95rem; line-height: 1.7; display: flex; flex-direction: column; gap: 1rem;">
            <p><strong>Overview:</strong> ${post.shortDescription}</p>
            <p>${post.content}</p>
            <div style="background-color: var(--bg-surface-subtle); border-left: 3px solid var(--accent-primary); padding: 1rem; border-radius: var(--radius-sm); font-style: italic;">
                "The secret to building high-leverage digital assets in 2026 is tight iteration loops between AI prompt engineering and custom lightweight software."
            </div>
        </div>

        <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; text-align: right;">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;

    modalOverlay.classList.add("active");
};

// Open Tutorial Details Modal
window.openTutorialModal = function (tutId) {
    const tut = (window.TUTORIALS_DATA || []).find(t => t.id === tutId);
    if (!tut) return;

    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalContent = document.getElementById("globalModalContent");
    if (!modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
            <span class="badge badge-purple" style="margin-bottom: 0.5rem;">${tut.difficulty} • ${tut.time}</span>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${tut.title}</h2>
            <p class="text-secondary" style="font-size: 0.9rem; margin-top: 0.4rem;">${tut.description}</p>
        </div>

        <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Tutorial Steps:</h4>
            <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem; color: var(--text-secondary);">
                ${tut.steps.map(step => `<li><strong>${step}</strong></li>`).join("")}
            </ol>
        </div>

        <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <button class="btn btn-primary" onclick="showToast('🚀 Interactive sandbox & code repo loading...'); closeModal();">
                Start Step 1 🚀
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;

    modalOverlay.classList.add("active");
};

// Simulated Download trigger
window.triggerDownload = function (name) {
    if (!window.AuthUI || !AuthUI.requireLogin()) return;
    AuthUI.addDownload("software", name, name);
    if (window.showToast) {
        window.showToast(`📥 Starting official download for ${name}...`);
    }
    setTimeout(() => {
        if (window.closeModal) window.closeModal();
    }, 1200);
};

// Simulated Resource download
window.downloadResource = function (resId, title, type) {
    if (!window.AuthUI || !AuthUI.requireLogin()) return;
    if (type === "Premium") {
        if (window.openUnlockModal) {
            window.openUnlockModal(title);
        }
    } else {
            AuthUI.addDownload("resource", resId, title);
        if (window.showToast) {
            window.showToast(`📥 Downloading free pack: ${title}...`);
        }
    }
};

// DOM Init
document.addEventListener("DOMContentLoaded", () => {
    // Mobile Drawer Handlers
    const menuToggleBtn = document.querySelector(".mobile-menu-toggle");
    const sidebar = document.querySelector(".app-sidebar");
    const backdrop = document.querySelector(".sidebar-backdrop");

    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
            if (backdrop) backdrop.classList.toggle("active");
        });
    }

    if (backdrop) {
        backdrop.addEventListener("click", () => {
            if (sidebar) sidebar.classList.remove("open");
            backdrop.classList.remove("active");
        });
    }

    // Modal Close Button & Backdrop listener
    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalCloseBtn = document.getElementById("globalModalCloseBtn");

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", window.closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                window.closeModal();
            }
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.getElementById("newsletterForm");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector("input[type='email']");
            if (input && input.value) {
                window.showToast(`🎉 Subscribed! Welcome to EarnifyX Lab.`);
                input.value = "";
            }
        });
    }
});
