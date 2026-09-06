/**
 * EarnifyX Lab - Global Search Engine
 * Searches across Tools, Extensions, Software, Prompts, Resources, Blog, and Tutorials.
 */

const GlobalSearch = {
    getAllData() {
        const all = [];

        if (window.EXTENSIONS_DATA) {
            window.EXTENSIONS_DATA.forEach(item => {
                all.push({
                    type: "Extension",
                    typeBadge: "primary",
                    id: item.id,
                    title: item.name,
                    description: item.shortDescription,
                    category: item.category,
                    icon: item.iconText || "🧩",
                    url: "extensions.html"
                });
            });
        }

        if (window.SOFTWARE_DATA) {
            window.SOFTWARE_DATA.forEach(item => {
                all.push({
                    type: "Software",
                    typeBadge: "warning",
                    id: item.id,
                    title: item.name,
                    description: item.shortDescription,
                    category: item.platform,
                    icon: item.iconText || "💻",
                    url: "software.html"
                });
            });
        }

        if (window.PROMPTS_DATA) {
            window.PROMPTS_DATA.forEach(item => {
                all.push({
                    type: "Prompt",
                    typeBadge: "success",
                    id: item.id,
                    title: item.title,
                    description: item.shortDescription,
                    category: item.category,
                    icon: item.icon || "🧠",
                    url: "prompts.html"
                });
            });
        }

        if (window.TOOLS_DATA) {
            window.TOOLS_DATA.forEach(item => {
                all.push({
                    type: "AI Tool",
                    typeBadge: "purple",
                    id: item.id,
                    title: item.name,
                    description: item.shortDescription,
                    category: item.category,
                    icon: item.iconText || "🤖",
                    url: "ai-tools.html"
                });
            });
        }

        if (window.RESOURCES_DATA) {
            window.RESOURCES_DATA.forEach(item => {
                all.push({
                    type: "Resource",
                    typeBadge: "primary",
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    icon: item.icon || "📦",
                    url: "resources.html"
                });
            });
        }

        if (window.BLOG_DATA) {
            window.BLOG_DATA.forEach(item => {
                all.push({
                    type: "Blog Post",
                    typeBadge: "primary",
                    id: item.id,
                    title: item.title,
                    description: item.shortDescription,
                    category: item.category,
                    icon: "📝",
                    url: "blog.html"
                });
            });
        }

        if (window.TUTORIALS_DATA) {
            window.TUTORIALS_DATA.forEach(item => {
                all.push({
                    type: "Tutorial",
                    typeBadge: "purple",
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    icon: "📚",
                    url: "tutorials.html"
                });
            });
        }

        return all;
    },

    query(text) {
        if (!text || text.trim() === "") return [];
        const q = text.toLowerCase().trim();
        const data = this.getAllData();

        return data.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(q);
            const descMatch = (item.description || "").toLowerCase().includes(q);
            const catMatch = (item.category || "").toLowerCase().includes(q);
            const typeMatch = item.type.toLowerCase().includes(q);
            return titleMatch || descMatch || catMatch || typeMatch;
        });
    }
};

window.GlobalSearch = GlobalSearch;

// Global input listener
document.addEventListener("DOMContentLoaded", () => {
    const headerSearchInputs = document.querySelectorAll(".global-search-input");

    headerSearchInputs.forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && input.value.trim() !== "") {
                window.location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`;
            }
        });
    });

    // Keyboard shortcut (Ctrl + K or Cmd + K)
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            const firstSearch = document.querySelector(".global-search-input");
            if (firstSearch) {
                firstSearch.focus();
                firstSearch.select();
            } else {
                window.location.href = "search.html";
            }
        }
    });
});
