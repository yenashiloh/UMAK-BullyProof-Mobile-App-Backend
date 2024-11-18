const ReportService = require('../services/report.services');

exports.submitReport = async (req, res, next) => {
    try {
        const {
            victimName, victimType, gradeYearLevel, victimRelationship, hasReportedBefore,
            reportedTo, platformUsed, cyberbullyingType, incidentDetails, incidentEvidence,
            perpetratorName, perpetratorRole, perpetratorGradeYearLevel, supportTypes,
            actionsTaken, describeActions
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
            incidentEvidence,
            perpetratorName,
            perpetratorRole,
            perpetratorGradeYearLevel,
            supportTypes,
            actionsTaken,
            describeActions,
            reportedBy: req.user._id,
            status: 'To Review'
        };

        const report = await ReportService.createReport(reportData);

        res.status(201).json({ status: true, message: "Report submitted successfully", report });
    } catch (error) {
        next(error);
    }
};
