const mongoose = require('mongoose');
const db = require('../config/db');
const moment = require('moment-timezone');

const { Schema } = mongoose;

const reportSchema = new Schema({
    submitAs: {
        type: String,
        required: true
    },
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
        required: false
    },
    victimType: {
        type: String,
        required: false
    },
    gradeYearLevel: {
        type: String,
        required: false
    },
    hasReportedBefore: {
        type: String,
        required: true
    },
    departmentCollege: {
        type: String,
        required: true
    },
    reportedTo: {
        type: String,
        required: true
    },
    platformUsed: {
        type: [String],
        required: true
    },
    otherPlatformUsed: {
        type: String,
        required: true
    },
    cyberbullyingTypes: {
        type: [String],
        required: true
    },
    hasWitness: {
        type: String,
        required: false
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
        required: true
    },
    witnessChoice: {
        type: String,
        required: true
    },
    contactChoice: {
        type: String,
        required: true
    },
    actionsTaken: {
        type: String,
        required: true
    },
    describeActions: {
        type: String,
        required: true
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
