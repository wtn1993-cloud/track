// ====== DOMContentLoaded Initialization ======
document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("taskContainer");

  // Initialize tasks in localStorage if not already set
  const existingTasks = taskContainer.querySelectorAll(".taskCounter");
  existingTasks.forEach((task) => {
    const name = task.textContent.trim();
    if (!localStorage.getItem(name)) {
      localStorage.setItem(name, 0);
    }
  });

  // Render counters and timestamps
  displayTaskCounters();
  displayTaskTimestamps();

  // Setup hide/show toggle button for timestamps
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Hide/Show Timestamps";
  toggleBtn.addEventListener("click", () => {
    const tsContainer = document.getElementById("taskTimestampsContainer");
    tsContainer.style.display =
      tsContainer.style.display === "none" ? "block" : "none";
  });
});

// ====== Task Click Handling (Event Delegation) ======
const taskContainer = document.getElementById("taskContainer");
taskContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("taskCounter")) {
    e.target.classList.toggle("selected");
  }
});

// ====== Submit Button Handling ======
const submitBtn = document.querySelector(".taskCounterSubmit");
submitBtn.addEventListener("click", () => {
  const selectedTasks = document.querySelectorAll(".taskCounter.selected");

  selectedTasks.forEach((task) => {
    const name = task.textContent.trim();

    // Increment task counter
    let count = parseInt(localStorage.getItem(name)) || 0;
    localStorage.setItem(name, count + 1);

    // Add timestamp
    const now = new Date().toISOString();
    const key = name + "_timestamps";
    const timestamps = JSON.parse(localStorage.getItem(key)) || [];
    timestamps.push(now);
    localStorage.setItem(key, JSON.stringify(timestamps));
  });

  // Update displays
  displayTaskCounters();
  displayTaskTimestamps();

  // Deselect all
  selectedTasks.forEach((task) => task.classList.remove("selected"));

  console.log(
    "Submitted tasks with timestamps:",
    Array.from(selectedTasks).map((t) => t.textContent.trim())
  );
});

// ====== Clear LocalStorage Button ======
const clearBtn = document.getElementById("clearLocalStorage");
clearBtn.addEventListener("click", () => {
  Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
  displayTaskCounters();
  displayTaskTimestamps();
});

// ====== Display Task Counters ======
function displayTaskCounters() {
  const display = document.getElementById("taskDisplay");
  display.innerHTML = ""; // clear old output

  const tasks = document.querySelectorAll(".taskCounter");

  // Milestone icons
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
    if (milestone >= 5 && milestone <= 100 && icons[milestone]) {
      const icon = document.createElement("span");
      icon.className = "fire-icon";
      icon.textContent = icons[milestone];
      row.appendChild(icon);
    }

    display.appendChild(row);
  });
}

// ====== Display Task Timestamps ======
function displayTaskTimestamps() {
  const tsContainer = document.getElementById("taskTimestampsContainerTitle");

  // Clear the container completely
  tsContainer.innerHTML = "<h3>Task Submission Times:</h3>";

  // Iterate over keys in localStorage that end with "_timestamps"
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
