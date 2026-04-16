(() => {
    const openBtn = document.getElementById("openEditProfileBtn");
    const closeBtn = document.getElementById("closeEditProfileBtn");
    const editPanel = document.getElementById("editProfilePanel");

    if (!openBtn || !editPanel) {
        return;
    }

    openBtn.addEventListener("click", () => {
        editPanel.classList.remove("hidden");
        editPanel.setAttribute("aria-hidden", "false");
        editPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            editPanel.classList.add("hidden");
            editPanel.setAttribute("aria-hidden", "true");
        });
    }
})();
