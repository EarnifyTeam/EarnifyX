/**
 * EarnifyX Lab - Main Application Controller
 * Handles global interactions, mobile navigation, toast alerts, and shared modals.
 */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyB4tHbG7Qhz7TEs9RKjqSjgzVlJCPwW7aA",
    authDomain: "earnifyxlab.firebaseapp.com",
    projectId: "earnifyxlab",
    storageBucket: "earnifyxlab.firebasestorage.app",
    messagingSenderId: "944846937649",
    appId: "1:944846937649:web:343ebdc58b9af8a6207f10",
    measurementId: "G-SGW7CDT1LV"
};

window.initializeFirebase = async function () {
    if (window.__earnifyxFirebaseInitialized) {
        return window.firebaseApp;
    }

    try {
        const [
            { initializeApp },
            { getAnalytics },
            { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged },
            { getFirestore, doc, setDoc, getDoc, collection, getDocs }
        ] = await Promise.all([
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js"),
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js"),
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js"),
            import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js")
        ]);

        const app = initializeApp(FIREBASE_CONFIG);
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        const db = getFirestore(app);

        window.firebaseApp = app;
        window.firebaseAnalytics = analytics;
        window.firebaseAuth = auth;
        window.firebaseDb = db;
        window.firebaseAuthHelpers = {
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            signOut,
            updateProfile,
            onAuthStateChanged,
            doc,
            setDoc,
            getDoc,
            collection,
            getDocs
        };
        window.__earnifyxFirebaseInitialized = true;

        return app;
    } catch (error) {
        console.warn("Firebase initialization failed:", error);
        return null;
    }
};
    window.applyStandardHeader = function () {
        const pagePath = window.location.pathname.toLowerCase();
        if (pagePath.includes("/login") || pagePath.includes("/register")) return;

        const header = document.querySelector(".site-header");
        if (!header) return;

        header.innerHTML = `
            <div class="header-left">
                <button class="mobile-menu-toggle" aria-label="Toggle navigation menu">&#9776;</button>
                <a href="./" class="brand-logo">
                    <div class="flask-icon">
                        <img src="assets/icons/logo.svg" alt="EarnifyX Lab Flask Logo" width="28" height="28">
                    </div>
                    <div class="brand-text">
                        <span class="brand-title">Earnify<span>X</span>Lab</span>
                        <span class="brand-tagline">Tools &bull; Prompts &bull; Resources</span>
                    </div>
                </a>
            </div>
            <nav class="header-nav" aria-label="Main Navigation">
                <a href="extensions/" class="header-nav-link">&#129513; Extensions</a>
                <a href="software/" class="header-nav-link">&#128187; Software</a>
                <a href="prompts/" class="header-nav-link">&#129504; Prompt Bhandar</a>
                <a href="resources/" class="header-nav-link">&#128230; Resources</a>
                <div class="header-dropdown">
                    <button class="header-dropdown-btn" type="button" aria-haspopup="true" aria-expanded="false">
                        <span>More</span> <span class="dropdown-chevron">&#9662;</span>
                    </button>
                    <div class="header-dropdown-menu">
                        <a href="ai-tools/" class="dropdown-item"><span class="item-icon">&#129302;</span><div class="item-text"><span class="item-title">AI Tools</span><span class="item-sub">Directory &amp; platforms</span></div></a>
                        <a href="automation/" class="dropdown-item"><span class="item-icon">&#9889;</span><div class="item-text"><span class="item-title">Automation Tools</span><span class="item-sub">Workflows &amp; bots</span></div></a>
                        <a href="creator-tools/" class="dropdown-item"><span class="item-icon">&#127916;</span><div class="item-text"><span class="item-title">Creator Tools</span><span class="item-sub">Audio, video &amp; design</span></div></a>
                        <a href="blog/" class="dropdown-item"><span class="item-icon">&#128221;</span><div class="item-text"><span class="item-title">Blog Posts</span><span class="item-sub">Guides &amp; articles</span></div></a>
                        <a href="tutorials/" class="dropdown-item"><span class="item-icon">&#128218;</span><div class="item-text"><span class="item-title">Tutorials &amp; Guides</span><span class="item-sub">Step-by-step masterclasses</span></div></a>
                        <a href="downloads/" class="dropdown-item"><span class="item-icon">&#128229;</span><div class="item-text"><span class="item-title">Downloads</span><span class="item-sub">Software installers</span></div></a>
                        <a href="about/" class="dropdown-item"><span class="item-icon">&#128100;</span><div class="item-text"><span class="item-title">About Us</span><span class="item-sub">Meet the creator</span></div></a>
                    </div>
                </div>
            </nav>
            <div class="header-right">
                <div class="header-search">
                    <div class="search-input-wrapper">
                        <span class="search-icon">&#128269;</span>
                        <input type="text" class="global-search-input" placeholder="Search..." aria-label="Search">
                        <span class="search-shortcut-badge">Ctrl K</span>
                    </div>
                </div>
                <a href="dashboard/" class="header-saved-btn" title="Saved Items" aria-label="Saved Items">
                    <span>&#10084;</span><span class="saved-count-badge" style="display:none;">0</span>
                </a>
                <button class="theme-toggle-btn" title="Toggle Light / Dark Mode" aria-label="Toggle theme"><span class="theme-toggle-icon">&#127769;</span></button>
                <div class="header-auth-actions">
                    <a href="login/" class="btn btn-subtle" style="font-size: 0.88rem; font-weight: 600;">Login</a>
                    <a href="register/" class="btn btn-primary" style="font-size: 0.88rem;">Get Started</a>
                </div>
            </div>
        `;
    };

