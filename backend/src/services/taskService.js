const tasksStore = require("../tasksStore");
const helpers = require("../utils/helpers");

function createTask(data) {
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
    return {
      success: false,
      error: "INVALID_DATA",
    };
  }

  const validKeysData =
    "title" in data &&
    "description" in data &&
    "dueDate" in data &&
    "priority" in data;
  const validPriority = ["low", "medium", "high"];
  data.title = helpers.escapeHTML(data.title);
  data.description = helpers.escapeHTML(data.description);
  const check = helpers.checkValidDate(data.dueDate);
  if (
    !validPriority.includes(data.priority) ||
    check === false ||
    !validKeysData
  ) {
    return {
      success: false,
      error: "INVALID_DATA",
    };
  }

  const newTask = {
    id: tasksStore.addNextTaskId(),
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    completed: false,
  };

  tasksStore.taskPush(newTask);

  return newTask;
}

function updateTask(id, data) {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return {
      success: false,
      error: "INVALID_DATA",
    };
  }

  const task = tasksStore.findTaskById(id);

  if (!task) {
    return {
      success: false,
      error: "TASK_NOT_FOUND",
    };
  }

  const newDataKeys = Object.keys(data);
  const validPriority = ["low", "medium", "high"];
  const isValidOperation = newDataKeys.every(function (key) {
    return task.hasOwnProperty(key);
  });

  if (Object.hasOwn(data, "completed")) {
    if (typeof data.completed !== "boolean") {
      return {
        success: false,
        error: "INVALID_DATA",
      };
    }
  }

  if (Object.hasOwn(data, "priority")) {
    if (!validPriority.includes(data.priority)) {
      return {
        success: false,
        error: "INVALID_DATA",
      };
    }
  }
  if (Object.hasOwn(data, "dueDate")) {
    const check = helpers.checkValidDate(data.dueDate);
    if (check === false) {
      return {
        success: false,
        error: "INVALID_DATA",
      };
    }
  }
  if (Object.hasOwn(data, "id")) {
    return {
      success: false,
      error: "INVALID_DATA",
    };
  }
  if (!isValidOperation) {
    return {
      success: false,
      error: "INVALID_DATA",
    };
  }
  if (Object.hasOwn(data, "title")) {
    if (typeof data.title !== "string") {
      return {
        success: false,
        error: "INVALID_DATA",
      };
    }
    const validTitle = helpers.escapeHTML(data.title);
    data.title = validTitle;
    if (data.title.length < 3 || data.title.length > 50) {
      return {
        success: false,
        error: "INVALID_DATA",
      };
    }
  }
  if (Object.hasOwn(data, "description")) {
    if (typeof data.description !== "string") {
      return {
        success: false,
        error: "INVALID_DATA",
      };
    }
    const validDescription = helpers.escapeHTML(data.description);
    data.description = validDescription;
    if (data.description.length < 3 || data.description.length > 255) {
      return {
        success: false,
        error: "INVALID_DATA",
      };
    }
  }

  tasksStore.assignData(task, data);

  return task;
}

function deleteTask(id) {
  const index = tasksStore.findIndexById(id);

  if (index === -1) {
    return {
      success: false,
      error: "TASK_NOT_FOUND",
    };
  }

  tasksStore.spliceTask(index);
  return {
    success: true,
  };
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
};
