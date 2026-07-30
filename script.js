// Passages (including a longer hard essay)
const passages = [
  {
    difficulty: "easy",
    text: "The quick brown fox jumps over the lazy dog."
  },
  {
    difficulty: "medium",
    text: "Typing tests measure speed and accuracy in real time, helping users track their progress and improve their skills."
  },
  {
    difficulty: "hard",
    text:
      "The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks. " +
      "Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic—all discovered in a single Mycenaean tomb—" +
      "suggested commercial connections far more extensive than previously hypothesized. \"We’ve underestimated ancient peoples’ " +
      "navigational capabilities and their appetite for luxury goods,\" the lead researcher observed. \"Globalization isn’t as modern " +
      "as we assume.\""
  }
];

let currentPassage = "";
let timer = null;
let timeElapsed = 0; // seconds
let bestWPM = Number(localStorage.getItem("bestWPM") || 0);
let baselineSet = localStorage.getItem("baselineSet") === "true";

const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const passageEl = document.getElementById("passage");
const inputEl = document.getElementById("input");
const difficultyEl = document.getElementById("difficulty");
const modeEl = document.getElementById("mode");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");

bestEl.textContent = bestWPM;

// Helpers

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getRandomPassage(difficulty) {
  const filtered = passages.filter(p => p.difficulty === difficulty);
  const idx = Math.floor(Math.random() * filtered.length);
  return filtered[idx].text;
}

function renderPassage(text) {
  passageEl.innerHTML = text
    .split("")
    .map(ch => `<span>${ch}</span>`)
    .join("");
}

// Core

function resetStats() {
  timeElapsed = 0;
  timeEl.textContent = formatTime(0);
  wpmEl.textContent = 0;
  accuracyEl.textContent = "100%";
  resultEl.classList.add("hidden");
}

function startTest() {
  currentPassage = getRandomPassage(difficultyEl.value);
  renderPassage(currentPassage);
  inputEl.value = "";
  inputEl.focus();
  resetStats();
  clearInterval(timer);

  if (modeEl.value === "timed") {
    timer = setInterval(() => {
      timeElapsed++;
      timeEl.textContent = formatTime(timeElapsed);
      if (timeElapsed >= 60) {
        endTest();
      }
    }, 1000);
  } else {
    // passage mode: timer counts up until completion
    timer = setInterval(() => {
      timeElapsed++;
      timeEl.textContent = formatTime(timeElapsed);
    }, 1000);
  }
}

function updateStats() {
  const input = inputEl.value;
  const spans = passageEl.querySelectorAll("span");

  // Clear cursor class
  spans.forEach(span => span.classList.remove("cursor"));

  let correctChars = 0;
  const totalTyped = input.length;

  for (let i = 0; i < spans.length; i++) {
    const expected = currentPassage[i];
    const typed = input[i];

    if (typed == null) {
      spans[i].classList.remove("correct", "incorrect");
    } else if (typed === expected) {
      spans[i].classList.add("correct");
      spans[i].classList.remove("incorrect");
      correctChars++;
    } else {
      spans[i].classList.add("incorrect");
      spans[i].classList.remove("correct");
    }
  }

  // Cursor position
  const cursorIndex = Math.min(totalTyped, spans.length - 1);
  if (spans[cursorIndex]) {
    spans[cursorIndex].classList.add("cursor");
  }

  const accuracy =
    totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  const minutes = timeElapsed > 0 ? timeElapsed / 60 : 1 / 60;
  const wpm = Math.round((totalTyped / 5) / minutes);

  accuracyEl.textContent = `${accuracy}%`;
  wpmEl.textContent = wpm;

  // End in passage mode when fully typed
  if (modeEl.value === "passage" && totalTyped >= currentPassage.length) {
    endTest();
  }
}

function endTest() {
  clearInterval(timer);

  const finalWPM = Number(wpmEl.textContent);
  const finalAccuracy = accuracyEl.textContent;

  // Baseline / high score messages
  if (!baselineSet) {
    baselineSet = true;
    localStorage.setItem("baselineSet", "true");
    bestWPM = finalWPM;
    localStorage.setItem("bestWPM", bestWPM);
    bestEl.textContent = bestWPM;
    alert("Baseline Established!");
  } else if (finalWPM > bestWPM) {
    bestWPM = finalWPM;
    localStorage.setItem("bestWPM", bestWPM);
    bestEl.textContent = bestWPM;
    alert("High Score Smashed! 🎉");
  }

  resultEl.classList.remove("hidden");
  resultEl.textContent = `Final WPM: ${finalWPM} · Accuracy: ${finalAccuracy} · Time: ${formatTime(
    timeElapsed
  )}`;
}

// Events

startBtn.addEventListener("click", startTest);
restartBtn.addEventListener("click", startTest);

// Start by clicking passage or typing area
passageEl.addEventListener("click", () => {
  if (!currentPassage) startTest();
  inputEl.focus();
});

inputEl.addEventListener("focus", () => {
  if (!currentPassage) startTest();
});

inputEl.addEventListener("input", updateStats);
