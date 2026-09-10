const { tasks, addNextTaskId } = require("../tasksStore");
const {
  statusCodeMessage,
  findTaskById,
  checkValidDate,
  escapeHTML,
} = require("../helpers");

function getTasks(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(tasks));
  return;
}

function createTasks(req, res) {
  let body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function () {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return statusCodeMessage(res, 400);
    }

    if (
      data === null ||
      Array.isArray(data) ||
      typeof data !== "object" ||
      typeof data.description !== "string" ||
      typeof data.title !== "string" ||
      !data.title ||
      !data.description ||
      !data.dueDate ||
      !data.priority ||
      data.title.length < 3 ||
      data.description.length < 3 ||
      data.title.length > 50 ||
      data.description.length > 255
    ) {
      return statusCodeMessage(res, 400);
    }

    const validKeysData =
      "title" in data &&
      "description" in data &&
      "dueDate" in data &&
      "priority" in data;
    const validPriority = ["low", "medium", "high"];
    const validTitle = escapeHTML(data.title);
    const validDescription = escapeHTML(data.description);
    const check = checkValidDate(data);
    if (
      !validPriority.includes(data.priority) ||
      check === false ||
      !validKeysData
    ) {
      return statusCodeMessage(res, 400);
    }

    const newTask = {
      id: addNextTaskId(),
      title: validTitle,
      description: validDescription,
      dueDate: data.dueDate,
      priority: data.priority,
      completed: false,
    };

    tasks.push(newTask);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(newTask));
    return;
  });

  return;
}

function alterTask(req, res) {
  const urlArray = req.url.split("/");
  const id = Number(urlArray[2]);
  let body = "";

  if (Number.isInteger(id) !== true || urlArray.length > 3) {
    return statusCodeMessage(res, 400);
  }

  const task = findTaskById(id);

  if (!task) {
    return statusCodeMessage(res, 404);
  }

  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function () {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return statusCodeMessage(res, 400);
    }
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return statusCodeMessage(res, 400);
    }
    const newDataKeys = Object.keys(data);
    const validPriority = ["low", "medium", "high"];
    const isValidOperation = newDataKeys.every(function (key) {
      return task.hasOwnProperty(key);
    });

    if (Object.hasOwn(data, "completed")) {
      if (typeof data.completed !== "boolean") {
        return statusCodeMessage(res, 400);
      }
    }

    if (Object.hasOwn(data, "priority")) {
      if (!validPriority.includes(data.priority)) {
        return statusCodeMessage(res, 400);
      }
    }
    if (Object.hasOwn(data, "dueDate")) {
      const check = checkValidDate(data);
      if (check === false) {
        return statusCodeMessage(res, 400);
      }
    }
    if (Object.hasOwn(data, "id")) {
      return statusCodeMessage(res, 400);
    }
    if (!isValidOperation) {
      return statusCodeMessage(res, 400);
    }
    if (Object.hasOwn(data, "title")) {
      if (typeof data.title !== "string") {
        return statusCodeMessage(res, 400);
      }
      const validTitle = escapeHTML(data.title);
      data.title = validTitle;
      if (data.title.length < 3 || data.title.length > 50) {
        return statusCodeMessage(res, 400);
      }
    }
    if (Object.hasOwn(data, "description")) {
      if (typeof data.description !== "string") {
        return statusCodeMessage(res, 400);
      }
      const validDescription = escapeHTML(data.description);
      data.description = validDescription;
      if (data.description.length < 3 || data.description.length > 255) {
        return statusCodeMessage(res, 400);
      }
    }

    Object.assign(task, data);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(task));
  });
}

function deleteTask(req, res) {
  const urlArray = req.url.split("/");
  const id = Number(urlArray[2]);

  if (Number.isInteger(id) !== true || urlArray.length > 3) {
    return statusCodeMessage(res, 400);
  }

  const index = tasks.findIndex(function (task) {
    return task.id === id;
  });

  if (index === -1) {
    return statusCodeMessage(res, 404);
  }

  tasks.splice(index, 1);

  res.statusCode = 204;
  res.end();
  return;
}
module.exports = {
  getTasks,
  createTasks,
  alterTask,
  deleteTask,
};
