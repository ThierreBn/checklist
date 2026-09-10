const tasks = [];
let nextTaskId = 0;

function addNextTaskId() {
  return ++nextTaskId;
}
module.exports = {
  tasks,
  addNextTaskId,
};
