/**
 * EarnifyX Lab - Theme Manager (Light / Dark Mode)
 * Uses localStorage to persist user selection. Light theme is default.
 */
(function () {
    const THEME_KEY = "earnifyx_theme";
    const currentTheme = localStorage.getItem(THEME_KEY) || "light";

    // Set theme immediately to avoid flash of wrong theme
    document.documentElement.setAttribute("data-theme", currentTheme);

    function updateThemeIcon(theme) {
        const themeIcons = document.querySelectorAll(".theme-toggle-icon");
        themeIcons.forEach(icon => {
            icon.textContent = theme === "dark" ? "☀️" : "🌙";
        });
    }

    window.toggleTheme = function () {
        const activeTheme = document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = activeTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        updateThemeIcon(newTheme);

        if (window.showToast) {
            window.showToast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode`);
        }
    };

    // Also called by main.js after it injects a header into pages that ship without one
    window.initThemeToggle = function () {
        const activeTheme = document.documentElement.getAttribute("data-theme") || "light";
        updateThemeIcon(activeTheme);

        document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
            if (btn.dataset.themeBound) return;
            btn.dataset.themeBound = "true";
            btn.addEventListener("click", window.toggleTheme);
        });
    };

    document.addEventListener("DOMContentLoaded", window.initThemeToggle);
})();
