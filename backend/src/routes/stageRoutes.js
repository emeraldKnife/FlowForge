const express = require("express");
const router = express.Router();
const stageController = require("../controllers/stageController");

router.post("/complete", stageController.completeStage);

module.exports = router;
