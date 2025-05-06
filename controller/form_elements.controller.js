// controller/form_elements.controller.js
const db = require('../config/db');
const { Types } = require('mongoose');

exports.getFormElements = async (req, res, next) => {
  try {
    const formBuilderId = req.query.form_builder_id;
    const stepId = req.query.step_id;
    
    const query = {};
    if (formBuilderId) {
      query.form_builder_id = formBuilderId;
    }
    if (stepId) {
      query.step_id = stepId;
    }
    
    const formElementsCollection = db.collection('form_elements');
    const elements = await formElementsCollection.find(query).toArray();
    
    res.status(200).json(elements);
  } catch (error) {
    console.error('Error fetching form elements:', error);
    res.status(500).json({
      status: false,
      message: 'Error fetching form elements',
      error: error.message
    });
  }
};