const pool = require("../config/db");

exports.checkDelays = async () => {
  const result = await pool.query(
    `SELECT * FROM workflow_stages
     WHERE status = 'in_progress'`
  );

  const now = new Date();

  for (let stage of result.rows) {
    if (!stage.started_at || !stage.expected_duration) continue;

    const expectedEnd = new Date(stage.started_at);
    expectedEnd.setHours(expectedEnd.getHours() + stage.expected_duration);

    if (now > expectedEnd) {
      // Mark delayed
      await pool.query(
        `UPDATE workflow_stages
         SET status = 'delayed'
         WHERE id = $1`,
        [stage.id]
      );

      // Log delay
      await pool.query(
        `INSERT INTO logs (order_id, message)
         VALUES ($1, $2)`,
        [
          stage.order_id,
          `Department ${stage.department_id} delayed`
        ]
      );
    }
  }
};
