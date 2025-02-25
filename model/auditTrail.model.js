const mongoose = require('mongoose');
const { Schema } = mongoose;
const db = require('../config/db');

const auditTrailSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'user', 
        required: false 
    }, // ID of the user performing the action (null for anonymous/system actions)
    action: { 
        type: String, 
        required: true 
    }, // e.g., "ACCOUNT_CREATED", "LOGIN", etc.
    details: { 
        type: Schema.Types.Mixed, 
        required: false 
    }, // Additional info (stored as JSON/object)
    timestamp: { 
        type: Date, 
        default: () => Date.now() 
    } // When the action occurred
});

const AuditTrailModel = db.model('auditTrail', auditTrailSchema);
module.exports = AuditTrailModel;