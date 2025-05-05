// routers/cards.router.js
const express = require('express');
const router = express.Router();
const CardsController = require('../controller/cards.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all cards (active ones only)
router.get('/', CardsController.getCards);

module.exports = router;