const ReportModel = require('../model/report.model');
const AuditTrailModel = require('../model/auditTrail.model');

class ReportService {
    static async createReport(reportData) {
        try {
            const report = new ReportModel(reportData);
            const savedReport = await report.save();

            await AuditTrailModel.create({
                userId: reportData.reportedBy,
                action: 'REPORT_SUBMITTED',
                details: {
                    reportId: savedReport._id,
                    submitAs: reportData.submitAs,
                    victimName: reportData.victimName,
                    perpetratorName: reportData.perpetratorName,
                    incidentDetails: reportData.incidentDetails,
                    status: savedReport.status
                }
            });

            return savedReport;
        } catch (error) {
            throw error;
        }
    }

    static async getReportsByUserId(userId) {
        try {
            return await ReportModel.find({ reportedBy: userId });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ReportService;