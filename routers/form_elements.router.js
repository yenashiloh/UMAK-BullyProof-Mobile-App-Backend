// routers/form_elements.router.js
const express = require('express');
const router = express.Router();
const FormElementsController = require('../controller/form_elements.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', FormElementsController.getFormElements);

module.exports = router;