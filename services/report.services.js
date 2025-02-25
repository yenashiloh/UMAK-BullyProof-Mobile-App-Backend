const ReportModel = require('../model/report.model');

class ReportService {
    static async createReport(reportData) {
        try {
            const report = new ReportModel(reportData);
            return await report.save();
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
