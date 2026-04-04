import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConversations, fetchMessages, sendMessage,
  setActiveConversation, clearUnread
} from '../store/slices/chatSlice';
import { useConversationSocket } from '../hooks/useDebounce';
import { getAvatarUrl, formatLastSeen, timeAgo } from '../utils/helpers';

const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
    <img
      src={getAvatarUrl(message.sender?.avatar, message.sender?.name)}
      alt={message.sender?.name}
      className="w-7 h-7 rounded-full flex-shrink-0 self-end"
    />
    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn
        ? 'bg-primary-500 text-dark-950 rounded-br-sm'
        : 'bg-dark-800 text-white rounded-bl-sm'
        }`}>
        {message.content}
      </div>
      <span className="text-xs text-dark-500">{timeAgo(message.createdAt)}</span>
    </div>
  </div>
);

const ConversationItem = ({ conv, isActive, onClick, currentUserId }) => {
  const other = conv.otherParticipant;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${isActive ? 'bg-primary-500/10 border border-primary-500/30' : 'hover:bg-dark-800'}`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={getAvatarUrl(other?.avatar, other?.name)}
          alt={other?.name}
          className="w-11 h-11 rounded-full"
        />
        {other?.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-dark-950 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm text-white truncate">{other?.name}</span>
          {conv.myUnreadCount > 0 && (
            <span className="w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
              {conv.myUnreadCount}
            </span>
          )}
        </div>
        {conv.listing && (
          <p className="text-xs text-dark-400 truncate mt-0.5">Re: {conv.listing.title}</p>
        )}
        {conv.lastMessage && (
          <p className="text-xs text-dark-500 truncate">{conv.lastMessage.content}</p>
        )}
      </div>
    </button>
  );
};

const Chat = () => {
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations, messages, activeConversation, onlineUsers, typingUsers } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendTyping } = useConversationSocket(activeConversation?._id);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c._id === conversationId);
      if (conv) {
        dispatch(setActiveConversation(conv));
        dispatch(fetchMessages({ conversationId }));
        dispatch(clearUnread(conversationId));
      }
    }
  }, [conversationId, conversations.length, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages[activeConversation?._id]?.length]);

  const handleConversationClick = (conv) => {
    dispatch(setActiveConversation(conv));
    dispatch(fetchMessages({ conversationId: conv._id }));
    dispatch(clearUnread(conv._id));
    navigate(`/chat/${conv._id}`);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    sendTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), 1500);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeConversation || sending) return;

    const content = input.trim();
    setInput('');
    setSending(true);
    sendTyping(false);

    const result = await dispatch(sendMessage({ conversationId: activeConversation._id, content }));
    setSending(false);

    if (!sendMessage.fulfilled.match(result)) {
      setInput(content);
    }
  };

  const currentMessages = activeConversation ? (messages[activeConversation._id] || []) : [];
  const otherParticipant = activeConversation?.otherParticipant ||
    activeConversation?.participants?.find(p => p._id !== user._id);

  const typingInConv = activeConversation
    ? Object.keys(typingUsers[activeConversation._id] || {}).filter(uid => uid !== user._id)
    : [];

  const isOtherOnline = otherParticipant?._id &&
    (onlineUsers[otherParticipant._id]?.isOnline ?? otherParticipant?.isOnline);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex h-[calc(100vh-160px)] gap-4">
        {/* Conversations sidebar */}
        <div className={`w-full sm:w-80 flex-shrink-0 glass-card flex flex-col ${activeConversation ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-dark-700">
            <h2 className="text-lg font-bold font-display text-white">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-dark-400 text-sm">No conversations yet</p>
                <p className="text-dark-500 text-xs mt-1">Contact a seller from any listing to start chatting</p>
              </div>
            ) : (
              conversations.map(conv => (
                <ConversationItem
                  key={conv._id}
                  conv={conv}
                  isActive={activeConversation?._id === conv._id}
                  onClick={() => handleConversationClick(conv)}
                  currentUserId={user._id}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 glass-card flex flex-col ${!activeConversation ? 'hidden sm:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-dark-700 flex items-center gap-3">
                <button
                  className="sm:hidden p-1 text-dark-300 hover:text-white"
                  onClick={() => { dispatch(setActiveConversation(null)); navigate('/chat'); }}
                >
                  ←
                </button>
                <div className="relative">
                  <img
                    src={getAvatarUrl(otherParticipant?.avatar, otherParticipant?.name)}
                    alt={otherParticipant?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {isOtherOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-dark-900 rounded-full" />
                  )}
                </div>
                <div>
                  <Link to={`/profile/${otherParticipant?._id}`} className="font-semibold text-white hover:text-primary-400 transition-colors">
                    {otherParticipant?.name}
                  </Link>
                  <p className="text-xs text-dark-400">
                    {isOtherOnline ? '🟢 Online' : formatLastSeen(otherParticipant?.lastSeen)}
                  </p>
                </div>
                {activeConversation.listing && (
                  <Link
                    to={`/listing/${activeConversation.listing._id || activeConversation.listing}`}
                    className="ml-auto text-xs text-primary-400 hover:text-primary-300 truncate max-w-32 sm:max-w-xs"
                  >
                    📦 {activeConversation.listing.title}
                  </Link>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">👋</div>
                    <p className="text-dark-400 text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  currentMessages.map(msg => (
                    <MessageBubble
                      key={msg._id}
                      message={msg}
                      isOwn={msg.sender?._id === user._id || msg.sender === user._id}
                    />
                  ))
                )}

                {typingInConv.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <img src={getAvatarUrl(otherParticipant?.avatar, otherParticipant?.name)} alt="" className="w-7 h-7 rounded-full" />
                    <div className="bg-dark-800 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-dark-700 flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="btn-primary px-5 py-2.5 disabled:opacity-50"
                >
                  {sending ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold font-display text-white mb-2">Your Messages</h3>
              <p className="text-dark-400 max-w-xs">Select a conversation from the sidebar or contact a seller from a listing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;