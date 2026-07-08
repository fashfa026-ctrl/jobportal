const express = require("express");
const { createReport } = require("../controllers/reportController");
const { optionalAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", optionalAuth, createReport);

module.exports = router;
