const http = require("node:http");

const taskController = require("./controllers/taskController.js");
const { statusCodeMessage } = require("./utils/http.js");

const server = http.createServer(function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

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
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify("Not Found"));
  return;
});

server.listen(3000);
