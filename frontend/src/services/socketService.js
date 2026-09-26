import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    if (this.socket && this.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    // Determine host
    const socketUrl = window.location.origin;

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      this.connected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  on(event, callback) {
    const socket = this.getSocket();
    if (socket) {
      socket.off(event, callback); // Remove existing listener to avoid duplicates
      socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    const socket = this.getSocket();
    if (socket) {
      socket.emit(event, data);
    }
  }

  joinConversation(conversationId) {
    this.emit('join_conversation', { conversationId });
  }

  leaveConversation(conversationId) {
    this.emit('leave_conversation', { conversationId });
  }

  sendTypingStart(conversationId) {
    this.emit('typing_start', { conversationId });
  }

  sendTypingStop(conversationId) {
    this.emit('typing_stop', { conversationId });
  }
}

const socketService = new SocketService();
export default socketService;
