const db = require('../config/db');
const { Types } = require('mongoose');

const getNotifications = async (req, res) => {
    try {
        const userId = req.query.userId;

        // Get notifications collection from existing connection
        const notifications = db.collection('notifications');

        // Build query object
        const query = {};
        if (userId) {
            query.userId = new Types.ObjectId(userId);
        }

        // Get notifications
        const results = await notifications
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            status: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

module.exports = {
    getNotifications
};