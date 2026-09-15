function checkValidDate(newDate) {
  const newTaskDueDate = newDate;

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
  const trimmed = str.trim();

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
  checkValidDate,
  escapeHTML,
};
