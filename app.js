"use strict";

/* ---------------------------
   Main app: task tracker + sobriety tracker
   Replace your current app.js with this file.
   --------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  // Task elements
  const taskContainer = document.getElementById("taskContainer");
  const submitBtn = document.querySelector(".taskCounterSubmit");
  const clearBtn = document.getElementById("clearLocalStorage");

  // Sobriety elements (ensure these exist in your HTML)
  const sobrietyTrackerEl = document.getElementById("sobrietyTracker");
  const resetSobrietyBtn = document.getElementById("resetSobriety");

  // Initialize tasks in localStorage if not already set
  const existingTasks = taskContainer ? taskContainer.querySelectorAll(".taskCounter") : [];
  existingTasks.forEach((task) => {
    const name = task.textContent.trim();
    if (!localStorage.getItem(name)) {
      localStorage.setItem(name, "0");
    }
  });

  // Initial render
  displayTaskCounters();
  displayTaskTimestamps();
  updateSobriety(); // set initial sobriety text

  // TASK: click selection (delegation)
  if (taskContainer) {
    taskContainer.addEventListener("click", (e) => {
      if (e.target.classList && e.target.classList.contains("taskCounter")) {
        e.target.classList.toggle("selected");
      }
    });
  }

  // SUBMIT: increment counts + save timestamps
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const selectedTasks = document.querySelectorAll(".taskCounter.selected");

      selectedTasks.forEach((task) => {
        const name = task.textContent.trim();

        // Increment counter
        const count = parseInt(localStorage.getItem(name) || "0", 10) || 0;
        localStorage.setItem(name, String(count + 1));

        // Add timestamp
        const now = new Date().toISOString();
        const key = name + "_timestamps";
        const timestamps = JSON.parse(localStorage.getItem(key) || "[]");
        timestamps.push(now);
        localStorage.setItem(key, JSON.stringify(timestamps));
      });

      displayTaskCounters();
      displayTaskTimestamps();

      // Deselect
      selectedTasks.forEach((task) => task.classList.remove("selected"));
    });
  }

  // CLEAR: clear all localStorage (same behavior as before)
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
      displayTaskCounters();
      displayTaskTimestamps();
      // Also reset sobriety to now (optional behavior — keeps tracker consistent)
      // If you don't want that, remove the next two lines.
      sobrietyStart = new Date();
      localStorage.setItem("sobrietyStart", sobrietyStart.toISOString());
      updateSobriety();
    });
  }

  // Sobriety Reset button: set sobriety start to now
  if (resetSobrietyBtn) {
    resetSobrietyBtn.addEventListener("click", () => {
      sobrietyStart = new Date();
      localStorage.setItem("sobrietyStart", sobrietyStart.toISOString());
      updateSobriety();
    });
  }
});

/* ============================
   Display functions
   ============================ */

function displayTaskCounters() {
  const display = document.getElementById("taskDisplay");
  if (!display) return;
  display.innerHTML = "";

  const tasks = document.querySelectorAll(".taskCounter");
  const icons = {
    5: "🔥", 10: "💥", 15: "⚡", 20: "🌟", 25: "🚀",
    30: "🏆", 35: "🧨", 40: "🔱", 45: "🐉", 50: "👑",
    55: "💎", 60: "🦾", 65: "🌈", 70: "🪩", 75: "🎯",
    80: "🎉", 85: "🌞", 90: "🪄", 95: "⭐", 100: "🔮"
  };

  tasks.forEach((task) => {
    const name = task.textContent.trim();
    const count = parseInt(localStorage.getItem(name) || "0", 10) || 0;

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

function displayTaskTimestamps() {
  const tsContainer = document.getElementById("taskTimestampsContainer");
  if (!tsContainer) return;

  // Clear previous timestamps and keep heading
  tsContainer.innerHTML = "<h3>Task Submission Times:</h3>";

  Object.keys(localStorage).forEach((key) => {
    if (!key.endsWith("_timestamps")) return;

    const taskName = key.replace("_timestamps", "");
    const timestamps = JSON.parse(localStorage.getItem(key) || "[]");
    if (!timestamps || timestamps.length === 0) return;

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

/* ============================
   Sobriety tracker (days/h/m/s)
   ============================ */

// Initialize sobrietyStart from storage or now
let sobrietyStart = localStorage.getItem("sobrietyStart")
  ? new Date(localStorage.getItem("sobrietyStart"))
  : new Date();

function updateSobriety() {
  const tracker = document.getElementById("sobrietyTracker");
  if (!tracker) return;

  const now = new Date();
  let diff = now - sobrietyStart;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  tracker.textContent =
    `Congrats! You have ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds of sobriety.`;
}

// update every second
updateSobriety();
setInterval(updateSobriety, 1000);
