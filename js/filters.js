/**
 * EarnifyX Lab - Category & Filter Controls
 * Supports instant client-side filtering by category pills, search input, and badge types.
 */

window.setupFilters = function ({ containerId, dataArray, cardGenerator, filterKey = "category" }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Re-running (e.g. after the live catalog arrives) only swaps the data and re-renders
    if (container.__filterState) {
        container.__filterState.dataArray = dataArray;
        container.__filterState.render();
        return;
    }

    let activeFilter = "All";
    let searchQuery = "";
    const state = { dataArray, render: null };
    container.__filterState = state;

    const nicheBar = document.getElementById("promptNicheFilters");
    if (nicheBar && filterKey === "niche") {
        const niches = [...new Set(state.dataArray.map(item => item.niche).filter(Boolean))].sort();
        nicheBar.innerHTML = niches.map(niche => `<button class="filter-pill" data-filter="${niche}">${niche}</button>`).join("");
    }

    function render() {
        let filtered = state.dataArray;

        // Filter by category
        if (activeFilter !== "All") {
            filtered = filtered.filter(item => {
                if (activeFilter === "Free" || activeFilter === "Premium") {
                    return item.badge === activeFilter || item.type === activeFilter || (item.pricing && item.pricing.includes(activeFilter));
                }
                if (item.category) {
                    return item.category.toLowerCase() === activeFilter.toLowerCase()
                        || (item[filterKey] && item[filterKey].toLowerCase() === activeFilter.toLowerCase());
                }
                if (item[filterKey]) return item[filterKey].toLowerCase() === activeFilter.toLowerCase();
                if (item.tags) {
                    return item.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase());
                }
                return false;
            });
        }

        // Filter by search query
        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item => {
                const title = (item.name || item.title || "").toLowerCase();
                const desc = (item.shortDescription || item.description || "").toLowerCase();
                const cat = (item.category || "").toLowerCase();
                const niche = (item.niche || "").toLowerCase();
                const model = (item.model || "").toLowerCase();
                return title.includes(q) || desc.includes(q) || cat.includes(q) || niche.includes(q) || model.includes(q);
            });
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
                    <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">No matching items found</h3>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">Try adjusting your filter or search keywords</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(cardGenerator).join("");
    }

    // Connect Filter Pills
    const pills = document.querySelectorAll(".filter-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeFilter = pill.getAttribute("data-filter") || "All";
            render();
        });
    });

    // Connect local page search input if present
    const localSearch = document.getElementById("pageSearchInput");
    if (localSearch) {
        localSearch.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            render();
        });
    }

    state.render = render;

    // Initial render
    render();
};
