(function () {
    try {
        var savedTheme = localStorage.getItem("life_audit_theme");
        if (savedTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
        }
    } catch (error) {
        // Keep light mode as the safe fallback if storage is unavailable.
    }
})();
