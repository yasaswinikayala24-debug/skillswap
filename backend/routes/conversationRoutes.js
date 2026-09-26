const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getConversations,
  getConversationById,
  getMessages,
  sendMessage,
  markMessageAsRead
} = require('../controllers/conversationController');

router.use(protect);

router.get('/', getConversations);
router.get('/:id', getConversationById);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

module.exports = router;
