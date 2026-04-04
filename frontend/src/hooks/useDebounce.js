import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getSocket } from '../api/socket';
import { addMessage, setUserOnline, setTyping, incrementUnread } from '../store/slices/chatSlice';

// useDebounce hook
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// useSocket hook
export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {
      dispatch(addMessage({
        conversationId: message.conversation,
        message,
      }));
    };

    const handleUserStatus = ({ userId, isOnline, lastSeen }) => {
      dispatch(setUserOnline({ userId, isOnline, lastSeen }));
    };

    const handleTyping = ({ userId, conversationId, isTyping }) => {
      dispatch(setTyping({ userId, conversationId, isTyping }));
    };

    const handleMessageNotification = ({ conversationId }) => {
      dispatch(incrementUnread({ conversationId }));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_status', handleUserStatus);
    socket.on('user_typing', handleTyping);
    socket.on('message_notification', handleMessageNotification);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_status', handleUserStatus);
      socket.off('user_typing', handleTyping);
      socket.off('message_notification', handleMessageNotification);
    };
  }, [dispatch]);
};

// useConversationSocket hook
export const useConversationSocket = (conversationId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    socket.emit('join_conversation', conversationId);

    return () => {
      socket.emit('leave_conversation', conversationId);
    };
  }, [conversationId]);

  const sendTyping = useCallback((isTyping) => {
    const socket = getSocket();
    if (socket && conversationId) {
      socket.emit('typing', { conversationId, isTyping });
    }
  }, [conversationId]);

  return { sendTyping };
};

// useLocalStorage hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};