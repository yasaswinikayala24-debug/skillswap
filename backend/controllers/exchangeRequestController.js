const ExchangeRequest = require('../models/ExchangeRequest');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const { emitToUser } = require('../utils/socket');

// @desc    Send a skill exchange request
// @route   POST /api/exchange-requests
// @access  Private
const sendExchangeRequest = async (req, res, next) => {
  try {
    const { receiverId, offeredSkillId, requestedSkillId, message } = req.body;

    if (!receiverId || !offeredSkillId || !requestedSkillId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiverId, offeredSkillId, and requestedSkillId'
      });
    }

    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a skill exchange request to yourself'
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver user not found'
      });
    }

    const sender = await User.findById(req.user._id);

    // Verify sender teaches offeredSkill
    const senderTeaches = sender.skillsToTeach?.some(
      (s) => s.skill && s.skill.toString() === offeredSkillId
    );
    if (!senderTeaches) {
      return res.status(400).json({
        success: false,
        message: 'You can only offer a skill that is listed in your "Skills I Can Teach"'
      });
    }

    // Verify receiver teaches requestedSkill
    const receiverTeaches = receiver.skillsToTeach?.some(
      (s) => s.skill && s.skill.toString() === requestedSkillId
    );
    if (!receiverTeaches) {
      return res.status(400).json({
        success: false,
        message: 'The requested skill is not listed in the receiver\'s teaching skills'
      });
    }

    // Prevent duplicate pending request
    const existingPending = await ExchangeRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending'
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending exchange request with this user'
      });
    }

    const exchangeRequest = await ExchangeRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      offeredSkill: offeredSkillId,
      requestedSkill: requestedSkillId,
      message: message ? message.trim() : '',
      status: 'pending'
    });

    const populatedRequest = await ExchangeRequest.findById(exchangeRequest._id)
      .populate('receiver', 'name bio profileImage role')
      .populate('offeredSkill', 'name category')
      .populate('requestedSkill', 'name category');

    // Create Notification for receiver
    const notification = await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: 'exchange_request',
      title: 'New Skill Exchange Request',
      message: `${req.user.name} sent you a skill exchange request!`,
      relatedId: exchangeRequest._id
    });

    emitToUser(receiverId, 'notification', {
      ...notification.toObject(),
      sender: { _id: req.user._id, name: req.user.name, profileImage: req.user.profileImage }
    });

    res.status(201).json({
      success: true,
      message: 'Exchange request sent successfully',
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get received exchange requests for current user
// @route   GET /api/exchange-requests/received
// @access  Private
const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await ExchangeRequest.find({ receiver: req.user._id })
      .populate('sender', 'name bio profileImage role')
      .populate('offeredSkill', 'name category')
      .populate('requestedSkill', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sent exchange requests by current user
// @route   GET /api/exchange-requests/sent
// @access  Private
const getSentRequests = async (req, res, next) => {
  try {
    const requests = await ExchangeRequest.find({ sender: req.user._id })
      .populate('receiver', 'name bio profileImage role')
      .populate('offeredSkill', 'name category')
      .populate('requestedSkill', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get count of pending received requests (for navbar badge)
// @route   GET /api/exchange-requests/pending-count
// @access  Private
const getPendingCount = async (req, res, next) => {
  try {
    const count = await ExchangeRequest.countDocuments({
      receiver: req.user._id,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept an exchange request
// @route   PUT /api/exchange-requests/:id/accept
// @access  Private
const acceptExchangeRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await ExchangeRequest.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this request'
      });
    }

    request.status = 'accepted';
    await request.save();

    // Create Conversation if not existing
    let conversation = await Conversation.findOne({ exchangeRequest: request._id });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [request.sender, request.receiver],
        exchangeRequest: request._id,
        lastMessage: 'Skill exchange request accepted! Start chatting here.',
        lastMessageAt: Date.now()
      });
    }

    // Create Notification for sender
    const notification = await Notification.create({
      recipient: request.sender,
      sender: req.user._id,
      type: 'request_accepted',
      title: 'Exchange Request Accepted!',
      message: `${req.user.name} accepted your skill exchange request!`,
      relatedId: request._id
    });

    emitToUser(request.sender, 'notification', {
      ...notification.toObject(),
      sender: { _id: req.user._id, name: req.user.name, profileImage: req.user.profileImage }
    });

    const updated = await ExchangeRequest.findById(id)
      .populate('sender', 'name bio profileImage role')
      .populate('receiver', 'name bio profileImage role')
      .populate('offeredSkill', 'name category')
      .populate('requestedSkill', 'name category');

    res.status(200).json({
      success: true,
      message: 'Skill exchange request accepted!',
      data: updated,
      conversationId: conversation._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject an exchange request
// @route   PUT /api/exchange-requests/:id/reject
// @access  Private
const rejectExchangeRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await ExchangeRequest.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this request'
      });
    }

    request.status = 'rejected';
    await request.save();

    const notification = await Notification.create({
      recipient: request.sender,
      sender: req.user._id,
      type: 'request_rejected',
      title: 'Exchange Request Update',
      message: `${req.user.name} declined the exchange request.`,
      relatedId: request._id
    });

    emitToUser(request.sender, 'notification', {
      ...notification.toObject(),
      sender: { _id: req.user._id, name: req.user.name, profileImage: req.user.profileImage }
    });

    res.status(200).json({
      success: true,
      message: 'Exchange request rejected',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a sent exchange request
// @route   PUT /api/exchange-requests/:id/cancel
// @access  Private
const cancelExchangeRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await ExchangeRequest.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    if (request.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this request'
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Exchange request cancelled',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active (accepted) exchanges for current user
// @route   GET /api/exchange-requests/active
// @access  Private
const getActiveExchanges = async (req, res, next) => {
  try {
    const activeExchanges = await ExchangeRequest.find({
      status: 'accepted',
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate('sender', 'name bio profileImage role')
      .populate('receiver', 'name bio profileImage role')
      .populate('offeredSkill', 'name category')
      .populate('requestedSkill', 'name category')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: activeExchanges.length,
      data: activeExchanges
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendExchangeRequest,
  getReceivedRequests,
  getSentRequests,
  getPendingCount,
  acceptExchangeRequest,
  rejectExchangeRequest,
  cancelExchangeRequest,
  getActiveExchanges
};
