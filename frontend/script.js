const list = document.getElementById("list");
const background = document.querySelector(".background");
const bto = document.querySelector(".open-task-manager");
const taskManager = document.querySelector(".task-container");
const btcl = document.querySelector(".close-task-manager");
const btc = document.querySelector(".create-task");

function openTaskManager() {
  taskManager.showModal();
  background.style.filter = "blur(2px)";
}

function closeTaskManager() {
  taskManager.close();
  background.style.filter = "blur(0px)";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && taskManager.open) {
    event.preventDefault();
  }
});

btcl.addEventListener("click", closeTaskManager);
bto.addEventListener("click", openTaskManager);

btc.addEventListener("click", function () {
  let newTask = document.createElement("li");
  const title = document.querySelector(".title");
  const description = document.querySelector(".description");
  const priority = document.querySelector(".priority");

  const task = document.createElement("div");
  const headerDiv = document.createElement("div");
  const descDiv = document.createElement("div");
  const h3 = document.createElement("h3");
  const p = document.createElement("p");
  const span = document.createElement("span");
  const checkbox = document.createElement("input");
  const dueDate = document.getElementById("due-date");
  const dueDateContent = document.createElement("span");
  const bte = document.createElement("button");

  checkbox.type = "checkbox";

  bte.textContent = ">";

  bte.classList.add("expand-task-button");
  headerDiv.classList.add("header-task-div");
  checkbox.classList.add("task-check");
  descDiv.classList.add("desc-div");
  task.classList.add("task-div");

  bte.addEventListener("click", function () {
    descDiv.classList.toggle("extended-task-div");
  });

  dueDateContent.textContent = dueDate.value;
  h3.textContent = title.value;
  p.textContent = description.value;
  span.textContent = priority.value;

  if (h3.textContent.trim() !== "" && span.textContent.trim() !== "") {
    headerDiv.append(checkbox, h3, span, dueDateContent, bte);
    descDiv.appendChild(p);
    task.append(headerDiv, descDiv);
    newTask.appendChild(task);

    list.appendChild(newTask);
    taskManager.close();
    background.style.filter = "blur(0px)";

    title.value = "";
    description.value = "";
    priority.value = "";
    dueDate.value = "";
  }
});

list.addEventListener("change", function (event) {
  if (event.target.classList.contains("task-check")) {
    const taskDiv = document.querySelector(".task-div");
    const checkbox = taskDiv.querySelector(".task-check");
    const h3TaskDiv = taskDiv.querySelector("h3");

    if (checkbox.checked) {
      checkbox.style.accentColor = "#87A987";
      h3TaskDiv.style.color = "#87A987";
      h3TaskDiv.style.textDecoration = "line-through";
    } else {
      checkbox.style.accentColor = "";
      h3TaskDiv.style.color = "";
    }
  }
});
