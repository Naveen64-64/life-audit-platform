(function () {
    const goalDataEl = document.getElementById("goal-data");
    const goalAlarmAudio = document.getElementById("goalAlarmAudio");
    const goalAlarmModal = document.getElementById("goalAlarmModal");
    const goalAlarmText = document.getElementById("goalAlarmText");
    const stopGoalAlarmBtn = document.getElementById("stopGoalAlarmBtn");

    if (!goalDataEl || !goalAlarmAudio || !goalAlarmModal || !goalAlarmText || !stopGoalAlarmBtn) {
        return;
    }

    const goalData = JSON.parse(goalDataEl.textContent || "[]");
    let goalAudioEnabled = true;
    let audioContext = null;
    const triggerStoreKey = "goal_reminder_last_triggered";
    const lastTriggeredByGoal = JSON.parse(localStorage.getItem(triggerStoreKey) || "{}");

    function playFallbackBeep() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            const duration = 0.35;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        } catch (err) {
            console.log("Fallback reminder sound could not play.", err);
        }
    }

    function playGoalSound() {
        if (!goalAudioEnabled) {
            return;
        }

        goalAlarmAudio.play().catch(() => {
            playFallbackBeep();
        });
    }

    function getCurrentTimeString() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    function getTodayDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function checkGoalReminders() {
        const currentTime = getCurrentTimeString();
        const todayDate = getTodayDateString();

        goalData.forEach((goal) => {
            if (!goal.reminder_time) {
                return;
            }

            if (goal.status === "Completed") {
                return;
            }

            const reminderTime = String(goal.reminder_time).slice(0, 5);
            const reminderKey = `${goal.id}-${reminderTime}`;
            const alreadyTriggeredToday = lastTriggeredByGoal[reminderKey] === todayDate;

            if (reminderTime === currentTime && !alreadyTriggeredToday) {
                lastTriggeredByGoal[reminderKey] = todayDate;
                localStorage.setItem(triggerStoreKey, JSON.stringify(lastTriggeredByGoal));

                goalAlarmText.textContent = goal.reminder_message
                    ? `${goal.title} - ${goal.reminder_message}`
                    : `It is time for your goal: ${goal.title}`;

                goalAlarmModal.style.display = "flex";
                playGoalSound();
            }
        });
    }

    stopGoalAlarmBtn.addEventListener("click", () => {
        goalAlarmAudio.pause();
        goalAlarmAudio.currentTime = 0;
        goalAlarmModal.style.display = "none";
    });

    setInterval(checkGoalReminders, 10000);
    checkGoalReminders();
})();
