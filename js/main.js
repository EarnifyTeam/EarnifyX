/**
 * EarnifyX Lab - Main Application Controller
 * Handles Firebase bootstrap, auth service, global interactions,
 * mobile navigation, toast alerts, and shared modals.
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

const RECAPTCHA_ENTERPRISE_SITE_KEY = "6Lc2nqwtAAAAAGF1CYLLWSSSkKDPQv_WwFf4JQ6n";

const IS_LOCALHOST = ["localhost", "127.0.0.1"].includes(window.location.hostname);

// HTML-escape helper for anything that comes from user input / storage
window.escapeHtml = function (value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

/**
 * Live catalog sync: the admin panel saves every dataset to Firestore
 * (site_data/{type}). Public pages start with the bundled data/*.js (or the
 * last cached copy) and then swap in the Firestore version, so what the
 * admin publishes is what visitors see. Uses the public REST endpoint so it
 * does not have to wait for the Firebase SDK to load.
 */
window.EarnifyData = {
    TYPES: {
        extensions: "EXTENSIONS_DATA",
        software: "SOFTWARE_DATA",
        prompts: "PROMPTS_DATA",
        tools: "TOOLS_DATA",
        resources: "RESOURCES_DATA",
        blog: "BLOG_DATA",
        tutorials: "TUTORIALS_DATA"
    },
    ready: false,
    changed: false,
    _promise: null,

    storageKey(type) {
        return `earnifyx_data_${type}`;
    },

    // Convert a Firestore REST "Value" into a plain JS value
    fromFirestoreValue(value) {
        if (!value || typeof value !== "object") return null;
        if ("stringValue" in value) return value.stringValue;
        if ("integerValue" in value) return Number(value.integerValue);
        if ("doubleValue" in value) return value.doubleValue;
        if ("booleanValue" in value) return value.booleanValue;
        if ("nullValue" in value) return null;
        if ("timestampValue" in value) return value.timestampValue;
        if ("arrayValue" in value) return (value.arrayValue.values || []).map(v => this.fromFirestoreValue(v));
        if ("mapValue" in value) {
            const out = {};
            Object.entries(value.mapValue.fields || {}).forEach(([k, v]) => { out[k] = this.fromFirestoreValue(v); });
            return out;
        }
        return null;
    },

    async fetchType(type) {
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/site_data/${type}?key=${FIREBASE_CONFIG.apiKey}`;
        const response = await fetch(url, { cache: "no-store" });
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`Firestore ${type}: HTTP ${response.status}`);
        const json = await response.json();
        const data = this.fromFirestoreValue(json.fields?.data);
        return Array.isArray(data) ? data : null;
    },

    apply(type, data) {
        const prop = this.TYPES[type];
        if (!prop) return false;
        const serialized = JSON.stringify(data);
        const current = JSON.stringify(window[prop] || []);
        try { localStorage.setItem(this.storageKey(type), serialized); } catch (e) { /* storage full or disabled */ }
        window[prop] = data;
        return serialized !== current;
    },

    load() {
        if (this._promise) return this._promise;
        this._promise = (async () => {
            const results = await Promise.allSettled(
                Object.keys(this.TYPES).map(async type => {
                    const data = await this.fetchType(type);
                    if (data) this.changed = this.apply(type, data) || this.changed;
                })
            );
            results.forEach(r => { if (r.status === "rejected") console.warn("Catalog sync:", r.reason?.message || r.reason); });
            this.ready = true;
            if (this.changed) {
                document.dispatchEvent(new CustomEvent("earnifyx:data-updated"));
                if (window.renderAuthUI && window.AuthUI) window.renderAuthUI(window.AuthUI.getUser());
            }
            return this.changed;
        })();
        return this._promise;
    }
};

/**
 * Run a render callback once the DOM is ready, and again whenever the live
 * catalog replaces the bundled data. Catalog pages use this instead of a bare
 * DOMContentLoaded listener.
 */
window.whenDataReady = function (callback) {
    const run = () => {
        try { callback(); } catch (error) { console.error("Render failed:", error); }
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
        run();
    }
    document.addEventListener("earnifyx:data-updated", run);
};


window.emptyStateHtml = function (title, text) {
    return `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🧪</div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${window.escapeHtml(title)}</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">${window.escapeHtml(text)}</p>
        </div>
    `;
};

// Homepage sections disappear entirely when the admin has published nothing for them
window.toggleHomeSection = function (container, hasItems) {
    if (!container) return;
    const section = container.closest("section") || container.parentElement;
    if (section) section.style.display = hasItems ? "" : "none";
};

// Kick off the catalog sync as early as possible (skipped inside the admin panel, which manages data itself)
if (!window.location.pathname.toLowerCase().includes("admin-dashboard")) {
    window.EarnifyData.load();
}

let firebaseInitPromise = null;

window.initializeFirebase = function () {
    if (window.__earnifyxFirebaseInitialized) {
        return Promise.resolve(window.firebaseApp);
    }
    if (firebaseInitPromise) return firebaseInitPromise;

    firebaseInitPromise = (async () => {
        try {
            const [
                { initializeApp },
                { getAnalytics, isSupported: analyticsSupported },
                { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup },
                { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where, orderBy, limit },
                { initializeAppCheck, ReCaptchaEnterpriseProvider }
            ] = await Promise.all([
                import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js"),
                import("https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js"),
                import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js"),
                import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"),
                import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app-check.js")
            ]);

            const app = initializeApp(FIREBASE_CONFIG);

            // App Check only on the real domain; the reCAPTCHA key is not registered for localhost.
            let appCheck = null;
            if (!IS_LOCALHOST) {
                try {
                    appCheck = initializeAppCheck(app, {
                        provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
                        isTokenAutoRefreshEnabled: true
                    });
                } catch (error) {
                    console.warn("App Check could not be initialised:", error);
                }
            }

            let analytics = null;
            try {
                if (await analyticsSupported()) analytics = getAnalytics(app);
            } catch (error) {
                console.warn("Analytics not available:", error);
            }

            const auth = getAuth(app);
            const db = getFirestore(app);

            window.firebaseApp = app;
            window.firebaseAnalytics = analytics;
            window.firebaseAuth = auth;
            window.firebaseDb = db;
            window.firebaseAppCheck = appCheck;
            window.firebaseAuthHelpers = {
                createUserWithEmailAndPassword,
                signInWithEmailAndPassword,
                signOut,
                updateProfile,
                onAuthStateChanged,
                sendPasswordResetEmail,
                GoogleAuthProvider,
                signInWithPopup,
                doc,
                setDoc,
                getDoc,
                updateDoc,
                collection,
                getDocs,
                query,
                where,
                orderBy,
                limit
            };
            window.__earnifyxFirebaseInitialized = true;
            return app;
        } catch (error) {
            console.warn("Firebase initialization failed:", error);
            firebaseInitPromise = null;
            return null;
        }
    })();

    return firebaseInitPromise;
};

window.applyStandardHeader = function () {
    const pagePath = window.location.pathname.toLowerCase();
    if (pagePath.includes("/login") || pagePath.includes("/register")) return;

    const header = document.querySelector(".site-header");
    // Only fill headers that were left empty (e.g. about.html); pages with a hand-written header keep it.
    if (!header || header.children.length > 0) return;

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
            <a href="ai-tools/" class="header-nav-link">&#129302; AI Tools</a>
            <a href="extensions/" class="header-nav-link">&#129513; Extensions</a>
            <a href="software/" class="header-nav-link">&#128187; Software</a>
            <a href="prompts/" class="header-nav-link">&#129504; PromptBhandar</a>
            <a href="resources/" class="header-nav-link">&#128230; Resources</a>
            <div class="header-dropdown">
                <button class="header-dropdown-btn" type="button" aria-haspopup="true" aria-expanded="false">
                    <span>More</span> <span class="dropdown-chevron">&#9662;</span>
                </button>
                <div class="header-dropdown-menu">
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

    if (window.initThemeToggle) window.initThemeToggle();
};

window.FirebaseService = {
    async ensureReady() {
        if (!window.firebaseAuth || !window.firebaseDb) {
            await window.initializeFirebase();
        }
        if (!window.firebaseAuth || !window.firebaseDb) {
            throw new Error("Could not connect to the authentication server. Please check your internet connection and try again.");
        }
        return {
            auth: window.firebaseAuth,
            db: window.firebaseDb,
            helpers: window.firebaseAuthHelpers
        };
    },

    /**
     * Resolve the trusted role for a Firebase user. Roles only come from the
     * ID token (custom claim) or the Firestore profile, which users cannot edit.
     */
    async resolveRole(firebaseUser, profile) {
        let claimAdmin = false;
        try {
            const tokenResult = await firebaseUser.getIdTokenResult();
            claimAdmin = tokenResult.claims.admin === true;
        } catch (e) {
            claimAdmin = false;
        }
        if (claimAdmin || profile?.role === "admin") return "admin";
        if (profile?.role === "manager") return "manager";
        return "user";
    },

    buildSessionProfile(firebaseUser, profile, role) {
        const email = firebaseUser.email || profile?.email || "";
        return {
            uid: firebaseUser.uid,
            name: profile?.name || firebaseUser.displayName || email.split("@")[0],
            email,
            phone: profile?.phone || "",
            role,
            isAdmin: role === "admin",
            plan: profile?.plan || "free",
            isPro: profile?.isPro === true,
            subscriptionStatus: profile?.subscriptionStatus || "inactive",
            premiumUntil: profile?.premiumUntil || null,
            memberSince: profile?.createdAt || profile?.memberSince || new Date().toISOString()
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
        return this.buildSessionProfile(credential.user, userDoc, "user");
    },

    async loginUser(arg1, arg2) {
        const email = (typeof arg1 === "object" && arg1 !== null) ? arg1.email : arg1;
        const password = (typeof arg1 === "object" && arg1 !== null) ? arg1.password : arg2;
        const { auth, helpers } = await this.ensureReady();
        const credential = await helpers.signInWithEmailAndPassword(auth, email, password);
        return this.sessionFromFirebaseUser(credential.user);
    },

    async loginWithGoogle() {
        const { auth, db, helpers } = await this.ensureReady();
        const provider = new helpers.GoogleAuthProvider();
        const credential = await helpers.signInWithPopup(auth, provider);
        const user = credential.user;
        const existing = await this.getUserProfile(user.uid);
        if (!existing) {
            const userDoc = {
                uid: user.uid,
                name: user.displayName || (user.email || "").split("@")[0],
                email: user.email,
                phone: user.phoneNumber || "",
                role: "user",
                plan: "free",
                isPro: false,
                subscriptionStatus: "inactive",
                premiumUntil: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await helpers.setDoc(helpers.doc(db, "users", user.uid), userDoc);
        }
        return this.sessionFromFirebaseUser(user);
    },

    async sessionFromFirebaseUser(firebaseUser) {
        const profile = (await this.getUserProfile(firebaseUser.uid)) || {};
        const role = await this.resolveRole(firebaseUser, profile);
        return this.buildSessionProfile(firebaseUser, profile, role);
    },

    async sendPasswordReset(email) {
        const { auth, helpers } = await this.ensureReady();
        await helpers.sendPasswordResetEmail(auth, email);
    },

    async getUserProfile(userOrUid) {
        const uid = typeof userOrUid === "string" ? userOrUid : userOrUid?.uid;
        if (!uid) return null;
        try {
            const { db, helpers } = await this.ensureReady();
            const snapshot = await helpers.getDoc(helpers.doc(db, "users", uid));
            return snapshot.exists() ? snapshot.data() : null;
        } catch (error) {
            console.warn("Could not load user profile:", error);
            return null;
        }
    },

    async updateOwnProfile({ name, phone }) {
        const { auth, db, helpers } = await this.ensureReady();
        if (!auth.currentUser) throw new Error("Please login first.");
        const updates = { updatedAt: new Date().toISOString() };
        if (typeof name === "string") updates.name = name;
        if (typeof phone === "string") updates.phone = phone;
        await helpers.updateDoc(helpers.doc(db, "users", auth.currentUser.uid), updates);
        if (typeof name === "string") {
            await helpers.updateProfile(auth.currentUser, { displayName: name });
        }
        return updates;
    },

    /** Wait for the Firebase auth state to settle once. Resolves with the firebase user or null. */
    waitForAuthUser() {
        return new Promise(async resolve => {
            try {
                const { auth, helpers } = await this.ensureReady();
                if (auth.currentUser) return resolve(auth.currentUser);
                const unsubscribe = helpers.onAuthStateChanged(auth, user => {
                    unsubscribe();
                    resolve(user);
                });
            } catch (error) {
                resolve(null);
            }
        });
    },

    /**
     * Verify the signed-in Firebase user's role for protected pages.
     * Returns the trusted session profile, or null if not signed in.
     */
    async getVerifiedSession() {
        const firebaseUser = await this.waitForAuthUser();
        if (!firebaseUser) return null;
        const session = await this.sessionFromFirebaseUser(firebaseUser);
        if (window.AuthUI) window.AuthUI.setUser(session);
        return session;
    },

    async requireAdminClaim() {
        const { auth } = await this.ensureReady();
        if (!auth.currentUser) {
            throw new Error("Please login with the admin account first.");
        }
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        if (tokenResult.claims.admin !== true) {
            throw new Error("Admin claim is missing. Set admin: true on this account, then logout and login again.");
        }
        return tokenResult;
    },

    /** Admin only: list registered users (requires the admin custom claim; see firestore.rules). */
    async listUsers(max = 200) {
        const { db, helpers } = await this.ensureReady();
        const snapshot = await helpers.getDocs(helpers.query(helpers.collection(db, "users"), helpers.limit(max)));
        return snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));
    },

    async findUserByEmail(email) {
        const { db, helpers } = await this.ensureReady();
        const snapshot = await helpers.getDocs(helpers.query(
            helpers.collection(db, "users"),
            helpers.where("email", "==", String(email).trim()),
            helpers.limit(1)
        ));
        if (snapshot.empty) return null;
        const d = snapshot.docs[0];
        return { uid: d.id, ...d.data() };
    },

    /** Admin only: change a user's role (user | manager | admin). */
    async setUserRole(uid, role) {
        if (!["user", "manager", "admin"].includes(role)) throw new Error("Invalid role.");
        const { db, helpers } = await this.ensureReady();
        await this.requireAdminClaim();
        await helpers.updateDoc(helpers.doc(db, "users", uid), {
            role,
            isAdmin: role === "admin",
            updatedAt: new Date().toISOString()
        });
        return true;
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

    loadAdSettings() {
        return this.loadSiteSettings("ad_settings");
    },

    loadAboutSettings() {
        return this.loadSiteSettings("about");
    },

    async logoutUser() {
        try {
            const { auth, helpers } = await this.ensureReady();
            await helpers.signOut(auth);
        } catch (e) {
            // ignore logout errors
        }
    },

    async syncDataToFirestore(type, dataArray) {
        const { db, helpers } = await this.ensureReady();
        await helpers.setDoc(helpers.doc(db, "site_data", type), {
            type,
            data: dataArray,
            updatedAt: new Date().toISOString()
        });
        return true;
    },

    async loadDataFromFirestore(type) {
        const { db, helpers } = await this.ensureReady();
        const snapshot = await helpers.getDoc(helpers.doc(db, "site_data", type));
        return snapshot.exists() ? (snapshot.data().data || []) : null;
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
    toast.innerHTML = `<span>✨</span> <span>${window.escapeHtml(message)}</span>`;
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
    if (!settings || !settings.enabled || path.includes("/login") || path.includes("/register") || path.includes("/admin-dashboard")) return;

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

function openGlobalModal(html) {
    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalContent = document.getElementById("globalModalContent");
    if (!modalOverlay || !modalContent) return false;
    modalContent.innerHTML = html;
    modalOverlay.classList.add("active");
    return true;
}

function jsString(value) {
    return String(value ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// Open Extension Details Modal
window.openExtensionModal = function (extId) {
    const ext = (window.EXTENSIONS_DATA || []).find(e => e.id === extId);
    if (!ext) return;
    if (window.AuthUI) AuthUI.recordViewed("Extensions", ext.name);
    const esc = window.escapeHtml;

    openGlobalModal(`
        <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem;">
            <div class="card-icon-box" style="background-color: ${esc(ext.iconBg)}; color: ${esc(ext.iconColor)}; width: 56px; height: 56px; font-size: 1.75rem; border-radius: var(--radius-lg);">
                ${ext.iconText}
            </div>
            <div>
                <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
                    <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">${esc(ext.name)}</h2>
                    <span class="badge badge-${esc(ext.badgeType || 'success')}">${esc(ext.badge)}</span>
                </div>
                <div class="text-muted" style="font-size: 0.82rem;">
                    ${esc(ext.version)} • ⭐ ${esc(ext.rating)} (${esc(ext.users)} active creators)
                </div>
            </div>
        </div>

        <p class="text-secondary" style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.25rem;">
            ${esc(ext.description)}
        </p>

        <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Key Capabilities:</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.85rem; color: var(--text-secondary);">
                ${(ext.features || []).map(f => `<li>✓ ${esc(f)}</li>`).join("")}
            </ul>
        </div>

        <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
            <a href="${esc(ext.downloadUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="flex: 1; margin-right: 0.75rem;">
                Add to Chrome ↗
            </a>
            <button class="btn btn-secondary btn-lg" onclick="toggleSaveItem('extension', '${jsString(ext.id)}', '${jsString(ext.name)}', event)">
                ❤️ Save
            </button>
        </div>
    `);
};

// Open Software Details Modal
window.openSoftwareModal = function (softId) {
    const soft = (window.SOFTWARE_DATA || []).find(s => s.id === softId);
    if (!soft) return;
    if (window.AuthUI) AuthUI.recordViewed("Software", soft.name);
    const esc = window.escapeHtml;

    openGlobalModal(`
        <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem;">
            <div class="card-icon-box" style="background-color: ${esc(soft.iconBg)}; color: ${esc(soft.iconColor)}; width: 56px; height: 56px; font-size: 1.75rem; border-radius: var(--radius-lg);">
                ${soft.iconText}
            </div>
            <div>
                <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
                    <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">${esc(soft.name)}</h2>
                    <span class="badge badge-${esc(soft.badgeType || 'primary')}">${esc(soft.badge)}</span>
                </div>
                <div class="text-muted" style="font-size: 0.82rem;">
                    ${esc(soft.version)} • Platform: ${esc(soft.platform)} • ⬇️ ${esc(soft.downloads)}
                </div>
            </div>
        </div>

        <p class="text-secondary" style="font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.25rem;">
            ${esc(soft.description)}
        </p>

        <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Features & Modules:</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.85rem; color: var(--text-secondary);">
                ${(soft.features || []).map(f => `<li>✓ ${esc(f)}</li>`).join("")}
            </ul>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.85rem; border-top: 1px dashed var(--border-color); padding-top: 0.65rem;">
                <strong>Requirements:</strong> ${esc(soft.systemRequirements)}
            </div>
        </div>

        <div class="flex items-center justify-between" style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
            <button class="btn btn-primary btn-lg" style="flex: 1; margin-right: 0.75rem;" onclick="triggerDownload('${jsString(soft.name)}', '${jsString(soft.downloadUrl || "")}')">
                Download Official Installer ↓
            </button>
            <button class="btn btn-secondary btn-lg" onclick="toggleSaveItem('software', '${jsString(soft.id)}', '${jsString(soft.name)}', event)">
                ❤️ Save
            </button>
        </div>
    `);
};

// Open Blog Details Modal
window.openBlogModal = function (postId) {
    const post = (window.BLOG_DATA || []).find(p => p.id === postId);
    if (!post) return;
    if (window.AuthUI) AuthUI.recordViewed("Blog", post.title);
    const esc = window.escapeHtml;

    openGlobalModal(`
        <div style="margin-bottom: 1.25rem;">
            <span class="badge badge-primary" style="margin-bottom: 0.5rem;">${esc(post.category)}</span>
            <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${esc(post.title)}</h2>
            <div class="text-muted" style="font-size: 0.82rem; margin-top: 0.4rem;">
                By ${esc(post.author)} • ${esc(post.date)} • ${esc(post.readTime)}
            </div>
        </div>

        ${post.thumbnail ? `<img src="${esc(post.thumbnail)}" alt="${esc(post.title)}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.25rem;" />` : ""}

        <div class="text-secondary" style="font-size: 0.95rem; line-height: 1.7; display: flex; flex-direction: column; gap: 1rem;">
            <p><strong>Overview:</strong> ${esc(post.shortDescription)}</p>
            <p>${esc(post.content)}</p>
        </div>

        <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem; text-align: right;">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `);
};

// Open Tutorial Details Modal
window.openTutorialModal = function (tutId) {
    const tut = (window.TUTORIALS_DATA || []).find(t => t.id === tutId);
    if (!tut) return;
    if (window.AuthUI) AuthUI.recordViewed("Tutorials", tut.title);
    const esc = window.escapeHtml;

    openGlobalModal(`
        <div style="margin-bottom: 1.25rem;">
            <span class="badge badge-purple" style="margin-bottom: 0.5rem;">${esc(tut.difficulty)} • ${esc(tut.time)}</span>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); line-height: 1.3;">${esc(tut.title)}</h2>
            <p class="text-secondary" style="font-size: 0.9rem; margin-top: 0.4rem;">${esc(tut.description)}</p>
        </div>

        <div style="background-color: var(--bg-surface-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Tutorial Steps:</h4>
            <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem; color: var(--text-secondary);">
                ${(tut.steps || []).map(step => `<li><strong>${esc(step)}</strong></li>`).join("")}
            </ol>
        </div>

        <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; text-align: right;">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `);
};

// Software download: opens the official link when one is configured
window.triggerDownload = function (name, url) {
    if (!window.AuthUI || !AuthUI.requireLogin()) return;
    AuthUI.addDownload("software", name, name);
    if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        window.showToast(`📥 Opening official download for ${name}...`);
    } else {
        window.showToast(`📥 Download link for ${name} is coming soon.`);
    }
    setTimeout(() => window.closeModal(), 1200);
};

