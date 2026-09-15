(function () {
    const page = document.querySelector(".suggestions-page");
    const loading = document.getElementById("aiSuggestionLoading");
    const output = document.getElementById("aiSuggestionText");

    if (!page || !loading || !output) {
        return;
    }

    const aiUrl = page.dataset.suggestionsAiUrl;
    if (aiUrl) {
        fetch(aiUrl, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(async (response) => {
                const contentType = response.headers.get("content-type") || "";
                const rawBody = await response.text();

                let data = null;
                if (contentType.includes("application/json")) {
                    try {
                        data = JSON.parse(rawBody);
                    } catch (error) {
                        throw new Error("The suggestions service returned invalid JSON.");
                    }
                }

                if (!response.ok) {
                    if (data && data.error) {
                        throw new Error(data.error);
                    }

                    if (rawBody && !rawBody.trim().startsWith("<")) {
                        throw new Error(rawBody.trim());
                    }

                    throw new Error("Unable to load AI suggestions right now.");
                }

                if (!data) {
                    if (rawBody && !rawBody.trim().startsWith("<")) {
                        data = { suggestion_text: rawBody.trim() };
                    } else {
                        data = { suggestion_text: "No AI suggestions available right now." };
                    }
                }

                return data;
            })
            .then((data) => {
                output.textContent = data.suggestion_text || "No AI suggestions available.";
            })
            .catch((error) => {
                output.textContent = error.message;
            })
            .finally(() => {
                loading.classList.add("hidden");
                output.classList.remove("hidden");
            });
    }

    const dailyReportBtn = document.getElementById("dailyReportBtn");
    const weeklyReportBtn = document.getElementById("weeklyReportBtn");
    const dailyReportCard = document.getElementById("dailyReportCard");
    const weeklyReportCard = document.getElementById("weeklyReportCard");

    function setReportView(view) {
        const showDaily = view === "daily";

        if (!dailyReportBtn || !weeklyReportBtn || !dailyReportCard || !weeklyReportCard) {
            return;
        }

        dailyReportBtn.classList.toggle("active", showDaily);
        dailyReportBtn.setAttribute("aria-selected", String(showDaily));
        weeklyReportBtn.classList.toggle("active", !showDaily);
        weeklyReportBtn.setAttribute("aria-selected", String(!showDaily));

        dailyReportCard.classList.toggle("hidden", !showDaily);
        dailyReportCard.setAttribute("aria-hidden", String(!showDaily));
        weeklyReportCard.classList.toggle("hidden", showDaily);
        weeklyReportCard.setAttribute("aria-hidden", String(showDaily));
    }

    if (dailyReportBtn && weeklyReportBtn && dailyReportCard && weeklyReportCard) {
        dailyReportBtn.addEventListener("click", function () {
            setReportView("daily");
        });

        weeklyReportBtn.addEventListener("click", function () {
            setReportView("weekly");
        });
    }
})();
