const tasks = [];
let nextTaskId = 0;

function addNextTaskId() {
  return ++nextTaskId;
}

function findTaskById(id) {
  return tasks.find(function (task) {
    return task.id === id;
  });
}

function taskPush(task) {
  tasks.push(task);
  return {};
}

function assignData(task, data) {
  return Object.assign(task, data);
}

function spliceTask(index) {
  tasks.splice(index, 1);
}

function findIndexById(id) {
  return tasks.findIndex(function (task) {
    return task.id === id;
  });
}

module.exports = {
  tasks,
  addNextTaskId,
  findTaskById,
  taskPush,
  assignData,
  spliceTask,
  findIndexById,
};
