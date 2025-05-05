// controller/cards.controller.js
const db = require('../config/db');
const { Types } = require('mongoose');

// Get all cards (active ones only)
exports.getCards = async (req, res, next) => {
    try {
        const cardsCollection = db.collection('cards');
        
        const cards = await cardsCollection
            .find({ status: "active" })
            .sort({ created_at: -1 })
            .toArray();
        
        res.status(200).json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({
            status: false,
            message: "Error fetching cards",
            error: error.message
        });
    }
};