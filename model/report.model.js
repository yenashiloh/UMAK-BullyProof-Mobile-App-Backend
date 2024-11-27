const mongoose = require('mongoose');
const db = require('../config/db');
const moment = require('moment-timezone');

const { Schema } = mongoose;

const reportSchema = new Schema({
    victimRelationship: {
        type: String,
        required: true
    },
    otherVictimRelationship: {
        type: String,
        required: false
    },
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
    hasReportedBefore: {
        type: String,
        required: true
    },
    departmentCollege: {
        type: String,
        required: false
    },
    reportedTo: {
        type: String,
        required: false
    },
    platformUsed: {
        type: [String],
        required: true
    },
    otherPlatformUsed: {
        type: String,
        required: false
    },
    hasWitness: {
        type: String,
        required: true
    },
    witnessInfo: {
        type: String,
        required: false
    },
    incidentDetails: {
        type: String,
        required: true
    },
    incidentEvidence: {
        type: [String],
        required: true
    },
    perpetratorName: {
        type: String,
        required: true
    },
    perpetratorRole: {
        type: String,
        required: true
    },
    perpetratorGradeYearLevel: {
        type: String,
        required: true
    },
    supportTypes: {
        type: [String],
        required: true
    },
    otherSupportTypes: {
        type: String,
        required: false
    },
    actionsTaken: {
        type: String,
        required: false
    },
    describeActions: {
        type: String,
        required: false
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    reportDate: {
        type: Date,
        default: () => moment().tz('Asia/Manila').toDate()
    },
    status: {
        type: String,
        default: 'For Review'
    }
});

const ReportModel = db.model('report', reportSchema);
module.exports = ReportModel;
