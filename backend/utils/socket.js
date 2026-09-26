const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io = null;
const userSocketsMap = new Map(); // userId string -> Set of socketIds

const initSocket = (server, options = {}) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    ...options
  });

  // JWT Middleware for Socket.IO authentication
  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      return next(new Error('Authentication failed: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    // Register user socket
    if (!userSocketsMap.has(userId)) {
      userSocketsMap.set(userId, new Set());
    }
    userSocketsMap.get(userId).add(socket.id);

    // Join personal room for notifications/private events
    socket.join(`user:${userId}`);

    // Broadcast online status to connected clients
    io.emit('user_online', { userId, status: 'online' });

    // Join specific conversation room
    socket.on('join_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.join(`conversation:${conversationId}`);
      }
    });

    // Leave conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    // Typing start event
    socket.on('typing_start', ({ conversationId, partnerId }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('typing_start', {
          conversationId,
          userId,
          name: socket.user.name
        });
      }
    });

    // Typing stop event
    socket.on('typing_stop', ({ conversationId, partnerId }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('typing_stop', {
          conversationId,
          userId
        });
      }
    });

    // Disconnect event
    socket.on('disconnect', () => {
      const userSet = userSocketsMap.get(userId);
      if (userSet) {
        userSet.delete(socket.id);
        if (userSet.size === 0) {
          userSocketsMap.delete(userId);
          // Broadcast user offline
          io.emit('user_offline', { userId, status: 'offline' });
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

const isUserOnline = (userId) => {
  const userSet = userSocketsMap.get(userId.toString());
  return !!(userSet && userSet.size > 0);
};

const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId.toString()}`).emit(event, data);
  }
};

const emitToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(`conversation:${conversationId.toString()}`).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  isUserOnline,
  emitToUser,
  emitToConversation
};