window.FirebaseService = {
    async ensureReady() {
        window.applyStandardHeader();
        if (window.renderAuthUI) window.renderAuthUI(window.AuthUI && window.AuthUI.getUser());
        if (!window.firebaseAuth || !window.firebaseDb) {
            await window.initializeFirebase();
        }
        return {
            auth: window.firebaseAuth,
            db: window.firebaseDb,
            helpers: window.firebaseAuthHelpers
        };
    },

    async registerUser({ name, email, phone, password }) {
        const { auth, db, helpers } = await this.ensureReady();
        const credential = await helpers.createUserWithEmailAndPassword(auth, email, password);
        await helpers.updateProfile(credential.user, { displayName: name });
        const userDoc = {
            uid: credential.user.uid,
            name,
            email,
            phone,
            role: "user",
            plan: "free",
            isPro: false,
            subscriptionStatus: "inactive",
            premiumUntil: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await helpers.setDoc(helpers.doc(db, "users", credential.user.uid), userDoc);
        return { ...credential.user, profile: userDoc };
    },

    async loginUser({ email, password }) {
        const { auth, db, helpers } = await this.ensureReady();
        const credential = await helpers.signInWithEmailAndPassword(auth, email, password);
        const profileSnapshot = await helpers.getDoc(helpers.doc(db, "users", credential.user.uid));
        const profile = profileSnapshot.exists() ? profileSnapshot.data() : {};
        const tokenResult = await credential.user.getIdTokenResult();
        return { ...credential.user, profile, isAdmin: tokenResult.claims.admin === true };
    },
    
    async getUserProfile(user) {
        const { db, helpers } = await this.ensureReady();
        const snapshot = await helpers.getDoc(helpers.doc(db, "users", user.uid));
        return snapshot.exists() ? snapshot.data() : {};
    },

    async loadSiteSettings(type) {
        const { db, helpers } = await this.ensureReady();
        const snapshot = await helpers.getDoc(helpers.doc(db, "site_settings", type));
        return snapshot.exists() ? snapshot.data() : {};
    },

    async saveSiteSettings(type, settings) {
        const { db, helpers } = await this.ensureReady();
        await helpers.setDoc(helpers.doc(db, "site_settings", type), {
            ...settings,
            updatedAt: new Date().toISOString()
        });
        return true;
    },

    async requireAdminClaim() {
        const { auth } = await this.ensureReady();
        if (!auth.currentUser) {
            throw new Error("Please login with the admin account first.");
        }
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        if (tokenResult.claims.admin !== true) {
            throw new Error("Admin claim is missing. Set admin: true, then logout and login again.");
        }
        return tokenResult;
    },

    async loadAdSettings() {
        return this.loadSiteSettings("ad_settings");
    },

    async loadAboutSettings() {
        return this.loadSiteSettings("about");
    },

    async logoutUser() {
        const { auth, helpers } = await this.ensureReady();
        await helpers.signOut(auth);
    },

    async syncDataToFirestore(type, dataArray) {
        const { db, helpers } = await this.ensureReady();
        const ref = helpers.doc(db, "site_data", type);
        await helpers.setDoc(ref, {
            type,
            data: dataArray,
            updatedAt: new Date().toISOString()
        });
        return true;
    },

    async loadDataFromFirestore(type) {
        const { db, helpers } = await this.ensureReady();
        const ref = helpers.doc(db, "site_data", type);
        const snapshot = await helpers.getDoc(ref);
        return snapshot.exists() ? snapshot.data().data || [] : [];
    }
};

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

window.applyAdSettings = function (settings) {
    const path = window.location.pathname.toLowerCase();
    if (!settings.enabled || path.includes("/login") || path.includes("/register") || path.includes("/admin-dashboard")) return;

    const mountCode = (container, code) => {
        if (!container || !code) return;
        container.replaceChildren();
        const template = document.createElement("template");
        template.innerHTML = code;
        [...template.content.childNodes].forEach(node => {
            if (node.nodeName.toLowerCase() !== "script") {
                container.appendChild(node.cloneNode(true));
                return;
            }
            const script = document.createElement("script");
            [...node.attributes].forEach(attribute => script.setAttribute(attribute.name, attribute.value));
            script.textContent = node.textContent;
            container.appendChild(script);
        });
    };

    const createSlot = (name, position) => {
        let slot = document.querySelector(`[data-ad-slot="${name}"]`);
        if (!slot) {
            slot = document.createElement("div");
            slot.dataset.adSlot = name;
            slot.style.cssText = "width:100%;max-width:1200px;margin:1rem auto;text-align:center;min-height:0;overflow:hidden;";
            if (position === "top") document.querySelector(".site-header")?.after(slot);
            if (position === "content") document.querySelector(".main-content")?.prepend(slot);
            if (position === "footer") document.querySelector(".site-footer")?.before(slot);
        }
        return slot;
    };

    mountCode(createSlot("top", "top"), settings.topCode);
    mountCode(createSlot("content", "content"), settings.contentCode);
    mountCode(createSlot("footer", "footer"), settings.footerCode);
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

// Saved Items Badge Counter Helper
window.updateSavedCountBadge = function () {
    const badges = document.querySelectorAll(".saved-count-badge");
    if (!badges.length) return;
    const count = window.AuthUI ? window.AuthUI.getBookmarks().length : 0;
    badges.forEach(b => {
        if (count > 0) {
            b.textContent = count > 99 ? "99+" : count;
            b.style.display = "inline-flex";
        } else {
            b.style.display = "none";
        }
    });
};

// DOM Init
document.addEventListener("DOMContentLoaded", async () => {
    await window.initializeFirebase();
    window.applyStandardHeader();
    if (window.renderAuthUI) window.renderAuthUI(window.AuthUI && window.AuthUI.getUser());

    try {
        const socialLinks = await window.FirebaseService.loadSiteSettings("social_links");
        document.querySelectorAll("[data-social-link]").forEach(link => {
            const key = link.getAttribute("data-social-link");
            if (socialLinks[key]) link.setAttribute("href", socialLinks[key]);
        });
    } catch (error) {
        console.warn("Social links could not be loaded:", error);
    }

    try {
        const adSettings = await window.FirebaseService.loadAdSettings();
        window.applyAdSettings(adSettings);
    } catch (error) {
        console.warn("Ad settings could not be loaded:", error);
    }

    if (window.location.pathname.toLowerCase().includes("/about")) {
        try {
            const about = await window.FirebaseService.loadAboutSettings();
            const setText = (selector, value) => {
                const element = document.querySelector(selector);
                if (element && value) element.textContent = value;
            };
            setText("[data-about-name]", about.name);
            setText("[data-about-role]", about.role);
            setText("[data-about-short]", about.shortBio);
            setText("[data-about-details]", about.details);
            setText("[data-about-location]", about.location);
            const image = document.querySelector("[data-about-image]");
            if (image && about.imageUrl) {
                image.src = about.imageUrl;
                image.alt = about.name ? `${about.name} profile picture` : "Creator profile picture";
            }
            document.querySelectorAll("[data-about-link]").forEach(link => {
                const key = link.getAttribute("data-about-link");
                if (about[key]) link.href = about[key];
            });
        } catch (error) {
            console.warn("About settings could not be loaded:", error);
        }
    }

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

    // Dropdown Click Handlers (Touch & Mobile friendly)
    const dropdownContainers = document.querySelectorAll(".header-dropdown");
    dropdownContainers.forEach(container => {
        const btn = container.querySelector(".header-dropdown-btn");
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                container.classList.toggle("active");
            });
        }
    });

    document.addEventListener("click", (e) => {
        dropdownContainers.forEach(container => {
            if (!container.contains(e.target)) {
                container.classList.remove("active");
            }
        });
    });

    // Update Saved Counter on load
    window.updateSavedCountBadge();

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

    // Global Spotlight Search Integration
    window.triggerGlobalSpotlight = function (initialQuery = "") {
        if (window.SpotlightSearch) {
            window.SpotlightSearch.open(initialQuery);
        } else {
            const script = document.createElement("script");
            script.src = "js/search.js";
            script.onload = () => {
                if (window.SpotlightSearch) {
                    window.SpotlightSearch.open(initialQuery);
                }
            };
            document.head.appendChild(script);
        }
    };

    // Header Search Click Handlers across all pages
    const headerSearches = document.querySelectorAll(".header-search, .global-search-input");
    headerSearches.forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            const val = el.querySelector ? (el.querySelector(".global-search-input") ? el.querySelector(".global-search-input").value : "") : (el.value || "");
            window.triggerGlobalSpotlight(val);
        });
    });

    // Keyboard Shortcut (Ctrl+K or Cmd+K)
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            window.triggerGlobalSpotlight();
        }
    });

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

