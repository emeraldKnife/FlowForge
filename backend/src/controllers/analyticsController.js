const analyticsService = require("../services/analyticsService");

exports.getDashboard = async (req, res) => {
  try {
    const orderStats = await analyticsService.getOrderStats();
    const delayStats = await analyticsService.getDelaysByDept();
    const workflowStats = await analyticsService.getWorkflowStats();

    res.json({
      orderStats,
      delayStats,
      workflowStats,
    });
  } catch (err) {
    res.status(500).send("Error fetching analytics");
  }
};
