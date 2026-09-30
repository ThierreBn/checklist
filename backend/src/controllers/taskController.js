const statusCodeMessage = require("../utils/http");
const taskService = require("../services/taskService");
const repository = require("../repositories/taskRepository");

async function getTasks(req, res) {
  const tasks = await repository.getAllTasks();

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(tasks));
  return;
}

function createTasks(req, res) {
  let body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", async function () {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return statusCodeMessage(res, 400);
    }

    const serviceReturn = await taskService.createTask(data);

    if (Object.hasOwn(serviceReturn, "error")) {
      if (serviceReturn.error === "INVALID_DATA") {
        return statusCodeMessage(res, 400);
      }
      if (serviceReturn.error === "TASK_NOT_FOUND") {
        return statusCodeMessage(res, 404);
      }
    }

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(serviceReturn));
    return;
  });

  return;
}

function updateTask(req, res) {
  const urlArray = req.url.split("/");
  const id = Number(urlArray[2]);
  let body = "";

  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", async function () {
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return statusCodeMessage(res, 400);
    }
    if (Number.isInteger(id) !== true || urlArray.length > 3) {
      return statusCodeMessage(res, 400);
    }

    const serviceReturn = await taskService.updateTask(id, data);

    if (Object.hasOwn(serviceReturn, "error")) {
      if (serviceReturn.error === "INVALID_DATA") {
        return statusCodeMessage(res, 400);
      }
      if (serviceReturn.error === "TASK_NOT_FOUND") {
        return statusCodeMessage(res, 404);
      }
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(serviceReturn));
    return;
  });
}

async function deleteTask(req, res) {
  const urlArray = req.url.split("/");
  const id = Number(urlArray[2]);

  if (Number.isInteger(id) !== true || urlArray.length > 3) {
    return statusCodeMessage(res, 400);
  }

  const serviceReturn = await taskService.deleteTask(id);

  if (Object.hasOwn(serviceReturn, "error")) {
    if (serviceReturn.error === "INVALID_DATA") {
      return statusCodeMessage(res, 400);
    }
    if (serviceReturn.error === "TASK_NOT_FOUND") {
      return statusCodeMessage(res, 404);
    }
  }

  res.statusCode = 204;
  res.end();
  return;
}

module.exports = {
  getTasks,
  createTasks,
  updateTask,
  deleteTask,
};
