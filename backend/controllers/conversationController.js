const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ExchangeRequest = require('../models/ExchangeRequest');
const Notification = require('../models/Notification');
const { emitToUser, emitToConversation, isUserOnline } = require('../utils/socket');

// @desc    Get all conversations for logged in user
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find active accepted exchange requests to ensure all accepted partners have a Conversation
    const acceptedExchanges = await ExchangeRequest.find({
      status: 'accepted',
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // Ensure conversation exists for each accepted exchange
    for (const exchange of acceptedExchanges) {
      const existingConv = await Conversation.findOne({ exchangeRequest: exchange._id });
      if (!existingConv) {
        await Conversation.create({
          participants: [exchange.sender, exchange.receiver],
          exchangeRequest: exchange._id,
          lastMessage: 'Skill exchange accepted! Start chatting here.',
          lastMessageAt: exchange.updatedAt || Date.now()
        });
      }
    }

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email profileImage role bio')
      .populate({
        path: 'exchangeRequest',
        populate: [
          { path: 'offeredSkill', select: 'name category' },
          { path: 'requestedSkill', select: 'name category' }
        ]
      })
      .sort({ lastMessageAt: -1 });

    // Format output with unread counts and online status
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          receiver: userId,
          read: false
        });

        const partner = conv.participants.find(
          (p) => p._id.toString() !== userId.toString()
        );

        return {
          _id: conv._id,
          exchangeRequest: conv.exchangeRequest,
          participants: conv.participants,
          partner,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
          isOnline: partner ? isUserOnline(partner._id) : false,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt
        };
      })
    );

    res.status(200).json({
      success: true,
      count: formattedConversations.length,
      data: formattedConversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation by ID
// @route   GET /api/conversations/:id
// @access  Private
const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(id)
      .populate('participants', 'name email profileImage role bio')
      .populate({
        path: 'exchangeRequest',
        populate: [
          { path: 'offeredSkill', select: 'name category' },
          { path: 'requestedSkill', select: 'name category' }
        ]
      });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this conversation'
      });
    }

    const partner = conversation.participants.find(
      (p) => p._id.toString() !== userId.toString()
    );

    const unreadCount = await Message.countDocuments({
      conversation: conversation._id,
      receiver: userId,
      read: false
    });

    res.status(200).json({
      success: true,
      data: {
        ...conversation.toObject(),
        partner,
        unreadCount,
        isOnline: partner ? isUserOnline(partner._id) : false
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation with pagination
// @route   GET /api/conversations/:id/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (pId) => pId.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access messages in this conversation'
      });
    }

    // Mark unread messages sent to this user as read
    await Message.updateMany(
      { conversation: id, receiver: userId, read: false },
      { $set: { read: true } }
    );

    const totalMessages = await Message.countDocuments({ conversation: id });

    // Fetch messages in descending order for pagination, then sort ascending for display
    const messages = await Message.find({ conversation: id })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const orderedMessages = messages.reverse();

    res.status(200).json({
      success: true,
      count: orderedMessages.length,
      total: totalMessages,
      page,
      pages: Math.ceil(totalMessages / limit),
      data: orderedMessages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/conversations/:id/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const senderId = req.user._id;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    if (text.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 2000 characters'
      });
    }

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (pId) => pId.toString() === senderId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this conversation'
      });
    }

    // Identify receiver
    const receiverId = conversation.participants.find(
      (pId) => pId.toString() !== senderId.toString()
    );

    // Create Message
    const message = await Message.create({
      conversation: id,
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
      read: false
    });

    // Update Conversation last message info
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    // Create notification for receiver
    const notification = await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: 'new_message',
      title: `New message from ${req.user.name}`,
      message: text.trim().length > 60 ? `${text.trim().substring(0, 60)}...` : text.trim(),
      relatedId: conversation._id
    });

    // Emit Socket.IO events in real time
    emitToConversation(id, 'receive_message', populatedMessage);
    emitToUser(receiverId, 'notification', {
      ...notification.toObject(),
      sender: { _id: req.user._id, name: req.user.name, profileImage: req.user.profileImage }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markMessageAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can mark this message as read'
      });
    }

    message.read = true;
    await message.save();

    emitToConversation(message.conversation, 'message_read', {
      messageId: message._id,
      conversationId: message.conversation
    });

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getConversationById,
  getMessages,
  sendMessage,
  markMessageAsRead
};
