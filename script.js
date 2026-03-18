const API_KEY = "AIzaSyDmrhsK-Ydapre6ja1lvHdXPg1cVxgFlU4";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userInput = document.getElementById("userInput");
const sendBtn   = document.getElementById("sendBtn");
const messages  = document.querySelector(".messages");

function addMessage(text, sender) {
  const msg    = document.createElement("div");
  msg.classList.add("msg", sender);

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerText = text;

  msg.appendChild(bubble);
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessageToAI(userMessage) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts
        .map(part => part.text)
        .join("");
    } else if (data.error) {
      return "⚠️ " + data.error.message;
    } else {
      return "⚠️ No response from AI.";
    }

  } catch (error) {
    console.error(error);
    return "⚠️ Error connecting to AI.";
  }
}

async function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  const reply = await sendMessageToAI(text);
  addMessage(reply, "ai");
}

sendBtn.addEventListener("click", handleSend);

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSend();
  }
});