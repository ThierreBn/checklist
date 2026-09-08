const http = require("node:http");

const tasks = [];

const httpStatusCodes = {
  // 1xx Informational
  100: { success: true, message: "Continue" },
  101: { success: true, message: "Switching Protocols" },

  // 2xx Success
  200: { success: true, message: "OK" },
  201: { success: true, message: "Created" },
  202: { success: true, message: "Accepted" },
  204: { success: true, message: "No Content" },

  // 3xx Redirection
  301: { success: true, message: "Moved Permanently" },
  302: { success: true, message: "Found" },
  304: { success: true, message: "Not Modified" },

  // 4xx Client Errors
  400: { success: false, message: "Bad Request" },
  401: { success: false, message: "Unauthorized" },
  403: { success: false, message: "Forbidden" },
  404: { success: false, message: "Not Found" },
  405: { success: false, message: "Method Not Allowed" },
  408: { success: false, message: "Request Timeout" },
  409: { success: false, message: "Conflict" },
  422: { success: false, message: "Unprocessable Entity" },
  429: { success: false, message: "Too Many Requests" },

  // 5xx Server Errors
  500: { success: false, message: "Internal Server Error" },
  501: { success: false, message: "Not Implemented" },
  502: { success: false, message: "Bad Gateway" },
  503: { success: false, message: "Service Unavailable" },
  504: { success: false, message: "Gateway Timeout" },
};

function statusCodeMessage(res, code) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(httpStatusCodes[code]));
  return;
}

function findTaskById(id) {
  return tasks.find(function (task) {
    return task.id === id;
  });
}

function checkValidDate(data) {
  const newTaskDueDate = data.dueDate;

  if (typeof newTaskDueDate !== "string") {
    return false;
  }

  const splitNewTaskDueDate = newTaskDueDate.split("-");

  const newTaskTime = splitNewTaskDueDate.map(Number);

  const date = new Date(newTaskTime[0], newTaskTime[1] - 1, newTaskTime[2]);
  const dateArray = [date.getFullYear(), date.getMonth(), date.getDate()];
  const timeArray = [newTaskTime[0], newTaskTime[1] - 1, newTaskTime[2]];

  for (let i = 0; i < dateArray.length; i++) {
    if (dateArray[i] !== timeArray[i]) {
      return false;
    }
  }

  if (
    splitNewTaskDueDate.length !== 3 ||
    !newTaskTime.every(Number.isInteger)
  ) {
    return false;
  }
  return true;
}

let nextTaskId = 0;

const server = http.createServer(function (req, res) {
  if (req.method === "GET" && req.url === "/tasks") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(tasks));
    return;
  }
  if (req.method === "POST" && req.url === "/tasks") {
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

      if (!data.title || !data.description || !data.dueDate || !data.priority) {
        return statusCodeMessage(res, 400);
      }

      const newTask = {
        id: ++nextTaskId,
        title: data.title,
        description: data.description,
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

  if (req.method === "PATCH" && req.url.startsWith("/tasks/")) {
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

      const newDataKeys = Object.keys(data);
      const validPriority = ["low", "medium", "high"];

      const isValidOperation = newDataKeys.every(function (key) {
        return task.hasOwnProperty(key);
      });

      if (Object.hasOwn(data, "priority")) {
        if (!validPriority.includes(data.priority)) {
          return statusCodeMessage(res, 400);
        }
      }

      if (!isValidOperation) {
        return statusCodeMessage(res, 400);
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

      Object.assign(task, data);

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(task));
    });
    return;
  }
  if (req.method === "DELETE" && req.url.startsWith("/tasks/")) {
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
  return statusCodeMessage(res, 404);
});

server.listen(3000);
