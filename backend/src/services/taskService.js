const helpers = require("../utils/helpers");
const repository = require("../repositories/taskRepository");

async function createTask(data) {
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
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
  };

  const task = await repository.createTask(newTask);
  return task;
}

async function updateTask(id, data) {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data) ||
    Object.keys(data).length === 0
  ) {
    return {
      success: false,
      error: "INVALID_DATA",
    };
  }
  const validKeys = [
    "title",
    "description",
    "dueDate",
    "priority",
    "completed",
  ];

  const allKeysAreValid = Object.keys(data).every(function (key) {
    return validKeys.includes(key);
  });

  if (!allKeysAreValid) {
    return {
      success: false,
      error: "INVALID_DATA",
    };
  }

  const validPriority = ["low", "medium", "high"];

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
  const task = await repository.updateTask(data, id);

  if (!task) {
    return {
      success: false,
      error: "TASK_NOT_FOUND",
    };
  }
  return task;
}

async function deleteTask(id) {
  const returned = await repository.deleteTask(id);

  if (returned === 0) {
    return {
      success: false,
      error: "TASK_NOT_FOUND",
    };
  }

  return {
    success: true,
  };
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
};
