const pool = require("../config/db");
const workflowService = require("../services/workflowService");

// Create Order
exports.createOrder = async (req, res) => {
  const { title, description, durations } = req.body;

  if (
    !durations ||
    durations.design == null ||
    durations.production == null ||
    durations.quality == null ||
    durations.dispatch == null
  ) {
    return res.status(400).json({
      message: "All department durations are required",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO orders (title, description, status, durations) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, description, "pending", durations]
    );

    const order = result.rows[0];

    // Pass durations
    await workflowService.initializeWorkflow(order.id, durations);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching orders");
  }
};
