const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} = require('../controller/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, getNotifications);
router.put('/mark-read/:notificationId', authMiddleware, markNotificationAsRead);
router.put('/mark-all-read', authMiddleware, markAllNotificationsAsRead);
router.delete('/:notificationId', authMiddleware, deleteNotification);

module.exports = router;