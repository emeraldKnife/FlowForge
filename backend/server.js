const express = require("express");
const cors = require("cors");
const pool = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const authMiddleware = require("./src/middleware/authMiddleware");
const roleMiddleware = require("./src/middleware/roleMiddleware");
const orderRoutes = require("./src/routes/orderRoutes");
const stageRoutes = require("./src/routes/stageRoutes");
const delayService = require("./src/services/delayService");
const notificationRoutes = require("./src/routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);

app.get("/protected", authMiddleware, roleMiddleware("admin", "ceo"), (req, res) => {
    res.send("You have access");
  }
);

app.use("/api/orders", orderRoutes);

app.use("/api/stages", stageRoutes);

app.get("/check-delays", async (req, res) => {
  try {
    await delayService.checkDelays();
    res.send("Delay check completed");
  } catch (err) {
    res.status(500).send("Error checking delays");
  }
});

app.use("/api/notifications", notificationRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
