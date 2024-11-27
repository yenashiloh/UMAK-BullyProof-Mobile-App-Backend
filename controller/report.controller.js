const ReportService = require('../services/report.services');

exports.submitReport = async (req, res, next) => {
    try {
        const {
            victimName, victimType, gradeYearLevel, victimRelationship,
            otherVictimRelationship, hasReportedBefore, departmentCollege,
            reportedTo, platformUsed, otherPlatformUsed, hasWitness, witnessInfo,
            incidentDetails, incidentEvidence, perpetratorName, perpetratorRole,
            perpetratorGradeYearLevel, supportTypes, otherSupportTypes, actionsTaken,
            describeActions
        } = req.body;

        const reportData = {
            victimName,
            victimType,
            gradeYearLevel,
            victimRelationship,
            otherVictimRelationship,
            hasReportedBefore,
            departmentCollege,
            reportedTo,
            platformUsed,
            otherPlatformUsed,
            hasWitness,
            witnessInfo,
            incidentDetails,
            incidentEvidence,
            perpetratorName,
            perpetratorRole,
            perpetratorGradeYearLevel,
            supportTypes,
            otherSupportTypes,
            actionsTaken,
            describeActions,
            reportedBy: req.user._id,
            status: 'For Review'
        };

        const report = await ReportService.createReport(reportData);

        res.status(201).json({ status: true, message: "Report submitted successfully", report });
    } catch (error) {
        next(error);
    }
};

// New function to get reports by reportedBy (userId)
exports.getReportsByUserId = async (req, res, next) => {
    try {
        const userId = req.user._id;  // Assuming the user is authenticated and their ID is available in req.user
        const reports = await ReportService.getReportsByUserId(userId);

        if (reports.length > 0) {
            res.status(200).json(reports);  // Return all reports for this user
        } else {
            res.status(404).json({ message: 'No reports found for this user' });
        }
    } catch (error) {
        next(error);
    }
};