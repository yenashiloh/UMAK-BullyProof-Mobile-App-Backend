const ReportService = require('../services/report.services');

exports.submitReport = async (req, res, next) => {
    try {
        const { victimName, victimType, gradeYearLevel } = req.body;

        const reportData = {
            victimName,
            victimType,
            gradeYearLevel,
            reportedBy: req.user._id // Assuming the user is authenticated and req.user contains their ID
        };

        const report = await ReportService.createReport(reportData);

        res.status(201).json({ status: true, message: "Report submitted successfully", report });
    } catch (error) {
        next(error);
    }
};
