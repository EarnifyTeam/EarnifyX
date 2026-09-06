/**
 * EarnifyX Lab - Frontend session and saved-item state
 * 
 * FUTURE BACKEND INTEGRATION:
 * // Replace localStorage state with Supabase Auth:
 * // const { data: { user } } = await supabase.auth.getUser();
 * // const { data, error } = await supabase.from('bookmarks').select('*').eq('user_id', user.id);
 */

const AuthUI = {
    BOOKMARKS_KEY: "earnifyx_saved_bookmarks",
    DOWNLOADS_KEY: "earnifyx_downloads",
    RECENT_KEY: "earnifyx_recently_viewed",
    USERS_KEY: "earnifyx_demo_users",
    USER_KEY: "earnifyx_user_session",

    getUser() {
        try {
            const raw = localStorage.getItem(this.USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    isAuthenticated() {
        return Boolean(this.getUser());
    },

    async waitForFirebaseSession() {
        if (!window.FirebaseService) return this.getUser();
        try {
            await window.initializeFirebase();
            const { auth, helpers } = await window.FirebaseService.ensureReady();
            return await new Promise(resolve => {
                let settled = false;
                const finish = user => {
                    if (settled) return;
                    settled = true;
                    resolve(user);
                };
                helpers.onAuthStateChanged(auth, async firebaseUser => {
                    if (!firebaseUser) {
                        finish(this.getUser());
                        return;
                    }
                    const profile = await window.FirebaseService.getUserProfile(firebaseUser);
                    this.setUser({
                        ...profile,
                        uid: firebaseUser.uid,
                        name: profile.name || firebaseUser.displayName || firebaseUser.email.split("@")[0],
                        email: firebaseUser.email,
                        role: profile.role || "user",
                        plan: profile.plan || "free",
                        isPro: profile.isPro === true,
                        memberSince: profile.createdAt || profile.memberSince || new Date().toISOString()
                    });
                    finish(this.getUser());
                });
            });
        } catch (error) {
            console.warn("Firebase session check failed:", error);
            return this.getUser();
        }
    },

    setUser(userData) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        const users = this.getUsers();
        const index = users.findIndex(user => user.email.toLowerCase() === userData.email.toLowerCase());
        const record = { ...userData, role: userData.role || "user", updatedAt: new Date().toISOString() };
        if (index >= 0) users[index] = { ...users[index], ...record };
        else users.push(record);
        // FUTURE USER DATABASE: Replace this browser-only directory with Supabase profiles.
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },

    getUsers() {
        try { return JSON.parse(localStorage.getItem(this.USERS_KEY) || "[]"); } catch (e) { return []; }
    },

    logout() {
        try {
            if (window.FirebaseService && window.firebaseAuth) {
                window.FirebaseService.logoutUser().catch(() => {});
            }
        } catch (e) {
            // ignore Firebase logout errors
        }
        localStorage.removeItem(this.USER_KEY);
    },

    getUserStorageKey(key) {
        const user = this.getUser();
        return user ? `${key}_${user.email.toLowerCase()}` : key;
    },

    getBookmarks() {
        if (!this.isAuthenticated()) return [];
        try {
            const raw = localStorage.getItem(this.getUserStorageKey(this.BOOKMARKS_KEY));
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    isSaved(type, id) {
        const bookmarks = this.getBookmarks();
        return bookmarks.some(b => b.type === type && b.id === id);
    },

    toggleBookmark(type, id, title) {
        if (!this.isAuthenticated()) return false;
        let bookmarks = this.getBookmarks();
        const index = bookmarks.findIndex(b => b.type === type && b.id === id);
        let status = false;

        if (index > -1) {
            bookmarks.splice(index, 1);
            status = false;
        } else {
            bookmarks.push({
                type,
                id,
                title,
                savedAt: new Date().toISOString()
            });
            status = true;
        }

        // FUTURE: Store user bookmarks in Supabase database.
        localStorage.setItem(this.getUserStorageKey(this.BOOKMARKS_KEY), JSON.stringify(bookmarks));
        return status;
    },

    getDownloads() {
        if (!this.isAuthenticated()) return [];
        try {
            const raw = localStorage.getItem(this.getUserStorageKey(this.DOWNLOADS_KEY));
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    getRecentlyViewed() {
        if (!this.isAuthenticated()) return [];
        try { return JSON.parse(localStorage.getItem(this.getUserStorageKey(this.RECENT_KEY)) || "[]"); } catch (e) { return []; }
    },

    recordViewed(type, title) {
        if (!this.isAuthenticated()) return;
        const items = this.getRecentlyViewed().filter(item => item.type !== type);
        items.unshift({ type, title, viewedAt: new Date().toISOString() });
        localStorage.setItem(this.getUserStorageKey(this.RECENT_KEY), JSON.stringify(items.slice(0, 4)));
    },

    addDownload(type, id, title) {
        if (!this.isAuthenticated()) return false;
        const downloads = this.getDownloads();
        if (!downloads.some(item => item.type === type && item.id === id)) {
            downloads.unshift({ type, id, title, downloadedAt: new Date().toISOString() });
            // FUTURE: Store user downloads in Supabase database.
            localStorage.setItem(this.getUserStorageKey(this.DOWNLOADS_KEY), JSON.stringify(downloads));
        }
        return true;
    },

    requireLogin() {
        if (this.isAuthenticated()) return true;
        window.showAuthPrompt && window.showAuthPrompt();
        return false;
    }
};

window.AuthUI = AuthUI;

// Global helper for toggling bookmarks from card buttons
window.toggleSaveItem = function (type, id, title, event) {
    if (event) event.stopPropagation();
    if (!AuthUI.requireLogin()) return;
    const saved = AuthUI.toggleBookmark(type, id, title);
    
    // Update button visual
    if (event && event.currentTarget) {
        const btn = event.currentTarget;
        if (saved) {
            btn.classList.add("saved");
            btn.textContent = "❤️";
        } else {
            btn.classList.remove("saved");
            btn.textContent = "🤍";
        }
    }

    if (window.updateSavedCountBadge) {
        window.updateSavedCountBadge();
    }

    if (window.showToast) {
        window.showToast(saved ? `Saved "${title}" to your library` : `Removed "${title}" from saved items`);
    }
};

window.showAuthPrompt = function () {
    if (document.getElementById("authPromptOverlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "authPromptOverlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(15,23,42,.45);";
    overlay.innerHTML = `<div style="max-width:380px;width:100%;padding:2rem;background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-lg);box-shadow:var(--shadow-xl);text-align:center"><h2 style="margin-bottom:.5rem">Please login to continue.</h2><p class="text-secondary" style="margin-bottom:1.5rem">Create an account or login to save items, bookmark prompts and manage downloads.</p><div class="flex gap-3" style="justify-content:center"><button class="btn btn-secondary" onclick="document.getElementById('authPromptOverlay').remove()">Cancel</button><a class="btn btn-primary" href="login/">Login</a><a class="btn btn-secondary" href="register/">Create Account</a></div></div>`;
    document.body.appendChild(overlay);
};

window.confirmLogout = function () {
    if (!window.confirm("Are you sure you want to logout?")) return;
    // FUTURE SUPABASE AUTH: Supabase session termination belongs here.
    AuthUI.logout();
    window.location.href = "./";
};

function renderAuthUI(user) {
    if (user) {
        document.body.classList.add("authenticated-view");
    } else {
        document.body.classList.remove("authenticated-view");
    }
    document.querySelectorAll("[data-auth-user-name]").forEach(element => {
        element.textContent = user ? user.name : "Guest";
    });
    document.querySelectorAll(".public-auth-actions").forEach(container => {
        if (!user) return;
        container.innerHTML = `<a href="dashboard/" class="btn btn-subtle">Dashboard</a><button class="btn btn-primary" onclick="confirmLogout()">Logout</button>`;
    });
    document.querySelectorAll(".header-auth-actions").forEach(container => {
        if (!user) return;
        container.innerHTML = `<a href="dashboard/" class="btn btn-subtle" style="font-size: 0.88rem; font-weight: 600;">Dashboard</a><button class="btn btn-primary" style="font-size: 0.88rem;" onclick="confirmLogout()">Logout</button>`;
    });

    // Dynamic Welcome Card Sync
    const welcomeTitle = document.querySelector(".welcome-title");
    const welcomeSubtitle = document.querySelector(".welcome-subtitle");
    const welcomeBtn = document.querySelector(".btn-login-account");
    if (welcomeTitle) {
        if (user) {
            welcomeTitle.innerHTML = `<span>Welcome back, ${user.name || "Creator"}</span> <span>👋</span>`;
            if (welcomeSubtitle) welcomeSubtitle.textContent = "Ready to create something amazing today?";
            if (welcomeBtn) {
                welcomeBtn.textContent = "Go to Dashboard →";
                welcomeBtn.setAttribute("href", "dashboard/");
            }
        } else {
            welcomeTitle.innerHTML = `<span>Welcome to EarnifyX</span> <span>👋</span>`;
            if (welcomeSubtitle) welcomeSubtitle.textContent = "Discover tools, prompts & resources for creators.";
            if (welcomeBtn) {
                welcomeBtn.textContent = "Login / Join Free →";
                welcomeBtn.setAttribute("href", "login/");
            }
        }
    }

    // Dynamic Stats Count Badges (if data arrays loaded)
    const statTools = document.querySelector(".stat-tools-count");
    const statExts = document.querySelector(".stat-extensions-count");
    const statSoft = document.querySelector(".stat-software-count");
    const statPrompts = document.querySelector(".stat-prompts-count");
    if (statTools && window.TOOLS_DATA) statTools.textContent = `${window.TOOLS_DATA.length}+`;
    if (statExts && window.EXTENSIONS_DATA) statExts.textContent = `${window.EXTENSIONS_DATA.length}+`;
    if (statSoft && window.SOFTWARE_DATA) statSoft.textContent = `${window.SOFTWARE_DATA.length}+`;
    if (statPrompts && window.PROMPTS_DATA) statPrompts.textContent = `${window.PROMPTS_DATA.length}+`;

    if (window.updateSavedCountBadge) {
        window.updateSavedCountBadge();
    }
}

window.renderAuthUI = renderAuthUI;
document.addEventListener("DOMContentLoaded", async () => {
    renderAuthUI(AuthUI.getUser());

    if (!window.FirebaseService) return;
    try {
        await window.initializeFirebase();
        const { auth, helpers } = await window.FirebaseService.ensureReady();
        helpers.onAuthStateChanged(auth, async firebaseUser => {
            if (!firebaseUser) return;

            const profile = await window.FirebaseService.getUserProfile(firebaseUser);
            AuthUI.setUser({
                ...profile,
                uid: firebaseUser.uid,
                name: profile.name || firebaseUser.displayName || firebaseUser.email.split("@")[0],
                email: firebaseUser.email,
                role: profile.role || "user",
                plan: profile.plan || "free",
                isPro: profile.isPro === true,
                memberSince: profile.createdAt || profile.memberSince || new Date().toISOString()
            });
            renderAuthUI(AuthUI.getUser());
        });
    } catch (error) {
        console.warn("Firebase auth state sync failed:", error);
    }
});
