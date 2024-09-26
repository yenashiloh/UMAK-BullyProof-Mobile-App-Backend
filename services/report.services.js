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
}

module.exports = ReportService;
