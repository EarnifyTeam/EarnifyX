/**
 * EarnifyX Lab - Complete Admin Management Engine
 * Provides live CRUD, table rendering, editing, deletion, and code generation for:
 * 1. Chrome Extensions
 * 2. Blog Posts & Articles
 * 3. Master Prompts
 * 4. Software & Apps
 * 5. AI Tools Directory
 * 6. Creator Resources
 * 7. Tutorials & Guides
 */

const Admin = {
    state: {
        currentTab: "tab-overview",
        editingType: null,
        editingId: null,
        searchQueries: {}
    },

    getCurrentUser() {
        return window.AuthUI ? window.AuthUI.getUser() : null;
    },

    isManager() {
        const user = this.getCurrentUser();
        return user && user.role === "manager";
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return Boolean(user) && (user.role === "admin" || user.isAdmin === true);
    },

    singularLabel(type) {
        const labels = {
            extensions: "Extension", software: "Software", prompts: "Prompt", tools: "Tool",
            resources: "Resource", blog: "Blog Post", tutorials: "Tutorial"
        };
        return labels[type] || type;
    },

    hasPanelAccess() {
        return this.isAdmin() || this.isManager();
    },

    /**
     * Verify the signed-in Firebase account before showing anything.
     * The cached localStorage session is never trusted on its own.
     */
    async verifyAccess() {
        const shell = document.querySelector(".app-container");
        if (shell) shell.style.visibility = "hidden";

        let session = null;
        if (window.FirebaseService) {
            try {
                await window.initializeFirebase();
                if (window.__earnifyxFirebaseInitialized) {
                    session = await window.FirebaseService.getVerifiedSession();
                } else {
                    session = null;
                }
            } catch (error) {
                console.warn("Admin access verification failed:", error);
                session = null;
            }
        }

        if (!session) {
            if (window.AuthUI) window.AuthUI.logout();
            window.location.replace("login/?next=admin-dashboard");
            return false;
        }

        if (!this.hasPanelAccess()) {
            if (window.showToast) window.showToast("This account does not have admin access.");
            setTimeout(() => window.location.replace("dashboard/"), 900);
            return false;
        }

        if (shell) shell.style.visibility = "";
        return true;
    },

    renderRoleIndicator() {
        const container = document.getElementById("adminUserRoleBadge");
        const user = this.getCurrentUser();
        if (!container) return;

        if (this.isManager()) {
            container.innerHTML = `
                <div class="admin-role-indicator role-manager">
                    <span>🛡️</span>
                    <span>Manager Access (${window.escapeHtml ? window.escapeHtml(user?.name || "Content Manager") : "Content Manager"})</span>
                    <span style="font-size:0.7rem; opacity:0.8; font-weight:400;">• Create & Edit Mode</span>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="admin-role-indicator role-admin">
                    <span>👑</span>
                    <span>Super Admin (${window.escapeHtml ? window.escapeHtml(user?.name || "Owner") : "Owner"})</span>
                    <span style="font-size:0.7rem; opacity:0.8; font-weight:400;">• Full Control</span>
                </div>
            `;
        }
    },

    applyManagerRestrictions() {
        // Managers only get the content tabs; site-wide settings and backups stay admin-only
        ["#tab-backup", "#tab-team"].forEach(selector => {
            const link = document.querySelector(`.admin-tab-btn[href="${selector}"]`);
            if (link) link.style.display = "none";
        });

        document.querySelectorAll("#tab-overview .admin-form-box").forEach(box => {
            if (box.querySelector("form")) box.style.display = "none";
        });
        document.querySelectorAll("#tab-overview [onclick*='exportAllBackupJSON']").forEach(btn => {
            btn.style.display = "none";
        });
    },

    async init() {
        const allowed = await this.verifyAccess();
        if (!allowed) return;

        this.renderRoleIndicator();
        this.bindEvents();
        this.loadRemoteData();
        
        if (this.isManager()) {
            this.applyManagerRestrictions();
        } else {
            this.loadSocialLinks();
            this.loadAdSettings();
            this.loadAboutSettings();
            this.loadSitemapSettings();
            this.loadTeam();
        }

        this.renderOverviewStats();
        this.renderAllTables();
        this.handleHashNavigation();
    },

    async loadSocialLinks() {
        if (!window.FirebaseService) return;
        try {
            await window.initializeFirebase();
            const links = await window.FirebaseService.loadSiteSettings("social_links");
            ["whatsapp", "youtube", "telegram", "instagram"].forEach(key => {
                const field = document.getElementById(`socialLink_${key}`);
                if (field && links[key]) field.value = links[key];
            });
        } catch (error) {
            console.warn("Social links could not be loaded:", error);
        }
    },

    async saveSocialLinks(event) {
        event.preventDefault();
        const links = {};
        ["whatsapp", "youtube", "telegram", "instagram"].forEach(key => {
            links[key] = document.getElementById(`socialLink_${key}`).value.trim();
        });

        try {
            await window.initializeFirebase();
            await window.FirebaseService.saveSiteSettings("social_links", links);
            if (window.showToast) window.showToast("✅ Social links updated on the website!");
        } catch (error) {
            console.error(error);
            if (window.showToast) window.showToast("Could not save links. Check admin permission and Firestore rules.");
        }
    },

    async loadAdSettings() {
        if (!window.FirebaseService) return;
        try {
            await window.initializeFirebase();
            const settings = await window.FirebaseService.loadAdSettings();
            const enabled = document.getElementById("adsEnabled");
            const network = document.getElementById("adsNetwork");
            if (enabled) enabled.checked = settings.enabled === true;
            if (network && settings.network) network.value = settings.network;
            ["topCode", "contentCode", "footerCode"].forEach(key => {
                const field = document.getElementById(`ads${key[0].toUpperCase()}${key.slice(1)}`);
                if (field) field.value = settings[key] || "";
            });
        } catch (error) {
            console.warn("Ad settings could not be loaded:", error);
        }
    },

    async saveAdSettings(event) {
        event.preventDefault();
        const settings = {
            enabled: document.getElementById("adsEnabled").checked,
            network: document.getElementById("adsNetwork").value,
            topCode: document.getElementById("adsTopCode").value.trim(),
            contentCode: document.getElementById("adsContentCode").value.trim(),
            footerCode: document.getElementById("adsFooterCode").value.trim()
        };
        try {
            await window.initializeFirebase();
            await window.FirebaseService.requireAdminClaim();
            await window.FirebaseService.saveSiteSettings("ad_settings", settings);
            if (window.showToast) window.showToast("✅ Ad settings saved. Ads will appear on public pages.");
        } catch (error) {
            console.error(error);
            if (window.showToast) window.showToast(error.message || "Could not save ad settings. Check admin permission and Firestore rules.");
        }
    },

    async loadAboutSettings() {
        if (!window.FirebaseService) return;
        try {
            await window.initializeFirebase();
            const settings = await window.FirebaseService.loadAboutSettings();
            const fields = {
                Name: "name",
                Role: "role",
                ImageUrl: "imageUrl",
                ShortBio: "shortBio",
                Details: "details",
                Location: "location",
                Email: "email",
                Instagram: "instagram",
                YouTube: "youtube"
            };
            Object.entries(fields).forEach(([fieldName, settingName]) => {
                const field = document.getElementById(`about${fieldName}`);
                if (field) field.value = settings[settingName] || "";
            });
        } catch (error) {
            console.warn("About settings could not be loaded:", error);
        }
    },

    async saveAboutSettings(event) {
        event.preventDefault();
        const settings = {
            name: document.getElementById("aboutName").value.trim(),
            role: document.getElementById("aboutRole").value.trim(),
            imageUrl: document.getElementById("aboutImageUrl").value.trim(),
            shortBio: document.getElementById("aboutShortBio").value.trim(),
            details: document.getElementById("aboutDetails").value.trim(),
            location: document.getElementById("aboutLocation").value.trim(),
            email: document.getElementById("aboutEmail").value.trim(),
            instagram: document.getElementById("aboutInstagram").value.trim(),
            youtube: document.getElementById("aboutYouTube").value.trim()
        };
        try {
            await window.initializeFirebase();
            await window.FirebaseService.requireAdminClaim();
            await window.FirebaseService.saveSiteSettings("about", settings);
            if (window.showToast) window.showToast("✅ About Us details saved successfully!");
        } catch (error) {
            console.error(error);
            if (window.showToast) window.showToast(error.message || "Could not save About Us details.");
        }
    },

    async loadSitemapSettings() {
        if (!window.FirebaseService) return;
        try {
            await window.initializeFirebase();
            const settings = await window.FirebaseService.loadSiteSettings("sitemap");
            const baseUrl = document.getElementById("sitemapBaseUrl");
            const paths = document.getElementById("sitemapPaths");
            if (baseUrl && settings.baseUrl) baseUrl.value = settings.baseUrl;
            if (paths && Array.isArray(settings.paths)) paths.value = settings.paths.join("\n");
        } catch (error) {
            console.warn("Sitemap settings could not be loaded:", error);
        }
    },

    async generateSitemap(event) {
        event.preventDefault();
        const baseUrl = document.getElementById("sitemapBaseUrl").value.trim().replace(/\/+$/, "");
        const paths = document.getElementById("sitemapPaths").value.split("\n").map(path => path.trim()).filter(Boolean);
        if (!baseUrl || !paths.length) {
            if (window.showToast) window.showToast("Add the website URL and at least one path first.");
            return;
        }

        const escapeXml = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => {
            const url = path.startsWith("http") ? path : `${baseUrl}/${path.replace(/^\/+/, "")}`;
            return `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n  </url>`;
        }).join("\n")}\n</urlset>\n`;

        try {
            await window.initializeFirebase();
            await window.FirebaseService.requireAdminClaim();
            await window.FirebaseService.saveSiteSettings("sitemap", { baseUrl, paths });
        } catch (error) {
            console.error(error);
            if (window.showToast) window.showToast(error.message || "Could not save sitemap settings.");
            return;
        }

        const blob = new Blob([xml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sitemap.xml";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        if (window.showToast) window.showToast("✅ sitemap.xml generated and downloaded.");
    },

    // ---- Team & Managers ----
    team: [],

    async loadTeam() {
        const container = document.getElementById("teamTableContainer");
        if (!container || !window.FirebaseService) return;
        try {
            await window.initializeFirebase();
            this.team = await window.FirebaseService.listUsers();
            this.team.sort((x, y) => String(x.name || "").localeCompare(String(y.name || "")));
            this.renderTeamTable();
        } catch (error) {
            console.warn("Team list could not be loaded:", error);
            container.innerHTML = `<p class="text-secondary" style="font-size: 0.88rem;">Could not load users (${window.escapeHtml(error.message || error)}). Make sure the latest firestore.rules are published and you are logged in as admin.</p>`;
        }
    },

    renderTeamTable() {
        const container = document.getElementById("teamTableContainer");
        if (!container) return;
        const esc = window.escapeHtml;
        const q = (document.getElementById("teamSearchInput")?.value || "").trim().toLowerCase();
        const me = this.getCurrentUser();
        const rows = this.team.filter(u => !q || String(u.name || "").toLowerCase().includes(q) || String(u.email || "").toLowerCase().includes(q));

        if (!rows.length) {
            container.innerHTML = `<p class="text-secondary" style="font-size: 0.88rem;">${this.team.length ? "No users match your search." : "No registered users yet."}</p>`;
            return;
        }

        const roleBadge = role => role === "admin"
            ? '<span class="badge badge-warning">👑 Admin</span>'
            : role === "manager" ? '<span class="badge badge-primary">🛡️ Manager</span>' : '<span class="badge badge-success">User</span>';

        container.innerHTML = `
            <div style="overflow-x: auto;">
                <table class="admin-data-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th style="text-align: right;">Change Role</th></tr></thead>
                    <tbody>
                        ${rows.map(u => {
                            const role = u.role || "user";
                            const isMe = me && (u.uid === me.uid || (u.email || "").toLowerCase() === (me.email || "").toLowerCase());
                            const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-";
                            const actions = isMe
                                ? '<span class="text-muted" style="font-size:0.8rem;">Cannot change own role</span>'
                                : [
                                    role !== "manager" ? `<button class="btn btn-sm btn-primary" onclick="Admin.changeUserRole('${esc(u.uid)}', 'manager')">Make Manager</button>` : "",
                                    role !== "user" ? `<button class="btn btn-sm btn-secondary" onclick="Admin.changeUserRole('${esc(u.uid)}', 'user')">Remove Access</button>` : ""
                                ].join(" ");
                            return `<tr>
                                <td><strong style="color: var(--text-primary);">${esc(u.name || "-")}</strong>${isMe ? ' <span class="text-muted" style="font-size:0.72rem;">(you)</span>' : ""}</td>
                                <td style="font-size: 0.85rem;">${esc(u.email || "-")}</td>
                                <td>${roleBadge(role)}</td>
                                <td style="font-size: 0.82rem; color: var(--text-secondary);">${esc(joined)}</td>
                                <td style="text-align: right; white-space: nowrap;">${actions}</td>
                            </tr>`;
                        }).join("")}
                    </tbody>
                </table>
            </div>
            <p class="text-muted" style="font-size: 0.75rem; margin-top: 0.75rem;">${this.team.length} registered user${this.team.length === 1 ? "" : "s"}. Role changes apply the next time that person logs in or refreshes.</p>
        `;
    },

    async changeUserRole(uid, role) {
        const user = this.team.find(u => u.uid === uid);
        const label = role === "manager" ? "give Manager access to" : "remove admin-panel access from";
        if (!confirm(`Are you sure you want to ${label} ${user?.email || "this user"}?`)) return;
        try {
            await window.FirebaseService.setUserRole(uid, role);
            if (user) { user.role = role; user.isAdmin = role === "admin"; }
            this.renderTeamTable();
            if (window.showToast) window.showToast(role === "manager" ? `🛡️ ${user?.name || "User"} is now a Manager.` : `Access removed for ${user?.name || "user"}.`);
        } catch (error) {
            console.error(error);
            if (window.showToast) window.showToast(error.message || "Could not update role. Check admin permission and Firestore rules.");
        }
    },

    async addManagerByEmail(event) {
        event.preventDefault();
        const input = document.getElementById("teamManagerEmail");
        const email = input.value.trim();
        if (!email) return;
        try {
            await window.initializeFirebase();
            let user = this.team.find(u => (u.email || "").toLowerCase() === email.toLowerCase());
            if (!user) user = await window.FirebaseService.findUserByEmail(email);
            if (!user) {
                if (window.showToast) window.showToast(`No account found for ${email}. Ask them to register on the website first.`, 4500);
                return;
            }
            if (user.role === "manager" || user.role === "admin") {
                if (window.showToast) window.showToast(`${user.name || email} already has ${user.role} access.`);
                return;
            }
            await window.FirebaseService.setUserRole(user.uid, "manager");
            input.value = "";
            await this.loadTeam();
            if (window.showToast) window.showToast(`🛡️ ${user.name || email} now has Manager access!`);
        } catch (error) {
            console.error(error);
            if (window.showToast) window.showToast(error.message || "Could not grant access. Check admin permission and Firestore rules.");
        }
    },

    async loadRemoteData() {
        if (!window.FirebaseService) return;
        try {
            await window.initializeFirebase();
            const types = ["extensions", "software", "prompts", "tools", "resources", "blog", "tutorials"];
            for (const type of types) {
                const data = await window.FirebaseService.loadDataFromFirestore(type);
                if (Array.isArray(data)) {
                    const keyMap = {
                        extensions: "earnifyx_data_extensions",
                        software: "earnifyx_data_software",
                        prompts: "earnifyx_data_prompts",
                        tools: "earnifyx_data_tools",
                        resources: "earnifyx_data_resources",
                        blog: "earnifyx_data_blog",
                        tutorials: "earnifyx_data_tutorials"
                    };
                    const propMap = {
                        extensions: "EXTENSIONS_DATA",
                        software: "SOFTWARE_DATA",
                        prompts: "PROMPTS_DATA",
                        tools: "TOOLS_DATA",
                        resources: "RESOURCES_DATA",
                        blog: "BLOG_DATA",
                        tutorials: "TUTORIALS_DATA"
                    };
                    const key = keyMap[type];
                    const prop = propMap[type];
                    if (key && prop) {
                        localStorage.setItem(key, JSON.stringify(data));
                        window[prop] = data;
                    }
                }
            }
            this.renderOverviewStats();
            this.renderAllTables();
        } catch (error) {
            console.warn("Firestore data sync failed:", error);
        }
    },

    // Save helper to update both window and localStorage
    async saveData(type, dataArray) {
        const keyMap = {
            extensions: "earnifyx_data_extensions",
            software: "earnifyx_data_software",
            prompts: "earnifyx_data_prompts",
            tools: "earnifyx_data_tools",
            resources: "earnifyx_data_resources",
            blog: "earnifyx_data_blog",
            tutorials: "earnifyx_data_tutorials"
        };
        const propMap = {
            extensions: "EXTENSIONS_DATA",
            software: "SOFTWARE_DATA",
            prompts: "PROMPTS_DATA",
            tools: "TOOLS_DATA",
            resources: "RESOURCES_DATA",
            blog: "BLOG_DATA",
            tutorials: "TUTORIALS_DATA"
        };

        const key = keyMap[type];
        const prop = propMap[type];
        if (key && prop) {
            localStorage.setItem(key, JSON.stringify(dataArray));
            window[prop] = dataArray;

            if (window.FirebaseService) {
                try {
                    await window.initializeFirebase();
                    await window.FirebaseService.syncDataToFirestore(type, dataArray);
                } catch (error) {
                    console.warn("Firebase sync warning:", error);
                }
            }

            if (window.showToast) {
                window.showToast(`✅ Saved ${type} data successfully!`);
            }
            this.renderOverviewStats();
            this.renderTable(type);
        }
    },

    getData(type) {
        const propMap = {
            extensions: "EXTENSIONS_DATA",
            software: "SOFTWARE_DATA",
            prompts: "PROMPTS_DATA",
            tools: "TOOLS_DATA",
            resources: "RESOURCES_DATA",
            blog: "BLOG_DATA",
            tutorials: "TUTORIALS_DATA"
        };
        const prop = propMap[type];
        return window[prop] || [];
    },

    // Tab switching and hash routing
    bindEvents() {
        const tabs = document.querySelectorAll(".admin-tab-btn");
        tabs.forEach(tab => {
            tab.addEventListener("click", (e) => {
                e.preventDefault();
                const targetTab = tab.getAttribute("data-tab");
                this.switchTab(targetTab);
            });
        });

        window.addEventListener("hashchange", () => {
            this.handleHashNavigation();
        });
    },

    handleHashNavigation() {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
            this.switchTab(hash);
        }
    },

    switchTab(tabId) {
        const tabs = document.querySelectorAll(".admin-tab-btn");
        const contents = document.querySelectorAll(".admin-tab-content");

        const targetTab = document.querySelector(`.admin-tab-btn[data-tab="${tabId}"]`);
        const targetContent = document.getElementById(tabId);

        if (targetContent) {
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.style.display = "none");

            if (targetTab) targetTab.classList.add("active");
            targetContent.style.display = "block";

            document.querySelector(".admin-sidebar")?.classList.remove("open");
            document.querySelector(".sidebar-backdrop")?.classList.remove("active");
            window.location.hash = tabId;
            this.state.currentTab = tabId;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    },

    renderOverviewStats() {
        const extCount = this.getData("extensions").length;
        const softCount = this.getData("software").length;
        const promptCount = this.getData("prompts").length;
        const toolCount = this.getData("tools").length;
        const resCount = this.getData("resources").length;
        const blogCount = this.getData("blog").length;
        const tutCount = this.getData("tutorials").length;

        const setStat = (id, count) => {
            const el = document.getElementById(id);
            if (el) el.textContent = count;
        };

        setStat("adminStatExtensions", extCount);
        setStat("adminStatSoftware", softCount);
        setStat("adminStatPrompts", promptCount);
        setStat("adminStatTools", toolCount);
        setStat("adminStatResources", resCount);
        setStat("adminStatBlog", blogCount);
        setStat("adminStatTutorials", tutCount);
    },

    renderAllTables() {
        ["extensions", "software", "prompts", "tools", "resources", "blog", "tutorials"].forEach(type => {
            this.renderTable(type);
        });
    },

    renderTable(type) {
        const container = document.getElementById(`tableContainer_${type}`);
        if (!container) return;

        let items = this.getData(type);
        const query = (this.state.searchQueries[type] || "").toLowerCase().trim();
        if (query) {
            items = items.filter(item => {
                const name = (item.name || item.title || "").toLowerCase();
                const desc = (item.shortDescription || item.description || "").toLowerCase();
                const cat = (item.category || "").toLowerCase();
                return name.includes(query) || desc.includes(query) || cat.includes(query);
            });
        }

        if (!items.length) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
                    <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🔍</span>
                    <p style="font-size: 0.92rem;">No ${type} entries found ${query ? `matching "${query}"` : ""}.</p>
                </div>
            `;
            return;
        }

        let tableHtml = `
            <div style="overflow-x: auto;">
                <table class="admin-data-table">
                    <thead>
                        <tr>
                            <th>Item Name / Title</th>
                            <th>Category</th>
                            <th>Status / Badge</th>
                            <th>Details</th>
                            <th style="text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        const esc = window.escapeHtml || (v => String(v ?? ""));
        items.forEach(item => {
            const name = esc(item.name || item.title || "Untitled");
            const cat = esc(item.category || item.platform || "-");
            const badge = esc(item.badge || item.type || "Active");
            const badgeType = esc(item.badgeType || "primary");
            const details = esc(item.version ? `${item.version} • ⭐ ${item.rating || 4.8}` : (item.date || item.pricing || item.difficulty || item.reads || "-"));
            const safeId = esc(item.id);
            
            // Dynamic Author Label
            const isManagerPost = item.authorRole === "manager" || (item.author && item.author !== "Admin" && item.author !== "EarnifyX Team");
            const authorText = isManagerPost ? `👤 By ${esc(item.authorName || item.author)} (Manager)` : `🛡️ By Admin`;

            const isManager = this.isManager();

            tableHtml += `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <span style="font-size: 1.25rem;">${item.iconText || item.icon || "📦"}</span>
                            <div>
                                <strong style="color: var(--text-primary); font-size: 0.9rem;">${name}</strong>
                                <div style="display: flex; align-items: center; gap: 0.4rem; margin-top: 0.15rem;">
                                    <span style="font-size: 0.72rem; color: var(--text-muted);">${safeId}</span>
                                    <span style="font-size: 0.7rem; font-weight: 600; color: ${isManagerPost ? 'var(--accent-indigo)' : 'var(--accent-primary)'};">${authorText}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td><span class="prompt-category-tag">${cat}</span></td>
                    <td><span class="badge badge-${badgeType}">${badge}</span></td>
                    <td style="font-size: 0.82rem; color: var(--text-secondary);">${details}</td>
                    <td style="text-align: right; white-space: nowrap;">
                        <button class="btn btn-sm btn-subtle" onclick="Admin.editItem('${type}', '${safeId}')" title="Edit">
                            ✏️ Edit
                        </button>
                        ${!isManager ? `
                        <button class="btn btn-sm btn-secondary" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.2);" onclick="Admin.deleteItem('${type}', '${safeId}')" title="Delete">
                            🗑️ Delete
                        </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        });

        tableHtml += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = tableHtml;
    },

    // Search input handler
    handleSearch(type, value) {
        this.state.searchQueries[type] = value;
        this.renderTable(type);
    },

    // Delete item handler (Super Admin only)
    deleteItem(type, id) {
        if (this.isManager()) {
            if (window.showToast) {
                window.showToast("⛔ Access Denied: Managers are not authorized to delete items.");
            } else {
                alert("⛔ Access Denied: Managers are not authorized to delete items.");
            }
            return;
        }

        if (!confirm(`Are you sure you want to delete this ${type} item (${id})?`)) return;
        let list = this.getData(type);
        list = list.filter(item => item.id !== id);
        this.saveData(type, list);
    },

    // Edit item handler (populates respective form)
    editItem(type, id) {
        const item = this.getData(type).find(i => i.id === id);
        if (!item) return;

        this.state.editingType = type;
        this.state.editingId = id;

        // Switch to the respective tab
        this.switchTab(`tab-${type}`);

        // Populate form fields dynamically
        const form = document.getElementById(`form_${type}`);
        if (!form) return;

        form.querySelectorAll("input, select, textarea").forEach(field => {
            const name = field.getAttribute("name");
            if (name && item[name] !== undefined) {
                if (Array.isArray(item[name])) {
                    field.value = item[name].join("\n");
                } else if (typeof item[name] === "boolean") {
                    field.checked = item[name];
                } else {
                    field.value = item[name];
                }
            }
        });

        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.textContent = `💾 Update ${Admin.singularLabel(type) || type}`;
        }

        const cancelBtn = document.getElementById(`cancelEditBtn_${type}`);
        if (cancelBtn) cancelBtn.style.display = "inline-block";

        window.scrollTo({ top: form.offsetTop - 80, behavior: "smooth" });
    },

    cancelEdit(type) {
        this.state.editingType = null;
        this.state.editingId = null;

        const form = document.getElementById(`form_${type}`);
        if (form) {
            form.reset();
            const submitBtn = form.querySelector("button[type='submit']");
            if (submitBtn) submitBtn.textContent = `➕ Add ${Admin.singularLabel(type) || type}`;
        }

        const cancelBtn = document.getElementById(`cancelEditBtn_${type}`);
        if (cancelBtn) cancelBtn.style.display = "none";
    },

    // Form submit handler
    handleFormSubmit(type, event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {};

        formData.forEach((val, key) => {
            if (key === "features" || key === "tags" || key === "steps" || key === "includes" || key === "capabilities") {
                data[key] = val.split("\n").map(s => s.trim()).filter(Boolean);
            } else if (key === "rating") {
                data[key] = parseFloat(val) || 4.8;
            } else if (key === "featured" || key === "official" || key === "locked") {
                data[key] = true;
            } else {
                data[key] = val;
            }
        });

        // Set default fields if missing
        if (!data.id) {
            const title = data.name || data.title || "item";
            data.id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-4);
        }

        // Automatic Author & Role Attribution
        const currentUser = this.getCurrentUser();
        if (this.isManager()) {
            const managerName = (currentUser && currentUser.name) ? currentUser.name : "Manager";
            data.author = managerName;
            data.authorName = managerName;
            data.authorRole = "manager";
            data.postedBy = managerName;
        } else {
            data.author = "Admin";
            data.authorName = "Admin";
            data.authorRole = "admin";
            data.postedBy = "Admin";
        }

        let list = [...this.getData(type)];
        if (this.state.editingType === type && this.state.editingId) {
            const index = list.findIndex(i => i.id === this.state.editingId);
            if (index > -1) {
                list[index] = { ...list[index], ...data, id: this.state.editingId };
            } else {
                list.unshift(data);
            }
        } else {
            list.unshift(data);
        }

        this.saveData(type, list);
        this.cancelEdit(type);
        this.renderTable(type);
    },

    // Download dataset as ready-to-commit .js file
    downloadDataFile(type) {
        const propMap = {
            extensions: { name: "extensions.js", var: "EXTENSIONS_DATA" },
            software: { name: "software.js", var: "SOFTWARE_DATA" },
            prompts: { name: "prompts.js", var: "PROMPTS_DATA" },
            tools: { name: "tools.js", var: "TOOLS_DATA" },
            resources: { name: "resources.js", var: "RESOURCES_DATA" },
            blog: { name: "blog.js", var: "BLOG_DATA" },
            tutorials: { name: "tutorials.js", var: "TUTORIALS_DATA" }
        };

        const target = propMap[type];
        if (!target) return;

        const data = this.getData(type);
        const jsContent = `/**\n * EarnifyX Lab - ${target.var}\n * Generated from Admin Dashboard\n */\nconst ${target.var} = ${JSON.stringify(data, null, 4)};\n\nif (typeof window !== "undefined") {\n    try {\n        const saved = localStorage.getItem("earnifyx_data_${type}");\n        window.${target.var} = saved ? JSON.parse(saved) : ${target.var};\n    } catch (e) {\n        window.${target.var} = ${target.var};\n    }\n}\n`;

        const blob = new Blob([jsContent], { type: "application/javascript" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = target.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.showToast) {
            window.showToast(`📥 Downloaded ${target.name}! Replace it in data/${target.name}.`);
        }
    },

    // Export entire database backup JSON
    exportAllBackupJSON() {
        const fullBackup = {
            extensions: this.getData("extensions"),
            software: this.getData("software"),
            prompts: this.getData("prompts"),
            tools: this.getData("tools"),
            resources: this.getData("resources"),
            blog: this.getData("blog"),
            tutorials: this.getData("tutorials"),
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `earnifyx-data-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.showToast) {
            window.showToast(`📦 Exported complete site backup JSON!`);
        }
    },

    // Reset dataset to default
    resetToDefault(type) {
        if (!confirm(`Are you sure you want to reset ${type} back to default original data? Local customizations will be cleared.`)) return;
        localStorage.removeItem(`earnifyx_data_${type}`);
        window.location.reload();
    }
};

window.Admin = Admin;

document.addEventListener("DOMContentLoaded", () => {
    Admin.init();
});
