const mongoose = require('mongoose');
const { Schema } = mongoose;
const db = require('../config/db');

const auditTrailSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: Schema.Types.Mixed,
        required: false
    },
    timestamp: {
        type: Date,
        default: () => Date.now()
    }
});

const AuditTrailModel = db.model('audit_trail', auditTrailSchema);
module.exports = AuditTrailModel;