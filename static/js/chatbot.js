(function () {
    const toggleBtn = document.getElementById("chatbotToggle");
    const chatBox = document.getElementById("chatbotBox");
    const closeBtn = document.getElementById("chatClose");
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatMessages = document.getElementById("chatMessages");

    if (!toggleBtn || !chatBox || !chatForm || !userInput || !sendBtn || !chatMessages) {
        return;
    }

    function toggleChat() {
        const isHidden = chatBox.classList.toggle("hidden");

        if (!isHidden) {
            userInput.focus();
        }
    }

    function appendMessage(role, text) {
        const messageRow = document.createElement("div");
        messageRow.className = "chat-message " + (role === "user" ? "user-message" : "bot-message");

        const avatar = document.createElement("span");
        avatar.className = "msg-avatar";
        avatar.textContent = role === "user" ? "You" : "AI";

        const bubble = document.createElement("div");
        bubble.className = "msg-bubble";
        bubble.textContent = text;

        if (role === "user") {
            messageRow.appendChild(bubble);
            messageRow.appendChild(avatar);
        } else {
            messageRow.appendChild(avatar);
            messageRow.appendChild(bubble);
        }

        chatMessages.appendChild(messageRow);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) {
            return;
        }

        appendMessage("user", message);
        userInput.value = "";
        userInput.focus();
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";

        fetch("/chatbot", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        })
            .then(function (res) {
                if (!res.ok) {
                    throw new Error("Request failed with status " + res.status);
                }

                return res
                    .json()
                    .catch(function () {
                        throw new Error("Invalid server response");
                    });
            })
            .then(function (data) {
                appendMessage("bot", data.reply || "I could not generate a response. Please try again.");
            })
            .catch(function () {
                appendMessage("bot", "Unable to connect right now. Please try again in a moment.");
            })
            .finally(function () {
                sendBtn.disabled = false;
                sendBtn.textContent = "Send";
            });
    }

    toggleBtn.addEventListener("click", toggleChat);

    if (closeBtn) {
        closeBtn.addEventListener("click", toggleChat);
    }

    chatForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendMessage();
    });

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
})();
