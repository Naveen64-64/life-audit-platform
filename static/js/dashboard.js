(function () {
    // Apply progress widths from template-provided data attributes.
    document.querySelectorAll(".stat-bar[data-progress]").forEach((bar) => {
        const rawValue = Number(bar.dataset.progress);
        if (!Number.isFinite(rawValue)) {
            bar.style.width = "0%";
            return;
        }

        const clamped = Math.max(0, Math.min(rawValue, 100));
        bar.style.width = `${clamped}%`;
    });

    const ring = document.querySelector(".progress-ring-fill[data-goals-completed][data-goals-total]");
    if (!ring) {
        return;
    }

    const completed = Number(ring.dataset.goalsCompleted);
    const total = Number(ring.dataset.goalsTotal);

    if (!Number.isFinite(completed) || !Number.isFinite(total) || total <= 0) {
        ring.style.strokeDashoffset = "283";
        return;
    }

    const ratio = Math.max(0, Math.min(completed / total, 1));
    const offset = 283 - (283 * ratio);
    ring.style.strokeDashoffset = String(offset);
})();
