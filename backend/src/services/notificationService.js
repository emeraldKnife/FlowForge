const pool = require("../config/db");

exports.createNotificationForDepartment = async (departmentId, message) => {
  try {
    const users = await pool.query(
      "SELECT id FROM users WHERE department_id = $1",
      [departmentId]
    );

    for (let user of users.rows) {
      await pool.query(
        `INSERT INTO notifications (user_id, message)
         VALUES ($1, $2)`,
        [user.id, message]
      );
    }
  } catch (err) {
    console.error(err);
  }
};
