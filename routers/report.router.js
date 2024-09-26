const router = require('express').Router();
const ReportController = require("../controller/report.controller");
const authMiddleware = require('../middleware/auth.middleware');

// Add a new route for submitting reports
router.post('/submit', authMiddleware, ReportController.submitReport);

module.exports = router;
