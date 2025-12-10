const tasks = document.querySelectorAll(".taskCounter");
const submitBtn = document.querySelector(".taskCounterSubmit");

document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("taskContainer");

  // Grab all existing tasks in HTML
  const existingTasks = taskContainer.querySelectorAll(".taskCounter");

  existingTasks.forEach((task) => {
    const name = task.textContent.trim();

    // Initialize in localStorage to 0 (overwrites any existing value)
    localStorage.setItem(name, 0);
  });

  // Render tasks from localStorage
  renderTasks();
});

function displayTaskTimestamps() {
  const tsContainer = document.getElementById("taskTimestampsContainer");

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Only process timestamp keys
    if (!key.endsWith("_timestamps")) continue;

    const taskName = key.replace("_timestamps", "");
    const timestamps = JSON.parse(localStorage.getItem(key)) || [];

    if (timestamps.length > 0) {
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
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("taskContainer");

  // Grab all existing tasks in HTML
  const existingTasks = taskContainer.querySelectorAll(".taskCounter");

  existingTasks.forEach((task) => {
    const name = task.textContent.trim();

    // Initialize in localStorage to 0 (overwrites any existing value)
    localStorage.setItem(name, 0);
  });

  // Render tasks from localStorage
  renderTasks();
});

// Toggle selection
tasks.forEach((task) => {
  task.addEventListener("click", () => {
    task.classList.toggle("selected");
  });
});

// Submit
submitBtn.addEventListener("click", () => {
  const selectedTasks = [];

  tasks.forEach((task) => {
    if (task.classList.contains("selected")) {
      const taskName = task.textContent.trim();
      selectedTasks.push(taskName);

      // --- Increment counter in localStorage ---
      let count = localStorage.getItem(taskName);
      count = count ? parseInt(count) + 1 : 1;
      localStorage.setItem(taskName, count);

      // --- Add timestamp for this submission ---
      const now = new Date().toISOString(); // ISO format
      let timestamps =
        JSON.parse(localStorage.getItem(taskName + "_timestamps")) || [];
      timestamps.push(now);
      localStorage.setItem(
        taskName + "_timestamps",
        JSON.stringify(timestamps)
      );
    }
  });

  // Update the display after submission
  displayTaskCounters();
  displayTaskTimestamps(); // <-- updates the separate timestamp div

  // Optionally, deselect tasks after submission
  tasks.forEach((task) => task.classList.remove("selected"));

  console.log("Submitted tasks with timestamps:", selectedTasks);
});

const clearBtn = document.getElementById("clearLocalStorage");

clearBtn.addEventListener("click", () => {
  localStorage.clear();
  displayTaskCounters();
});

function displayTaskCounters() {
  const display = document.getElementById("taskDisplay");
  display.innerHTML = ""; // clear old output

  const tasks = document.querySelectorAll(".taskCounter");

  // Icon map for each milestone
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
    const count = parseInt(localStorage.getItem(name));

    if (!isNaN(count)) {
      const row = document.createElement("div");

      const label = document.createElement("span");
      label.textContent = `${name}: ${count}`;
      row.appendChild(label);

      // Determine which icon to show
      const milestone = Math.floor(count / 5) * 5; // nearest 5 below count

      if (milestone >= 5 && milestone <= 100 && icons[milestone]) {
        const icon = document.createElement("span");
        icon.className = "fire-icon"; // reuse animation CSS
        icon.textContent = icons[milestone];
        row.appendChild(icon);
      }

      display.appendChild(row);
    }
  });
}
