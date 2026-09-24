const list = document.getElementById("list");
const btc = document.getElementById("create-task");
const btd = document.getElementById("details");
const editDialog = document.getElementById("edit-dialog");
const bet = document.getElementById("edit-task");

let temporaryId;
let editingTaskElement;

function renderTask(task) {
  const li = document.createElement("li");
  const newTaskDiv = document.createElement("div");
  const titleContent = document.createElement("h3");
  const descriptionContent = document.createElement("p");
  const dueDateContent = document.createElement("span");
  const priorityContent = document.createElement("span");
  const editTitle = document.getElementById("edit-title");
  const editDescription = document.getElementById("edit-description");
  const editPriority = document.getElementById("edit-priority");
  const editDueDate = document.getElementById("edit-due-date");

  titleContent.classList.add("task-title");
  descriptionContent.classList.add("task-description");
  dueDateContent.classList.add("task-due-date");
  priorityContent.classList.add("task-priority");

  const dbt = document.createElement("button");
  const ebt = document.createElement("button");

  editDialog.classList.add("edit-dialog");

  dbt.addEventListener("click", deleteTask);

  ebt.addEventListener("click", function (event) {
    temporaryId = task.id;
    editingTaskElement = event.target.closest("li");

    editDialog.showModal();
    editTitle.value = task.title;
    editDescription.value = task.description;
    editDueDate.value = task.dueDate;
    editPriority.value = task.priority;
  });

  ebt.textContent = "edit";
  dbt.textContent = "delete";
  li.dataset.id = task.id;
  titleContent.textContent = task.title;
  descriptionContent.textContent = task.description;
  dueDateContent.textContent = task.dueDate;
  priorityContent.textContent = task.priority;

  newTaskDiv.append(
    dbt,
    ebt,
    titleContent,
    descriptionContent,
    dueDateContent,
    priorityContent,
  );

  li.appendChild(newTaskDiv);

  return li;
}

async function editTask() {
  const editTitle = document.getElementById("edit-title");
  const editDescription = document.getElementById("edit-description");
  const editPriority = document.getElementById("edit-priority");
  const editDueDate = document.getElementById("edit-due-date");
  const id = temporaryId;

  const newTask = {
    title: editTitle.value,
    description: editDescription.value,
    dueDate: editDueDate.value,
    priority: editPriority.value,
  };

  try {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const task = await response.json();

      editingTaskElement.querySelector(".task-title").textContent = task.title;
      editingTaskElement.querySelector(".task-description").textContent =
        task.description;
      editingTaskElement.querySelector(".task-due-date").textContent =
        task.dueDate;
      editingTaskElement.querySelector(".task-priority").textContent =
        task.priority;
      editDialog.close();
    } else {
      const error = await response.json();

      console.log(response.status);
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

bet.addEventListener("click", editTask);

async function loadTasks() {
  const response = await fetch("http://localhost:3000/tasks");
  const tasks = await response.json();

  for (const task of tasks) {
    const li = renderTask(task);
    list.appendChild(li);
  }
}

async function deleteTask(clickEvent) {
  const li = clickEvent.target.closest("li");
  const id = li.dataset.id;
  try {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      li.remove();
    } else {
      const error = await response.json();

      console.log(response.status);
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

async function createTask() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const dueDate = document.getElementById("date");
  const priority = document.getElementById("priority");

  const newTask = {
    title: title.value,
    description: description.value,
    dueDate: dueDate.value,
    priority: priority.value,
  };
  try {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const task = await response.json();

      const li = renderTask(task);

      list.appendChild(li);

      title.value = "";
      description.value = "";
      dueDate.value = "";
      priority.value = "";
    } else {
      const error = await response.json();

      console.log(response.status);
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

btc.addEventListener("click", createTask);
loadTasks();
