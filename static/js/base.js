(function () {
    const toasts = document.querySelectorAll(".toast");

    toasts.forEach((toast) => {
        toast.classList.add("toast-show");
        setTimeout(() => {
            toast.classList.add("toast-hide");
        }, 2000);

        setTimeout(() => {
            toast.remove();
        }, 2300);
    });
})();

(function () {
    const mobileBackBtn = document.getElementById("mobileBackBtn");

    if (!mobileBackBtn) {
        return;
    }

    mobileBackBtn.addEventListener("click", function () {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            const fallbackUrl = mobileBackBtn.dataset.fallbackUrl || "/";
            window.location.assign(fallbackUrl);
        }
    });
})();

(function () {
    const profileMenu = document.getElementById("profileMenu");
    const profileTrigger = document.getElementById("profileTrigger");
    const mobileProfileBtn = document.getElementById("mobileProfileBtn");
    const navMenuToggle = document.getElementById("navMenuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const profileDropdown = document.getElementById("profileDropdown");

    if (!profileMenu || !profileTrigger || !profileDropdown) {
        return;
    }

    function closeProfileMenu() {
        profileDropdown.classList.add("hidden");
        profileTrigger.setAttribute("aria-expanded", "false");
        if (mobileProfileBtn) {
            mobileProfileBtn.setAttribute("aria-expanded", "false");
        }
    }

    function closeMobileMenu() {
        if (!mobileMenu || !navMenuToggle) {
            return;
        }

        mobileMenu.classList.remove("open");
        mobileMenu.setAttribute("aria-hidden", "true");
        navMenuToggle.setAttribute("aria-expanded", "false");
    }

    function toggleProfileMenu() {
        const isHidden = profileDropdown.classList.contains("hidden");
        profileDropdown.classList.toggle("hidden", !isHidden);
        profileTrigger.setAttribute("aria-expanded", String(isHidden));
    }

    profileTrigger.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleProfileMenu();
    });

    if (mobileProfileBtn) {
        mobileProfileBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleProfileMenu();
            mobileProfileBtn.setAttribute("aria-expanded", String(!profileDropdown.classList.contains("hidden")));
        });
    }

    if (navMenuToggle && mobileMenu) {
        navMenuToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            const willOpen = !mobileMenu.classList.contains("open");
            mobileMenu.classList.toggle("open", willOpen);
            mobileMenu.setAttribute("aria-hidden", String(!willOpen));
            navMenuToggle.setAttribute("aria-expanded", String(willOpen));
        });

        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });
    }

    profileDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        closeProfileMenu();
        closeMobileMenu();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeProfileMenu();
            closeMobileMenu();
        }
    });
})();

(function () {
    const loader = document.getElementById("pageLoader");
    if (!loader) {
        return;
    }

    const minVisibleTime = 100;
    const startTime = performance.now();
    let isHidden = false;

    function showLoader() {
        loader.classList.remove("page-loader-hidden");
    }

    function hideLoader() {
        if (isHidden) {
            return;
        }

        isHidden = true;
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(minVisibleTime - elapsed, 0);

        setTimeout(() => {
            loader.classList.add("page-loader-hidden");
            setTimeout(() => loader.remove(), 260);
        }, remaining);
    }

    document.querySelectorAll(".navbar a[href]").forEach((link) => {
        const href = link.getAttribute("href") || "";

        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
            return;
        }

        link.addEventListener("click", () => {
            showLoader();
        });
    });

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader, { once: true });
    }
})();

(function () {
    const storageKey = "life_audit_theme";
    const root = document.documentElement;

    function applyTheme(theme) {
        const nextTheme = theme === "dark" ? "dark" : "light";
        root.setAttribute("data-theme", nextTheme);

        const toggleSwitch = document.getElementById("themeToggleSwitch");
        const currentLabel = document.getElementById("themeCurrentLabel");
        const isDark = nextTheme === "dark";

        if (toggleSwitch) {
            toggleSwitch.classList.toggle("is-active", isDark);
            toggleSwitch.setAttribute("aria-checked", String(isDark));
        }

        if (currentLabel) {
            currentLabel.textContent = isDark ? "Dark" : "Light";
        }
    }

    let savedTheme = "light";
    try {
        savedTheme = localStorage.getItem(storageKey) || (root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    } catch (error) {
        savedTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    applyTheme(savedTheme);

    document.addEventListener("click", function (event) {
        const targetSwitch = event.target.closest("#themeToggleSwitch");
        if (!targetSwitch) {
            return;
        }

        const currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);

        try {
            localStorage.setItem(storageKey, nextTheme);
        } catch (error) {
            // Ignore storage failures; theme still works for current page.
        }
    });
})();
