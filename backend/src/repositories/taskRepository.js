const pool = require("../db");

async function getAllTasks() {
  const result = await pool.query(
    "SELECT id, title, description, due_date, priority, completed FROM tasks",
  );
  return result.rows;
}

async function createTask(data) {
  const result = await pool.query(
    "INSERT INTO tasks (title, description, due_date, priority) VALUES ($1, $2, $3, $4) RETURNING *",
    [data.title, data.description, data.dueDate, data.priority],
  );
  return result.rows[0];
}

async function deleteTask(id) {
  const result = await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
  return result.rowCount;
}

async function updateTask(data, id) {
  const fields = [];
  const values = Object.values(data);
  const columnMap = {
    title: "title",
    description: "description",
    dueDate: "due_date",
    priority: "priority",
    completed: "completed",
  };
  const keys = Object.keys(data);

  for (const [index, field] of keys.entries()) {
    const column = columnMap[field];
    fields.push(`${column}=$${index + 2}`);
  }

  const fieldsJoin = fields.join(", ");
  const result = await pool.query(
    "UPDATE tasks SET " + fieldsJoin + " WHERE id=$1 RETURNING *",
    [id, ...values],
  );

  return result.rows[0];
}

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
};
