const pool = require("../config/db");

// 1. Order stats
exports.getOrderStats = async () => {
  const result = await pool.query(`
    SELECT status, COUNT(*) 
    FROM orders
    GROUP BY status
  `);
  return result.rows;
};

// 2. Delays per department
exports.getDelaysByDept = async () => {
  const result = await pool.query(`
    SELECT department_id, COUNT(*) 
    FROM workflow_stages
    WHERE status = 'delayed'
    GROUP BY department_id
  `);
  return result.rows;
};

// 3. Active vs completed
exports.getWorkflowStats = async () => {
  const result = await pool.query(`
    SELECT status, COUNT(*) 
    FROM workflow_stages
    GROUP BY status
  `);
  return result.rows;
};
