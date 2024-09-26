const mongoose = require('mongoose');
const db = require('../config/db');

const { Schema } = mongoose;

const reportSchema = new Schema({
    victimName: {
        type: String,
        required: true
    },
    victimType: {
        type: String,
        required: true
    },
    gradeYearLevel: {
        type: String,
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId, // This links to the user who reported the incident
        ref: 'user',
        required: true
    },
    reportDate: {
        type: Date,
        default: Date.now
    }
});

const ReportModel = db.model('report', reportSchema);
module.exports = ReportModel;
