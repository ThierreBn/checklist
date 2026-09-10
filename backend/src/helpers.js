const tasksStore = require("./tasksStore");

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

function findTaskById(id) {
  return tasksStore.tasks.find(function (task) {
    return task.id === id;
  });
}

function statusCodeMessage(res, code) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(httpStatusCodes[code]));
  return;
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

function escapeHTML(str) {
  const trimmed = data.title.trim();

  return trimmed.replace(/[&<>"'/]/g, function (match) {
    const htmlEntities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    return htmlEntities[match];
  });
}

module.exports = {
  findTaskById,
  statusCodeMessage,
  checkValidDate,
  escapeHTML,
};
