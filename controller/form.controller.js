// controller/form.controller.js
const db = require('../config/db');
const { Types } = require('mongoose');
const fs = require('fs');
const path = require('path');

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

// Modified controller/form.controller.js
exports.submitForm = async (req, res, next) => {
    try {
        const formData = req.body;

        // Add user ID from token if not provided
        if (!formData.reported_by) {
            formData.reported_by = req.user._id;
        }

        // Validate the form data
        if (!formData.form_builder_id) {
            return res.status(400).json({
                status: false,
                message: 'Form builder ID is required'
            });
        }

        // Process file uploads if they exist in the form data
        const stepsData = formData.steps_data;
        if (stepsData) {
            for (const stepId in stepsData) {
                const stepData = stepsData[stepId];

                for (const elementId in stepData) {
                    const elementValue = stepData[elementId];

                    // Check if the value is a file upload array
                    if (Array.isArray(elementValue) &&
                        elementValue.length > 0 &&
                        elementValue[0].hasOwnProperty('fileContent')) {

                        // Just keep the base64 content as is, no need to decode
                        // We'll just add a flag to indicate we're storing base64
                        for (const fileData of elementValue) {
                            // Add a flag to indicate this is base64 data
                            fileData.isBase64 = true;

                            // Optionally, we can add a timestamp to track when it was uploaded
                            fileData.uploadedAt = new Date().toISOString();
                        }
                    }
                }
            }
        }

        // Save to database
        const formDataCollection = db.collection('form_data');
        const result = await formDataCollection.insertOne(formData);

        // Return success response
        res.status(201).json({
            status: true,
            message: 'Form submitted successfully',
            formDataId: result.insertedId
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({
            status: false,
            message: 'Error submitting form',
            error: error.message
        });
    }
};