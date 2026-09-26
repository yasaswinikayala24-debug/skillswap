import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Calendar,
  ArrowLeft,
  Search,
  User,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { conversationAPI } from '../services/api';
import socketService from '../services/socketService';
import ScheduleSessionModal from '../components/ScheduleSessionModal';
import LoadingSpinner from '../components/LoadingSpinner';

const ChatPage = () => {
  const { user, token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialConvId = searchParams.get('conv');

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Real-time online status and typing status
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingStatus, setTypingStatus] = useState({});

  // Mobile View state (true = viewing conversation list, false = viewing active chat)
  const [showMobileList, setShowMobileList] = useState(!initialConvId);

  // Modal State
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversations on load
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const res = await conversationAPI.getConversations(token);
      if (res.success && res.data) {
        setConversations(res.data);
        
        // Auto-select initial conversation from URL query parameter or first item
        if (initialConvId) {
          const match = res.data.find((c) => c._id === initialConvId);
          if (match) setSelectedConversation(match);
        } else if (res.data.length > 0 && !selectedConversation) {
          setSelectedConversation(res.data[0]);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  }, [token, initialConvId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when selectedConversation changes
  const fetchMessages = useCallback(async (convId) => {
    if (!convId) return;
    try {
      setLoadingMessages(true);
      const res = await conversationAPI.getMessages(convId, 1, 50, token);
      if (res.success && res.data) {
        setMessages(res.data);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Failed to load messages:', err.message);
    } finally {
      setLoadingMessages(false);
    }
  }, [token]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      socketService.joinConversation(selectedConversation._id);

      return () => {
        socketService.leaveConversation(selectedConversation._id);
      };
    }
  }, [selectedConversation, fetchMessages]);

  // Socket.IO event listeners
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (selectedConversation && message.conversation === selectedConversation._id) {
        setMessages((prev) => [...prev, message]);
        setTimeout(scrollToBottom, 100);
      }
      fetchConversations();
    };

    const handleMessageRead = ({ conversationId }) => {
      if (selectedConversation && conversationId === selectedConversation._id) {
        setMessages((prev) =>
          prev.map((msg) => ({ ...msg, read: true }))
        );
      }
    };

    const handleTypingStart = ({ conversationId, name }) => {
      setTypingStatus((prev) => ({ ...prev, [conversationId]: `${name} is typing...` }));
    };

    const handleTypingStop = ({ conversationId }) => {
      setTypingStatus((prev) => {
        const updated = { ...prev };
        delete updated[conversationId];
        return updated;
      });
    };

    const handleUserOnline = ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    };

    const handleUserOffline = ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    };

    socketService.on('receive_message', handleReceiveMessage);
    socketService.on('message_read', handleMessageRead);
    socketService.on('typing_start', handleTypingStart);
    socketService.on('typing_stop', handleTypingStop);
    socketService.on('user_online', handleUserOnline);
    socketService.on('user_offline', handleUserOffline);

    return () => {
      socketService.off('receive_message', handleReceiveMessage);
      socketService.off('message_read', handleMessageRead);
      socketService.off('typing_start', handleTypingStart);
      socketService.off('typing_stop', handleTypingStop);
      socketService.off('user_online', handleUserOnline);
      socketService.off('user_offline', handleUserOffline);
    };
  }, [selectedConversation, fetchConversations]);

  // Handle message typing input & debounce typing events
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (selectedConversation) {
      socketService.sendTypingStart(selectedConversation._id);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTypingStop(selectedConversation._id);
      }, 1500);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConversation || sending) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketService.sendTypingStop(selectedConversation._id);

    try {
      setSending(true);
      const res = await conversationAPI.sendMessage(selectedConversation._id, textToSend, token);
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setTimeout(scrollToBottom, 100);
        fetchConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err.message);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const partnerName = c.partner?.name || '';
    return partnerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        
        {/* Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex overflow-hidden shadow-2xl min-h-[600px] max-h-[calc(100vh-8rem)]">
          
          {/* LEFT SIDEBAR: Conversation List */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-slate-900/50 ${
              !showMobileList ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Conversations</h2>
              </div>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search exchange partner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
              {loadingConversations ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <LoadingSpinner />
                  <p className="mt-2">Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-sm space-y-3">
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="font-semibold text-white">No active conversations</p>
                  <p className="text-xs text-slate-400">
                    Accept an exchange request to enable 1-on-1 real-time chat with your skill partner.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedConversation?._id === conv._id;
                  const partner = conv.partner;
                  const isOnline = partner ? (conv.isOnline || onlineUsers.has(partner._id)) : false;

                  return (
                    <button
                      key={conv._id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        setShowMobileList(false);
                        setSearchParams({ conv: conv._id });
                      }}
                      className={`w-full p-4 flex items-start space-x-3 text-left transition-colors ${
                        isSelected
                          ? 'bg-purple-600/10 border-l-4 border-purple-500'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {partner?.profileImage ? (
                          <img
                            src={partner.profileImage}
                            alt={partner.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 font-bold border border-slate-700">
                            {partner?.name?.charAt(0) || <User className="w-5 h-5" />}
                          </div>
                        )}
                        {/* Status dot */}
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                            isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {partner?.name || 'Skill Partner'}
                          </h4>
                          {conv.lastMessageAt && (
                            <span className="text-[10px] text-slate-500">
                              {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                      </div>

                      {/* Unread badge */}
                      {conv.unreadCount > 0 && (
                        <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT CHAT WINDOW */}
          <div
            className={`flex-1 flex flex-col bg-slate-950/40 ${
              showMobileList ? 'hidden md:flex' : 'flex'
            }`}
          >
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <div className="flex items-center space-x-3">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setShowMobileList(true)}
                      className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      {selectedConversation.partner?.profileImage ? (
                        <img
                          src={selectedConversation.partner.profileImage}
                          alt={selectedConversation.partner.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 font-bold border border-slate-700">
                          {selectedConversation.partner?.name?.charAt(0) || <User className="w-4 h-4" />}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          selectedConversation.isOnline || onlineUsers.has(selectedConversation.partner?._id)
                            ? 'bg-emerald-500'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {selectedConversation.partner?.name || 'Skill Partner'}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            selectedConversation.isOnline || onlineUsers.has(selectedConversation.partner?._id)
                              ? 'bg-emerald-500'
                              : 'bg-slate-500'
                          }`}
                        />
                        <span>
                          {selectedConversation.isOnline || onlineUsers.has(selectedConversation.partner?._id)
                            ? 'Online'
                            : 'Offline'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsSessionModalOpen(true)}
                      className="flex items-center space-x-2 px-3.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Session</span>
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      <LoadingSpinner />
                      <span className="ml-2">Loading chat history...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                      <MessageSquare className="w-12 h-12 text-purple-400/40 mb-2" />
                      <p className="font-semibold text-white text-base">No messages yet</p>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        Start the conversation with {selectedConversation.partner?.name}! Coordinate your skill exchange schedule.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;

                      return (
                        <div
                          key={msg._id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md'
                                : 'bg-slate-800 text-slate-200 border border-slate-700/70 rounded-bl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          </div>

                          <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-slate-500 px-1">
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isMe && (
                              <span>
                                {msg.read ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-purple-400 inline" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-slate-500 inline" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing Indicator */}
                  {typingStatus[selectedConversation._id] && (
                    <div className="flex items-center space-x-2 text-xs text-purple-400 font-medium italic animate-pulse py-1 px-2">
                      <span>{typingStatus[selectedConversation._id]}</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/80">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={`Type message to ${selectedConversation.partner?.name || 'partner'}...`}
                      value={inputText}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || sending}
                      className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-colors flex items-center justify-center shadow-lg shadow-purple-600/20"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Empty state when no conversation is selected */
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <MessageSquare className="w-16 h-16 text-slate-700 mb-4" />
                <h3 className="text-lg font-bold text-white">Select a SkillSwap partner</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Choose a conversation from the left sidebar to start real-time messaging and schedule exchange sessions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Session Modal */}
      <ScheduleSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        exchangeRequest={selectedConversation?.exchangeRequest ? {
          _id: selectedConversation.exchangeRequest._id,
          partnerName: selectedConversation.partner?.name
        } : null}
      />
    </div>
  );
};

export default ChatPage;
