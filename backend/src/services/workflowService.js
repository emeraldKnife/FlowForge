const pool = require("../config/db");

exports.initializeWorkflow = async (orderId, durations) => {
  const deptMap = {
    1: durations.design,
    2: durations.production,
    3: durations.quality,
    4: durations.dispatch
  };

  for (let i = 1; i <= 4; i++) {
    await pool.query(
      `INSERT INTO workflow_stages 
      (order_id, department_id, status, expected_duration)
      VALUES ($1, $2, $3, $4)`,
      [
        orderId,
        i,
        i === 1 ? "in_progress" : "pending",
        deptMap[i] || 0
      ]
    );
  }
};
