const pool = require("../config/db");
const notificationService = require("./notificationService");

exports.completeStage = async (orderId, departmentId) => {
  // Mark current stage completed
  await pool.query(
    `UPDATE workflow_stages 
     SET status = 'completed', completed_at = NOW()
     WHERE order_id = $1 AND department_id = $2`,
    [orderId, departmentId]
  );

  // Send notification
  await notificationService.createNotificationForDepartment(
    departmentId,
    `Department ${departmentId} completed its stage for order ${orderId}`
  );

  // Find next stage
  const nextStage = await pool.query(
    `SELECT * FROM workflow_stages
     WHERE order_id = $1 AND department_id = $2`,
    [orderId, departmentId + 1]
  );

  // Start next stage
  if (nextStage.rows.length > 0) {
    await pool.query(
      `UPDATE workflow_stages
       SET status = 'in_progress', started_at = NOW()
       WHERE order_id = $1 AND department_id = $2`,
      [orderId, departmentId + 1]
    );
  } else {
    // If no next stage → order completed
    await pool.query(
      `UPDATE orders
       SET status = 'completed'
       WHERE id = $1`,
      [orderId]
    );
  }

  // Send notification for the next department
  await notificationService.createNotificationForDepartment(
    departmentId + 1,
    `Your department can now start work on order ${orderId}`
  );
  
  // Log
  await pool.query(
    `INSERT INTO logs (order_id, message)
    VALUES ($1, $2)`,
    [orderId, `Department ${departmentId} completed its stage`]
  );
};
