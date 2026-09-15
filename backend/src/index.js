const http = require("node:http");

const taskController = require("./controllers/taskController.js");
const { statusCodeMessage } = require("./utils/http.js");

const server = http.createServer(function (req, res) {
  if (req.method === "GET" && req.url === "/tasks") {
    taskController.getTasks(req, res);
    return;
  }
  if (req.method === "POST" && req.url === "/tasks") {
    taskController.createTasks(req, res);
    return;
  }

  if (req.method === "PATCH" && req.url.startsWith("/tasks/")) {
    taskController.updateTask(req, res);
    return;
  }

  if (req.method === "DELETE" && req.url.startsWith("/tasks/")) {
    taskController.deleteTask(req, res);
    return;
  }
  return statusCodeMessage(res, 404);
});

server.listen(3000);
