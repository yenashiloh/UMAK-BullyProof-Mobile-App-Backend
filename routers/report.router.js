const router = require('express').Router();
const ReportController = require("../controller/report.controller");
const authMiddleware = require('../middleware/auth.middleware');

router.post('/submit', authMiddleware, ReportController.submitReport);

router.get('/', authMiddleware, ReportController.getReportsByUserId);

module.exports = router;