// Resource download
window.downloadResource = function (resId, title, type) {
    if (!window.AuthUI || !AuthUI.requireLogin()) return;
    const res = (window.RESOURCES_DATA || []).find(r => r.id === resId);
    if (type === "Premium") {
        if (window.openUnlockModal) {
            window.openUnlockModal(title);
        } else {
            window.showToast("🔒 This is a premium pack. Upgrade to Pro to download.");
        }
        return;
    }
    AuthUI.addDownload("resource", resId, title);
    if (res && res.downloadUrl) {
        window.open(res.downloadUrl, "_blank", "noopener,noreferrer");
    }
    window.showToast(`📥 Downloading free pack: ${title}...`);
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

// Global Spotlight Search Integration
window.triggerGlobalSpotlight = function (initialQuery = "") {
    if (window.SpotlightSearch) {
        window.SpotlightSearch.open(initialQuery);
        return;
    }
    if (document.querySelector("script[data-search-loader]")) return;
    const script = document.createElement("script");
    script.src = "js/search.js";
    script.dataset.searchLoader = "true";
    script.onload = () => {
        if (window.SpotlightSearch) window.SpotlightSearch.open(initialQuery);
    };
    document.head.appendChild(script);
};

function bindGlobalUI() {
    // Mobile Drawer Handlers
    const menuToggleBtn = document.querySelector(".mobile-menu-toggle");
    const sidebar = document.querySelector(".app-sidebar, .admin-sidebar");
    const backdrop = document.querySelector(".sidebar-backdrop");

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener("click", () => {
            if (sidebar) {
                sidebar.classList.toggle("open");
                if (backdrop) backdrop.classList.toggle("active");
            } else {
                // Pages without a sidebar: open the spotlight search as the navigation hub
                window.triggerGlobalSpotlight();
            }
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
                const isActive = container.classList.toggle("active");
                btn.setAttribute("aria-expanded", String(isActive));
            });
        }
    });

    document.addEventListener("click", (e) => {
        dropdownContainers.forEach(container => {
            if (!container.contains(e.target)) {
                container.classList.remove("active");
                container.querySelector(".header-dropdown-btn")?.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Modal Close Button & Backdrop listener
    const modalOverlay = document.getElementById("globalModalOverlay");
    const modalCloseBtn = document.getElementById("globalModalCloseBtn");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", window.closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) window.closeModal();
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") window.closeModal();
    });

    // Header Search Click Handlers across all pages
    document.querySelectorAll(".header-search").forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            const input = el.querySelector(".global-search-input");
            window.triggerGlobalSpotlight(input ? input.value : "");
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
                window.showToast("🎉 Subscribed! Welcome to EarnifyX Lab.");
                input.value = "";
            }
        });
    }

    window.updateSavedCountBadge();
}

async function loadRemoteSiteContent() {
    if (!window.__earnifyxFirebaseInitialized) return;

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
}

// DOM Init — UI first, Firebase-dependent extras afterwards so the page never waits on the network
document.addEventListener("DOMContentLoaded", async () => {
    window.applyStandardHeader();
    if (window.renderAuthUI) window.renderAuthUI(window.AuthUI && window.AuthUI.getUser());
    bindGlobalUI();

    await window.initializeFirebase();
    await loadRemoteSiteContent();
});
