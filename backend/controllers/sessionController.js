const Session = require('../models/Session');
const ExchangeRequest = require('../models/ExchangeRequest');
const Notification = require('../models/Notification');
const { emitToUser } = require('../utils/socket');

// @desc    Create a new skill exchange session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res, next) => {
  try {
    const { exchangeRequestId, title, description, scheduledAt, duration } = req.body;
    const userId = req.user._id;

    if (!exchangeRequestId || !title || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide exchangeRequestId, title, and scheduledAt date'
      });
    }

    const exchange = await ExchangeRequest.findById(exchangeRequestId);

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    if (exchange.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Sessions can only be scheduled for accepted exchange requests'
      });
    }

    const isSender = exchange.sender.toString() === userId.toString();
    const isReceiver = exchange.receiver.toString() === userId.toString();

    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to schedule a session for this exchange'
      });
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid scheduled date format' });
    }

    if (scheduledDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Session date cannot be scheduled in the past'
      });
    }

    const participantId = isSender ? exchange.receiver : exchange.sender;

    const session = await Session.create({
      exchangeRequest: exchangeRequestId,
      organizer: userId,
      participant: participantId,
      title: title.trim(),
      description: description ? description.trim() : '',
      scheduledAt: scheduledDate,
      duration: parseInt(duration, 10) || 60,
      status: 'scheduled'
    });

    const populatedSession = await Session.findById(session._id)
      .populate('organizer', 'name profileImage email role')
      .populate('participant', 'name profileImage email role')
      .populate({
        path: 'exchangeRequest',
        populate: [
          { path: 'offeredSkill', select: 'name category' },
          { path: 'requestedSkill', select: 'name category' }
        ]
      });

    // Create notification for participant
    const notification = await Notification.create({
      recipient: participantId,
      sender: userId,
      type: 'session_created',
      title: 'New Session Scheduled',
      message: `${req.user.name} scheduled "${title.trim()}" for ${scheduledDate.toLocaleString()}`,
      relatedId: session._id
    });

    emitToUser(participantId, 'notification', {
      ...notification.toObject(),
      sender: { _id: req.user._id, name: req.user.name, profileImage: req.user.profileImage }
    });

    res.status(201).json({
      success: true,
      message: 'Skill exchange session scheduled successfully',
      data: populatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions for current user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      $or: [{ organizer: userId }, { participant: userId }]
    })
      .populate('organizer', 'name profileImage email role')
      .populate('participant', 'name profileImage email role')
      .populate({
        path: 'exchangeRequest',
        populate: [
          { path: 'offeredSkill', select: 'name category' },
          { path: 'requestedSkill', select: 'name category' }
        ]
      })
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id)
      .populate('organizer', 'name profileImage email role')
      .populate('participant', 'name profileImage email role')
      .populate({
        path: 'exchangeRequest',
        populate: [
          { path: 'offeredSkill', select: 'name category' },
          { path: 'requestedSkill', select: 'name category' }
        ]
      });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isAuthorized =
      session.organizer._id.toString() === userId.toString() ||
      session.participant._id.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this session'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update / Reschedule session
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, scheduledAt, duration } = req.body;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isOrganizer = session.organizer.toString() === userId.toString();
    const isParticipant = session.participant.toString() === userId.toString();

    if (!isOrganizer && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this session'
      });
    }

    if (session.status === 'completed' || session.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule a ${session.status} session`
      });
    }

    if (scheduledAt) {
      const newDate = new Date(scheduledAt);
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid scheduled date format' });
      }
      if (newDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Rescheduled date cannot be in the past'
        });
      }
      session.scheduledAt = newDate;
    }

    if (title) session.title = title.trim();
    if (description !== undefined) session.description = description.trim();
    if (duration) session.duration = parseInt(duration, 10);

    await session.save();

    const updatedSession = await Session.findById(id)
      .populate('organizer', 'name profileImage email role')
      .populate('participant', 'name profileImage email role')
      .populate({
        path: 'exchangeRequest',
        populate: [
          { path: 'offeredSkill', select: 'name category' },
          { path: 'requestedSkill', select: 'name category' }
        ]
      });

    const otherUserId = isOrganizer ? session.participant : session.organizer;

    const notification = await Notification.create({
      recipient: otherUserId,
      sender: userId,
      type: 'session_updated',
      title: 'Session Rescheduled',
      message: `${req.user.name} rescheduled "${session.title}" to ${new Date(session.scheduledAt).toLocaleString()}`,
      relatedId: session._id
    });

    emitToUser(otherUserId, 'notification', {
      ...notification.toObject(),
      sender: { _id: req.user._id, name: req.user.name, profileImage: req.user.profileImage }
    });

    res.status(200).json({
      success: true,
      message: 'Session updated successfully',
      data: updatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
const cancelSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isOrganizer = session.organizer.toString() === userId.toString();
    const isParticipant = session.participant.toString() === userId.toString();

    if (!isOrganizer && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this session'
      });
    }

    session.status = 'cancelled';
    await session.save();

    const updatedSession = await Session.findById(id)
      .populate('organizer', 'name profileImage email role')
      .populate('participant', 'name profileImage email role');

    const otherUserId = isOrganizer ? session.participant : session.organizer;

    const notification = await Notification.create({
      recipient: otherUserId,
      sender: userId,
      type: 'session_cancelled',
      title: 'Session Cancelled',
      message: `${req.user.name} cancelled the session "${session.title}"`,
      relatedId: session._id
    });

    emitToUser(otherUserId, 'notification', {
      ...notification.toObject(),
      sender: { _id: req.user._id, name: req.user.name, profileImage: req.user.profileImage }
    });

    res.status(200).json({
      success: true,
      message: 'Session cancelled successfully',
      data: updatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark session as completed
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isOrganizer = session.organizer.toString() === userId.toString();
    const isParticipant = session.participant.toString() === userId.toString();

    if (!isOrganizer && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to complete this session'
      });
    }

    session.status = 'completed';
    await session.save();

    const updatedSession = await Session.findById(id)
      .populate('organizer', 'name profileImage email role')
      .populate('participant', 'name profileImage email role');

    res.status(200).json({
      success: true,
      message: 'Session marked as completed!',
      data: updatedSession
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  cancelSession,
  completeSession
};
