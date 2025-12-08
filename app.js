const tasks = document.querySelectorAll(".taskCounter");
const submitBtn = document.querySelector(".taskCounterSubmit");

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

      // --- localStorage counter logic ---
      let count = localStorage.getItem(taskName);
      count = count ? parseInt(count) + 1 : 1;
      localStorage.setItem(taskName, count);

      displayTaskCounters();
    }
  });
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

  tasks.forEach((task) => {
    const name = task.textContent.trim();
    const count = localStorage.getItem(name);

    if (count !== null) {
      const row = document.createElement("div");
      row.textContent = `${name}: ${count}`;
      display.appendChild(row);
    }
  });
}
