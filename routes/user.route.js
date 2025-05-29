const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth.controller");



// Top 10 leaderboard
router.get("/leaderboard", userController.getLeaderboard);

module.exports = router;
