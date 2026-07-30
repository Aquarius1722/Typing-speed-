// Embedded passage data
const passages = [
  { difficulty: "easy", text: "The quick brown fox jumps over the lazy dog." },
  { difficulty: "medium", text: "Typing tests measure speed and accuracy in real time." },
  { difficulty: "hard", text: "The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks." }
];

let currentPassage = "";
let timer, timeElapsed = 0;
let bestWPM = localStorage.getItem("bestWPM") || 0;

document.getElementById("best").textContent = `Best: ${bestWPM}`;

function getRandomPassage(difficulty) {
  const filtered = passages.filter(p => p.difficulty === difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)].text;
}

function startTest() {
  currentPassage = getRandomPassage(document.getElementById("difficulty").value);
  document.getElementById("passage").innerHTML = currentPassage.split("").map(c => `<span>${c}</span>`).join("");
  document.getElementById("input").value = "";
  timeElapsed = 0;
  clearInterval(timer);
  document.getElementById("time").textContent = "Time: 0s";
  if (document.getElementById("mode").value === "timed") {
    timer = setInterval(() => updateTime(), 1000);
  }
}

function updateTime() {
  timeElapsed++;
  document.getElementById("time").textContent = `Time: ${timeElapsed}s`;
  if (timeElapsed >= 60 && document.getElementById("mode").value === "timed") {
    endTest();
  }
}

function updateStats() {
  const input = document.getElementById("input").value;
  const spans = document.querySelectorAll("#passage span");
  let correct = 0;
  input.split("").forEach((char, i) => {
    if (char === currentPassage[i]) {
      spans[i].className = "correct";
      correct++;
    } else {
      spans[i].className = "incorrect";
    }
  });
  const accuracy = Math.round((correct / input.length) * 100) || 100;
  const wpm = Math.round((input.length / 5) / (timeElapsed / 60 || 1));
  document.getElementById("accuracy").textContent = `Accuracy: ${accuracy}%`;
  document.getElementById("wpm").textContent = `WPM: ${wpm}`;
  if (document.getElementById("mode").value === "passage" && input.length === currentPassage.length) {
    endTest();
  }
}

function endTest() {
  clearInterval(timer);
  const wpm = parseInt(document.getElementById("wpm").textContent.split(": ")[1]);
  if (bestWPM == 0) {
    alert("Baseline Established!");
    bestWPM = wpm;
    localStorage.setItem("bestWPM", bestWPM);
  } else if (wpm > bestWPM) {
    bestWPM = wpm;
    localStorage.setItem("bestWPM", bestWPM);
    alert("High Score Smashed! 🎉");
  }
  document.getElementById("best").textContent = `Best: ${bestWPM}`;
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("result").textContent = `Final WPM: ${wpm}, Accuracy: ${document.getElementById("accuracy").textContent}`;
}

document.getElementById("start").addEventListener("click", startTest);
document.getElementById("restart").addEventListener("click", startTest);
document.getElementById("input").addEventListener("input", updateStats);
