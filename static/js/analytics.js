(function () {
    const dataEl = document.getElementById("analytics-data");
    if (!dataEl) {
        return;
    }

    const analyticsData = JSON.parse(dataEl.textContent);

    const labels = analyticsData.labels;
    const sleepData = analyticsData.sleepData;
    const productivityData = analyticsData.productivityData;
    const filteredTimeUsageLabels = analyticsData.filteredTimeUsageLabels;
    const filteredTimeUsageSleepData = analyticsData.filteredTimeUsageSleepData;
    const filteredTimeUsageWorkData = analyticsData.filteredTimeUsageWorkData;
    const filteredTimeUsageMobileData = analyticsData.filteredTimeUsageMobileData;
    const filteredTimeUsageExerciseData = analyticsData.filteredTimeUsageExerciseData;
    const weeklyLabels = analyticsData.weeklyLabels;
    const weeklyWorkData = analyticsData.weeklyWorkData;

    const dailyAnalyticsBtn = document.getElementById("dailyAnalyticsBtn");
    const weeklyAnalyticsBtn = document.getElementById("weeklyAnalyticsBtn");
    const dailyAnalyticsCard = document.getElementById("dailyAnalyticsCard");
    const weeklyAnalyticsCard = document.getElementById("weeklyAnalyticsCard");

    function setAnalyticsSnapshot(view) {
        const showDaily = view === "daily";

        if (!dailyAnalyticsBtn || !weeklyAnalyticsBtn || !dailyAnalyticsCard || !weeklyAnalyticsCard) {
            return;
        }

        dailyAnalyticsBtn.classList.toggle("active", showDaily);
        dailyAnalyticsBtn.setAttribute("aria-selected", String(showDaily));
        weeklyAnalyticsBtn.classList.toggle("active", !showDaily);
        weeklyAnalyticsBtn.setAttribute("aria-selected", String(!showDaily));

        dailyAnalyticsCard.classList.toggle("hidden", !showDaily);
        dailyAnalyticsCard.setAttribute("aria-hidden", String(!showDaily));
        weeklyAnalyticsCard.classList.toggle("hidden", showDaily);
        weeklyAnalyticsCard.setAttribute("aria-hidden", String(showDaily));
    }

    if (dailyAnalyticsBtn && weeklyAnalyticsBtn) {
        dailyAnalyticsBtn.addEventListener("click", function () {
            setAnalyticsSnapshot("daily");
        });

        weeklyAnalyticsBtn.addEventListener("click", function () {
            setAnalyticsSnapshot("weekly");
        });
    }

    const timeUsageCanvas = document.getElementById("timeUsageChart");
    if (timeUsageCanvas) {
        new Chart(timeUsageCanvas, {
            type: "bar",
            data: {
                labels: filteredTimeUsageLabels,
                datasets: [
                    {
                        label: "Study/Work",
                        data: filteredTimeUsageWorkData,
                        backgroundColor: "rgba(16, 185, 129, 0.75)"
                    },
                    {
                        label: "Mobile Usage",
                        data: filteredTimeUsageMobileData,
                        backgroundColor: "rgba(239, 68, 68, 0.75)"
                    },
                    {
                        label: "Sleep",
                        data: filteredTimeUsageSleepData,
                        backgroundColor: "rgba(59, 130, 246, 0.75)"
                    },
                    {
                        label: "Exercise",
                        data: filteredTimeUsageExerciseData,
                        backgroundColor: "rgba(245, 158, 11, 0.75)"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    const productivityCanvas = document.getElementById("productivityChart");
    if (productivityCanvas) {
        new Chart(productivityCanvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Productivity %",
                        data: productivityData,
                        borderColor: "rgba(37, 99, 235, 1)",
                        backgroundColor: "rgba(37, 99, 235, 0.2)",
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    const sleepCanvas = document.getElementById("sleepChart");
    if (sleepCanvas) {
        new Chart(sleepCanvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Sleep Hours",
                        data: sleepData,
                        borderColor: "rgba(139, 92, 246, 1)",
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    const weeklyCanvas = document.getElementById("weeklyChart");
    if (weeklyCanvas) {
        new Chart(weeklyCanvas, {
            type: "line",
            data: {
                labels: weeklyLabels,
                datasets: [
                    {
                        label: "Weekly Work Hours",
                        data: weeklyWorkData,
                        borderColor: "rgba(25, 211, 255, 1)",
                        backgroundColor: "rgba(25, 211, 255, 0.18)",
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
})();
