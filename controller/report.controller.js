const ReportService = require('../services/report.services');

exports.submitReport = async (req, res, next) => {
    try {
        const {
            submitAs, victimName, victimType, gradeYearLevel, victimRelationship,
            otherVictimRelationship, hasReportedBefore, departmentCollege,
            reportedTo, platformUsed, otherPlatformUsed, cyberbullyingTypes,
            hasWitness, witnessInfo, incidentDetails, incidentEvidence,
            perpetratorName, perpetratorRole, perpetratorGradeYearLevel,
            supportTypes, otherSupportTypes, witnessChoice, contactChoice, actionsTaken,
            describeActions
        } = req.body;

        const reportData = {
            submitAs,
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
            cyberbullyingTypes,
            hasWitness,
            witnessInfo,
            incidentDetails,
            incidentEvidence,
            perpetratorName,
            perpetratorRole,
            perpetratorGradeYearLevel,
            supportTypes,
            otherSupportTypes,
            witnessChoice,
            contactChoice,
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

exports.getReportsByUserId = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const reports = await ReportService.getReportsByUserId(userId);

        if (reports.length > 0) {
            res.status(200).json(reports);
        } else {
            res.status(404).json({ message: 'No reports found for this user' });
        }
    } catch (error) {
        next(error);
    }
};