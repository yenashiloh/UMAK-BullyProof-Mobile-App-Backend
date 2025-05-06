// routers/form.router.js
const express = require('express');
const router = express.Router();
const FormController = require('../controller/form.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all published forms
router.get('/', FormController.getForms);

// Get a specific form by ID
router.get('/:formId', FormController.getFormById);

router.post('/submit', FormController.submitForm);

module.exports = router;