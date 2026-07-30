// Passages stored directly in JavaScript
const passages = {
  easy: [
    "Typing tests help improve speed.",
    "Practice typing daily."
  ],
  medium: [
    "Developers benefit from faster typing skills.",
    "Accuracy matters as much as speed."
  ],
  hard: [
    "The archaeological expedition unearthed artifacts that complicated prevailing theories.",
    "Globalization isn't as modern as we assume."
  ]
};

let currentPassage = "";
let index = 0;

// Start button
document.getElementById("startBtn").addEventListener("click", startTest);

function startTest() {
  resetTest();
  loadPassage();
  enableTyping();
}

function resetTest() {
  index = 0;
  document.getElementById("wpm").textContent = 0;
  document.getElementById("accuracy").textContent = "100%";
  document.getElementById("time").textContent = "0:00";
}

function loadPassage() {
  const difficulty = document.getElementById("difficulty").value;
  const list = passages[difficulty];
  currentPassage = list[Math.floor(Math.random() * list.length)];

  const passageEl = document.getElementById("passage");
  passageEl.innerHTML = "";

  currentPassage.split("").forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    passageEl.appendChild(span);
  });
}

function enableTyping() {
  const passageEl = document.getElementById("passage");
  passageEl.setAttribute("contenteditable", "true");
  passageEl.focus();

  passageEl.addEventListener("keydown", handleTyping);
}

function handleTyping(e) {
  // Placeholder: You will implement typing logic here
  console.log("Key pressed:", e.key);
}
