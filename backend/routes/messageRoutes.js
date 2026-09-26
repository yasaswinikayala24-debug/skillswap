const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { markMessageAsRead } = require('../controllers/conversationController');

router.use(protect);

router.put('/:id/read', markMessageAsRead);

module.exports = router;
