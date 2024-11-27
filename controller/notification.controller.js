const db = require('../config/db');
const { Types } = require('mongoose');

const getNotifications = async (req, res) => {
    try {
        const userId = req.query.userId;

        const notifications = db.collection('notifications');

        const query = {};
        if (userId) {
            query.userId = new Types.ObjectId(userId);
        }

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

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notifications = db.collection('notifications');

        const result = await notifications.updateOne(
            { _id: new Types.ObjectId(notificationId) },
            { 
                $set: { 
                    status: 'read', 
                    readAt: new Date() 
                } 
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            status: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = db.collection('notifications');

        const result = await notifications.updateMany(
            { 
                userId: new Types.ObjectId(userId), 
                status: 'unread' 
            },
            { 
                $set: { 
                    status: 'read', 
                    readAt: new Date() 
                } 
            }
        );

        res.status(200).json({
            status: true,
            message: `${result.modifiedCount} notifications marked as read`
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            status: false,
            message: 'Error marking all notifications as read',
            error: error.message
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notifications = db.collection('notifications');

        const result = await notifications.deleteOne({ 
            _id: new Types.ObjectId(notificationId) 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            status: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};