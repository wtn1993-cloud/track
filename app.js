"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("taskContainer");
  const submitBtn = document.querySelector(".taskCounterSubmit");
  const clearBtn = document.getElementById("clearLocalStorage");

  // Initialize tasks in localStorage if not already set
  const existingTasks = taskContainer.querySelectorAll(".taskCounter");
  existingTasks.forEach((task) => {
    const name = task.textContent.trim();
    if (!localStorage.getItem(name)) {
      localStorage.setItem(name, 0);
    }
  });

  // Initial render
  displayTaskCounters();
  displayTaskTimestamps();

  // Task click handling
  taskContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("taskCounter")) {
      e.target.classList.toggle("selected");
    }
  });

  // Submit button handling
  submitBtn.addEventListener("click", () => {
    const selectedTasks = document.querySelectorAll(".taskCounter.selected");

    selectedTasks.forEach((task) => {
      const name = task.textContent.trim();

      // Increment counter
      let count = parseInt(localStorage.getItem(name)) || 0;
      localStorage.setItem(name, count + 1);

      // Add timestamp
      const now = new Date().toISOString();
      const key = name + "_timestamps";
      const timestamps = JSON.parse(localStorage.getItem(key)) || [];
      timestamps.push(now);
      localStorage.setItem(key, JSON.stringify(timestamps));
    });

    // Re-render displays
    displayTaskCounters();
    displayTaskTimestamps();

    // Deselect tasks
    selectedTasks.forEach((task) => task.classList.remove("selected"));
  });

  // Clear localStorage handling
  clearBtn.addEventListener("click", () => {
    Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
    displayTaskCounters();
    displayTaskTimestamps();
  });
});

// ===== Display Task Counters =====
function displayTaskCounters() {
  const display = document.getElementById("taskDisplay");
  display.innerHTML = ""; // clear old display

  const tasks = document.querySelectorAll(".taskCounter");

  const icons = {
    5: "🔥",
    10: "💥",
    15: "⚡",
    20: "🌟",
    25: "🚀",
    30: "🏆",
    35: "🧨",
    40: "🔱",
    45: "🐉",
    50: "👑",
    55: "💎",
    60: "🦾",
    65: "🌈",
    70: "🪩",
    75: "🎯",
    80: "🎉",
    85: "🌞",
    90: "🪄",
    95: "⭐",
    100: "🔮"
  };

  tasks.forEach((task) => {
    const name = task.textContent.trim();
    const count = parseInt(localStorage.getItem(name)) || 0;

    const row = document.createElement("div");
    row.className = "task-counter-row";

    const label = document.createElement("span");
    label.textContent = `${name}: ${count}`;
    row.appendChild(label);

    const milestone = Math.floor(count / 5) * 5;
    if (icons[milestone]) {
      const icon = document.createElement("span");
      icon.className = "fire-icon";
      icon.textContent = icons[milestone];
      row.appendChild(icon);
    }

    display.appendChild(row);
  });
}

// ===== Display Task Timestamps =====
function displayTaskTimestamps() {
  const tsContainer = document.getElementById("taskTimestampsContainer");

  // Clear previous timestamps
  tsContainer.innerHTML = "<h3>Task Submission Times:</h3>";

  Object.keys(localStorage).forEach((key) => {
    if (!key.endsWith("_timestamps")) return;

    const taskName = key.replace("_timestamps", "");
    const timestamps = JSON.parse(localStorage.getItem(key)) || [];
    if (timestamps.length === 0) return;

    const taskDiv = document.createElement("div");
    taskDiv.className = "task-timestamp-row";

    const label = document.createElement("strong");
    label.textContent = taskName + ":";
    taskDiv.appendChild(label);

    timestamps.forEach((ts) => {
      const tsEl = document.createElement("div");
      tsEl.textContent = new Date(ts).toLocaleString();
      taskDiv.appendChild(tsEl);
    });

    tsContainer.appendChild(taskDiv);
  });
}


// Get stored start date from localStorage or set a default
let sobrietyStart = localStorage.getItem("sobrietyStart")
  ? new Date(localStorage.getItem("sobrietyStart"))
  : new Date(2025, 0, 1, 0, 0, 0); // default start date

function updateSobriety() {
  const now = new Date();
  let diff = now - sobrietyStart; // difference in milliseconds

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  const tracker = document.getElementById("sobrietyTracker");
  tracker.textContent = `Congrats! You have ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds of sobriety.`;
}

// Update every second
updateSobriety();
setInterval(updateSobriety, 1000);

// Reset button
document.getElementById("resetSobriety").addEventListener("click", () => {
  const newDate = prompt("Enter your new sobriety start date (YYYY-MM-DD HH:MM:SS):");
  if (!newDate) return;

  const parsedDate = new Date(newDate);
  if (isNaN(parsedDate)) {
    alert("Invalid date format!");
    return;
  }

  sobrietyStart = parsedDate;
  localStorage.setItem("sobrietyStart", sobrietyStart.toISOString());
  updateSobriety();
});

