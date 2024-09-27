const ReportService = require('../services/report.services');

exports.submitReport = async (req, res, next) => {
    try {
        const {
            victimName, victimType, gradeYearLevel, victimRelationship, hasReportedBefore,
            reportedTo, platformUsed, cyberbullyingType, incidentDetails, perpetratorName,
            perpetratorRole, perpetratorGradeYearLevel, actionsTaken, describeActions
        } = req.body;

        const reportData = {
            victimName,
            victimType,
            gradeYearLevel,
            victimRelationship,
            hasReportedBefore,
            reportedTo,
            platformUsed,
            cyberbullyingType,
            incidentDetails,
            perpetratorName,
            perpetratorRole,
            perpetratorGradeYearLevel,
            actionsTaken,
            describeActions,
            reportedBy: req.user._id // Assuming the user is authenticated
        };

        const report = await ReportService.createReport(reportData);

        res.status(201).json({ status: true, message: "Report submitted successfully", report });
    } catch (error) {
        next(error);
    }
};
