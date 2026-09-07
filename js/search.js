/**
 * EarnifyX Lab - Spotlight Command Palette & Global Search Engine
 * Ultra-responsive search across Extensions, Software, AI Prompts, AI Tools, Resources, Blog, and Tutorials.
 */

const SpotlightSearch = {
    state: {
        isOpen: false,
        activeCategory: "all",
        query: "",
        selectedIndex: -1,
        results: [],
        recentSearches: []
    },

    trendingTags: [
        { label: "ChatGPT Master Prompts", query: "ChatGPT", icon: "🧠" },
        { label: "YouTube Tags Generator", query: "YouTube", icon: "🎬" },
        { label: "AdBlocker Ultra", query: "AdBlocker", icon: "🛡️" },
        { label: "Cursor AI Setup", query: "Cursor", icon: "🤖" },
        { label: "Midjourney Prompts", query: "Midjourney", icon: "🎨" },
        { label: "Video Downloader", query: "Video", icon: "⬇️" },
        { label: "SEO Analyzer", query: "SEO", icon: "📈" }
    ],

    init() {
        this.ensureDataLoaded();
        this.loadRecentSearches();
        this.injectModalHTML();
        this.bindEvents();
    },

    ensureDataLoaded() {
        const dataFiles = [
            { prop: "EXTENSIONS_DATA", src: "data/extensions.js" },
            { prop: "SOFTWARE_DATA", src: "data/software.js" },
            { prop: "PROMPTS_DATA", src: "data/prompts.js" },
            { prop: "TOOLS_DATA", src: "data/tools.js" },
            { prop: "RESOURCES_DATA", src: "data/resources.js" },
            { prop: "BLOG_DATA", src: "data/blog.js" },
            { prop: "TUTORIALS_DATA", src: "data/tutorials.js" }
        ];

        dataFiles.forEach(item => {
            if (!window[item.prop]) {
                const s = document.createElement("script");
                s.src = item.src;
                s.onload = () => {
                    if (this.state.isOpen) this.render();
                };
                document.head.appendChild(s);
            }
        });
    },

    loadRecentSearches() {
        try {
            const raw = localStorage.getItem("earnifyx_recent_searches");
            this.state.recentSearches = raw ? JSON.parse(raw) : ["ChatGPT", "YouTube", "AdBlocker"];
        } catch (e) {
            this.state.recentSearches = ["ChatGPT", "YouTube", "AdBlocker"];
        }
    },

    saveRecentSearch(query) {
        if (!query || query.trim().length < 2) return;
        const clean = query.trim();
        let list = this.state.recentSearches.filter(q => q.toLowerCase() !== clean.toLowerCase());
        list.unshift(clean);
        if (list.length > 6) list = list.slice(0, 6);
        this.state.recentSearches = list;
        try {
            localStorage.setItem("earnifyx_recent_searches", JSON.stringify(list));
        } catch (e) {}
    },

    clearRecentSearches() {
        this.state.recentSearches = [];
        try {
            localStorage.removeItem("earnifyx_recent_searches");
        } catch (e) {}
        this.render();
    },

    removeRecentSearch(query, e) {
        if (e) e.stopPropagation();
        this.state.recentSearches = this.state.recentSearches.filter(q => q !== query);
        try {
            localStorage.setItem("earnifyx_recent_searches", JSON.stringify(this.state.recentSearches));
        } catch (e) {}
        this.render();
    },

    injectModalHTML() {
        if (document.getElementById("spotlightSearchModal")) return;

        const modalDiv = document.createElement("div");
        modalDiv.id = "spotlightSearchModal";
        modalDiv.className = "spotlight-modal-overlay";
        modalDiv.innerHTML = `
            <div class="spotlight-modal-container" role="dialog" aria-modal="true" aria-label="Spotlight Global Search">
                <!-- Search Input Header -->
                <div class="spotlight-header">
                    <span class="spotlight-search-icon">🔍</span>
                    <input type="text" id="spotlightSearchInput" class="spotlight-search-input" placeholder="Search extensions, prompts, software, AI tools, guides..." autocomplete="off" spellcheck="false" aria-label="Search EarnifyX Lab">
                    <button type="button" id="spotlightClearBtn" class="spotlight-clear-btn" aria-label="Clear Search Input">✕</button>
                    <button type="button" id="spotlightCloseBtn" class="spotlight-close-btn" aria-label="Close Spotlight">ESC</button>
                </div>

                <!-- Quick Category Filter Pills -->
                <div class="spotlight-categories" role="tablist" aria-label="Search category filters">
                    <button type="button" class="spotlight-cat-btn active" data-category="all">✨ All</button>
                    <button type="button" class="spotlight-cat-btn" data-category="tools">🤖 AI Tools</button>
                    <button type="button" class="spotlight-cat-btn" data-category="extensions">🧩 Extensions</button>
                    <button type="button" class="spotlight-cat-btn" data-category="software">💻 Software</button>
                    <button type="button" class="spotlight-cat-btn" data-category="prompts">🧠 Prompts</button>
                    <button type="button" class="spotlight-cat-btn" data-category="blog">📝 Blog</button>
                    <button type="button" class="spotlight-cat-btn" data-category="resources">📦 Resources</button>
                    <button type="button" class="spotlight-cat-btn" data-category="tutorials">📚 Tutorials</button>
                </div>

                <!-- Spotlight Results Body -->
                <div id="spotlightBody" class="spotlight-body">
                    <!-- Injected dynamically -->
                </div>

                <!-- Spotlight Footer -->
                <div class="spotlight-footer">
                    <div class="spotlight-shortcuts-hint">
                        <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
                        <span><kbd>↵</kbd> Select</span>
                        <span><kbd>ESC</kbd> Close</span>
                    </div>
                    <a href="search/" id="spotlightAdvancedLink" class="spotlight-advanced-link">
                        Full Search Page ↗
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    bindEvents() {
        // Trigger on any header search click or input click
        document.addEventListener("click", (e) => {
            const headerSearch = e.target.closest(".header-search");
            const globalInput = e.target.closest(".global-search-input");
            if (headerSearch || globalInput) {
                e.preventDefault();
                this.open(globalInput ? globalInput.value : "");
            }
        });

        // Global Keyboard Shortcut (Ctrl+K, Cmd+K, or Slash '/')
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                this.toggle();
            } else if (e.key === "Escape" && this.state.isOpen) {
                e.preventDefault();
                this.close();
            } else if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
                e.preventDefault();
                this.open();
            }
        });

        const modal = document.getElementById("spotlightSearchModal");
        if (!modal) return;

        // Overlay outside click
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        // Close and Clear button handlers
        const closeBtn = document.getElementById("spotlightCloseBtn");
        if (closeBtn) closeBtn.addEventListener("click", () => this.close());

        const clearBtn = document.getElementById("spotlightClearBtn");
        const searchInput = document.getElementById("spotlightSearchInput");

        if (clearBtn && searchInput) {
            clearBtn.addEventListener("click", () => {
                searchInput.value = "";
                this.state.query = "";
                clearBtn.classList.remove("visible");
                searchInput.focus();
                this.render();
            });
        }

        // Live input typing handler
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.state.query = e.target.value;
                if (clearBtn) {
                    if (this.state.query.length > 0) clearBtn.classList.add("visible");
                    else clearBtn.classList.remove("visible");
                }
                this.state.selectedIndex = -1;
                this.render();
            });

            // Keyboard navigation inside input (Up, Down, Enter)
            searchInput.addEventListener("keydown", (e) => {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    this.navigateResults(1);
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    this.navigateResults(-1);
                } else if (e.key === "Enter") {
                    e.preventDefault();
                    this.executeActiveItem();
                }
            });
        }

        // Category tab filter clicks
        const categoryBtns = modal.querySelectorAll(".spotlight-cat-btn");
        categoryBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                categoryBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.state.activeCategory = btn.getAttribute("data-category") || "all";
                this.state.selectedIndex = -1;
                this.render();
            });
        });
    },

    open(initialQuery = "") {
        this.ensureDataLoaded();
        this.injectModalHTML();
        const modal = document.getElementById("spotlightSearchModal");
        const searchInput = document.getElementById("spotlightSearchInput");
        const clearBtn = document.getElementById("spotlightClearBtn");

        if (!modal) return;

        this.state.isOpen = true;
        this.state.query = initialQuery || "";
        this.state.selectedIndex = -1;

        if (searchInput) {
            searchInput.value = this.state.query;
            if (clearBtn) {
                if (this.state.query) clearBtn.classList.add("visible");
                else clearBtn.classList.remove("visible");
            }
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden";

        this.render();

        setTimeout(() => {
            if (searchInput) {
                searchInput.focus();
                if (this.state.query) searchInput.select();
            }
        }, 50);
    },

    close() {
        const modal = document.getElementById("spotlightSearchModal");
        if (modal) {
            modal.classList.remove("active");
        }
        this.state.isOpen = false;
        document.body.style.overflow = "";
    },

    toggle() {
        if (this.state.isOpen) this.close();
        else this.open();
    },

    getAllData() {
        const all = [];

        // Extensions
        if (window.EXTENSIONS_DATA) {
            window.EXTENSIONS_DATA.forEach(item => {
                all.push({
                    type: "Extension",
                    categoryGroup: "extensions",
                    id: item.id,
                    title: item.name,
                    description: item.shortDescription || item.description,
                    category: item.category,
                    icon: item.iconText || "🧩",
                    iconBg: item.iconBg || "#EFF6FF",
                    iconColor: item.iconColor || "#2563EB",
                    badge: item.badge || item.rating ? `⭐ ${item.rating}` : "Extension",
                    action: "View Extension",
                    modalFn: () => window.openExtensionModal ? window.openExtensionModal(item.id) : window.location.href = `extensions/#${item.id}`
                });
            });
        }

        // Software
        if (window.SOFTWARE_DATA) {
            window.SOFTWARE_DATA.forEach(item => {
                all.push({
                    type: "Software",
                    categoryGroup: "software",
                    id: item.id,
                    title: item.name,
                    description: item.shortDescription || item.description,
                    category: item.platform,
                    icon: item.iconText || "💻",
                    iconBg: item.iconBg || "#FEF3C7",
                    iconColor: item.iconColor || "#D97706",
                    badge: item.platform || "Desktop",
                    action: "Download App",
                    modalFn: () => window.openSoftwareModal ? window.openSoftwareModal(item.id) : window.location.href = `software/#${item.id}`
                });
            });
        }

        // Master Prompts
        if (window.PROMPTS_DATA) {
            window.PROMPTS_DATA.forEach(item => {
                all.push({
                    type: "Prompt",
                    categoryGroup: "prompts",
                    id: item.id,
                    title: item.title,
                    description: item.shortDescription || item.prompt,
                    category: item.category,
                    icon: item.icon || "🧠",
                    iconBg: "#ECFDF5",
                    iconColor: "#059669",
                    badge: item.targetAI || item.category,
                    action: "Copy Prompt",
                    modalFn: () => window.openPromptModal ? window.openPromptModal(item.id) : window.location.href = `prompts/#${item.id}`
                });
            });
        }

        // AI Tools
        if (window.TOOLS_DATA) {
            window.TOOLS_DATA.forEach(item => {
                all.push({
                    type: "AI Tool",
                    categoryGroup: "tools",
                    id: item.id,
                    title: item.name,
                    description: item.shortDescription || item.description,
                    category: item.category,
                    icon: item.iconText || "🤖",
                    iconBg: "#FAF5FF",
                    iconColor: "#7C3AED",
                    badge: item.pricing || "Free / Freemium",
                    action: "Visit Tool",
                    modalFn: () => item.url ? window.open(item.url, "_blank") : window.location.href = `ai-tools/#${item.id}`
                });
            });
        }

        // Resources
        if (window.RESOURCES_DATA) {
            window.RESOURCES_DATA.forEach(item => {
                all.push({
                    type: "Resource",
                    categoryGroup: "resources",
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    icon: item.icon || "📦",
                    iconBg: "#EFF6FF",
                    iconColor: "#2563EB",
                    badge: item.fileType || item.type,
                    action: "Get Resource",
                    modalFn: () => window.downloadResource ? window.downloadResource(item.id, item.title, item.type) : window.location.href = `resources/#${item.id}`
                });
            });
        }

        // Blog
        if (window.BLOG_DATA) {
            window.BLOG_DATA.forEach(item => {
                all.push({
                    type: "Blog Post",
                    categoryGroup: "blog",
                    id: item.id,
                    title: item.title,
                    description: item.shortDescription || item.content,
                    category: item.category,
                    icon: "📝",
                    iconBg: "#FEF2F2",
                    iconColor: "#DC2626",
                    badge: item.readTime || "Article",
                    action: "Read Article",
                    modalFn: () => window.openBlogModal ? window.openBlogModal(item.id) : window.location.href = `blog/#${item.id}`
                });
            });
        }

        // Tutorials
        if (window.TUTORIALS_DATA) {
            window.TUTORIALS_DATA.forEach(item => {
                all.push({
                    type: "Tutorial",
                    categoryGroup: "tutorials",
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    icon: "📚",
                    iconBg: "#FAF5FF",
                    iconColor: "#9333EA",
                    badge: item.difficulty || "Guide",
                    action: "View Guide",
                    modalFn: () => window.openTutorialModal ? window.openTutorialModal(item.id) : window.location.href = `tutorials/#${item.id}`
                });
            });
        }

        return all;
    },

    search() {
        const q = this.state.query.trim().toLowerCase();
        let list = this.getAllData();

        // Filter by category
        if (this.state.activeCategory !== "all") {
            list = list.filter(item => item.categoryGroup === this.state.activeCategory);
        }

        if (!q) return [];

        return list.filter(item => {
            const title = (item.title || "").toLowerCase();
            const desc = (item.description || "").toLowerCase();
            const cat = (item.category || "").toLowerCase();
            const type = (item.type || "").toLowerCase();
            return title.includes(q) || desc.includes(q) || cat.includes(q) || type.includes(q);
        });
    },

    highlightText(text, query) {
        if (!query || !text) return text || "";
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, `<mark>$1</mark>`);
    },

    navigateResults(direction) {
        const items = document.querySelectorAll(".spotlight-result-item");
        if (!items.length) return;

        this.state.selectedIndex += direction;

        if (this.state.selectedIndex < 0) this.state.selectedIndex = items.length - 1;
        if (this.state.selectedIndex >= items.length) this.state.selectedIndex = 0;

        items.forEach((item, index) => {
            if (index === this.state.selectedIndex) {
                item.classList.add("focused");
                item.scrollIntoView({ block: "nearest", behavior: "smooth" });
            } else {
                item.classList.remove("focused");
            }
        });
    },

    executeActiveItem() {
        if (this.state.selectedIndex >= 0 && this.state.results[this.state.selectedIndex]) {
            const item = this.state.results[this.state.selectedIndex];
            this.saveRecentSearch(this.state.query || item.title);
            this.close();
            if (typeof item.modalFn === "function") item.modalFn();
        } else if (this.state.query.trim()) {
            this.saveRecentSearch(this.state.query);
            window.location.href = `search/?q=${encodeURIComponent(this.state.query.trim())}`;
        }
    },

    render() {
        const body = document.getElementById("spotlightBody");
        const advLink = document.getElementById("spotlightAdvancedLink");
        if (!body) return;

        if (advLink) {
            advLink.href = this.state.query.trim() 
                ? `search/?q=${encodeURIComponent(this.state.query.trim())}` 
                : "search/";
        }

        const q = this.state.query.trim();

        // 1. DEFAULT VIEW (When search is blank)
        if (!q) {
            this.state.results = [];
            this.state.selectedIndex = -1;

            let recentHTML = "";
            if (this.state.recentSearches.length > 0) {
                recentHTML = `
                    <div class="spotlight-section-title">
                        <span>🕒 Recent Searches</span>
                        <button type="button" class="spotlight-clear-history-btn" onclick="SpotlightSearch.clearRecentSearches()">Clear All</button>
                    </div>
                    <div class="spotlight-tag-cloud">
                        ${this.state.recentSearches.map(term => `
                            <div class="spotlight-tag-chip" onclick="SpotlightSearch.setQuery('${term.replace(/'/g, "\\'")}')">
                                <span>🕒 ${term}</span>
                                <span style="font-size: 0.7rem; opacity: 0.6; margin-left: 2px;" onclick="SpotlightSearch.removeRecentSearch('${term.replace(/'/g, "\\'")}', event)">✕</span>
                            </div>
                        `).join("")}
                    </div>
                `;
            }

            const trendingHTML = `
                <div class="spotlight-section-title">
                    <span>🔥 Trending Searches</span>
                </div>
                <div class="spotlight-tag-cloud">
                    ${this.trendingTags.map(tag => `
                        <div class="spotlight-tag-chip" onclick="SpotlightSearch.setQuery('${tag.query.replace(/'/g, "\\'")}')">
                            <span>${tag.icon}</span>
                            <span>${tag.label}</span>
                        </div>
                    `).join("")}
                </div>
            `;

            const quickNavHTML = `
                <div class="spotlight-section-title">
                    <span>⚡ Quick Navigation</span>
                </div>
                <div class="spotlight-nav-grid">
                    <a href="ai-tools/" class="spotlight-nav-card" onclick="SpotlightSearch.close()">
                        <span class="spotlight-nav-icon">🤖</span>
                        <span class="spotlight-nav-name">AI Tools</span>
                    </a>
                    <a href="extensions/" class="spotlight-nav-card" onclick="SpotlightSearch.close()">
                        <span class="spotlight-nav-icon">🧩</span>
                        <span class="spotlight-nav-name">Extensions</span>
                    </a>
                    <a href="software/" class="spotlight-nav-card" onclick="SpotlightSearch.close()">
                        <span class="spotlight-nav-icon">💻</span>
                        <span class="spotlight-nav-name">Software</span>
                    </a>
                    <a href="prompts/" class="spotlight-nav-card" onclick="SpotlightSearch.close()">
                        <span class="spotlight-nav-icon">🧠</span>
                        <span class="spotlight-nav-name">Prompts</span>
                    </a>
                </div>
            `;

            body.innerHTML = recentHTML + trendingHTML + quickNavHTML;
            return;
        }

        // 2. ACTIVE SEARCH RESULTS
        const results = this.search();
        this.state.results = results;

        if (results.length === 0) {
            body.innerHTML = `
                <div class="spotlight-empty-state">
                    <div class="spotlight-empty-icon">🔎</div>
                    <div class="spotlight-empty-title">No matching results for "${q}"</div>
                    <div class="spotlight-empty-subtitle">Try searching for keywords like "Prompt", "Chrome", "YouTube", "AI", or check other categories.</div>
                    <button class="btn btn-primary btn-sm" onclick="SpotlightSearch.setQuery('')">
                        Reset Filters & View Trending
                    </button>
                </div>
            `;
            return;
        }

        body.innerHTML = `
            <div class="spotlight-section-title">
                <span>Found ${results.length} result${results.length > 1 ? 's' : ''}</span>
                <span>Press ↵ to open</span>
            </div>
            <div class="spotlight-results-list" role="listbox">
                ${results.map((item, index) => `
                    <div class="spotlight-result-item ${index === this.state.selectedIndex ? 'focused' : ''}" 
                         role="option"
                         tabindex="0"
                         data-index="${index}"
                         onclick="SpotlightSearch.handleItemClick(${index})">
                        <div class="spotlight-result-left">
                            <div class="spotlight-result-icon" style="background-color: ${item.iconBg || 'var(--bg-surface-subtle)'}; color: ${item.iconColor || 'var(--accent-primary)'};">
                                ${item.icon}
                            </div>
                            <div class="spotlight-result-info">
                                <div class="spotlight-result-title-row">
                                    <span class="spotlight-result-title">${this.highlightText(item.title, q)}</span>
                                    <span class="badge badge-subtle" style="font-size: 0.68rem;">${item.badge}</span>
                                </div>
                                <div class="spotlight-result-desc">${this.highlightText(item.description, q)}</div>
                            </div>
                        </div>
                        <div class="spotlight-result-action">
                            <span class="spotlight-action-pill">${item.action} ↗</span>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    },

    handleItemClick(index) {
        const item = this.state.results[index];
        if (!item) return;
        this.saveRecentSearch(this.state.query || item.title);
        this.close();
        if (typeof item.modalFn === "function") {
            item.modalFn();
        }
    },

    setQuery(text) {
        this.state.query = text;
        const searchInput = document.getElementById("spotlightSearchInput");
        const clearBtn = document.getElementById("spotlightClearBtn");
        if (searchInput) {
            searchInput.value = text;
            searchInput.focus();
        }
        if (clearBtn) {
            if (text) clearBtn.classList.add("visible");
            else clearBtn.classList.remove("visible");
        }
        this.render();
    }
};

window.SpotlightSearch = SpotlightSearch;

// Compatibility API for legacy search scripts
window.GlobalSearch = {
    getAllData() { return SpotlightSearch.getAllData(); },
    query(text) {
        SpotlightSearch.state.query = text;
        return SpotlightSearch.search();
    }
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    SpotlightSearch.init();
});
