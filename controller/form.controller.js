// controller/form.controller.js
const db = require('../config/db');
const { Types } = require('mongoose');

// Get all published forms
exports.getForms = async (req, res, next) => {
    try {
        const formsCollection = db.collection('form_builders');
        
        const forms = await formsCollection
            .find({ status: "draft" })
            .sort({ created_at: -1 })
            .toArray();
        
        res.status(200).json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({
            status: false,
            message: "Error fetching forms",
            error: error.message
        });
    }
};

// Get a specific form by ID
exports.getFormById = async (req, res, next) => {
    try {
        const { formId } = req.params;
        const formsCollection = db.collection('form_builder');
        
        const form = await formsCollection.findOne({ 
            _id: new Types.ObjectId(formId) 
        });
        
        if (!form) {
            return res.status(404).json({
                status: false,
                message: "Form not found"
            });
        }
        
        res.status(200).json(form);
    } catch (error) {
        console.error('Error fetching form by ID:', error);
        res.status(500).json({
            status: false,
            message: "Error fetching form",
            error: error.message
        });
    }
};