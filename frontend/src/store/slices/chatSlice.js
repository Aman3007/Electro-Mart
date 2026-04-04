import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchConversations = createAsyncThunk('chat/fetchConversations', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/chat/conversations');
    return res.data.conversations;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async ({ conversationId, page = 1 }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/chat/conversations/${conversationId}/messages?page=${page}`);
    return { conversationId, messages: res.data.messages, page };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ conversationId, content }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/chat/conversations/${conversationId}/messages`, { content });
    return { conversationId, message: res.data.message };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const getOrCreateConversation = createAsyncThunk('chat/getOrCreate', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/chat/conversations', data);
    return res.data.conversation;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    messages: {},
    activeConversation: null,
    loading: false,
    error: null,
    onlineUsers: {},
    typingUsers: {},
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      // Avoid duplicates
      const exists = state.messages[conversationId].some(m => m._id === message._id);
      if (!exists) {
        state.messages[conversationId].push(message);
      }
      // Update conversation last message
      const conv = state.conversations.find(c => c._id === conversationId);
      if (conv) {
        conv.lastMessage = message;
        conv.updatedAt = message.createdAt;
      }
    },
    setUserOnline: (state, action) => {
      const { userId, isOnline, lastSeen } = action.payload;
      state.onlineUsers[userId] = { isOnline, lastSeen };
    },
    setTyping: (state, action) => {
      const { userId, conversationId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = {};
      }
      if (isTyping) {
        state.typingUsers[conversationId][userId] = true;
      } else {
        delete state.typingUsers[conversationId][userId];
      }
    },
    incrementUnread: (state, action) => {
      const { conversationId } = action.payload;
      const conv = state.conversations.find(c => c._id === conversationId);
      if (conv && conv._id !== state.activeConversation?._id) {
        conv.myUnreadCount = (conv.myUnreadCount || 0) + 1;
      }
    },
    clearUnread: (state, action) => {
      const conversationId = action.payload;
      const conv = state.conversations.find(c => c._id === conversationId);
      if (conv) conv.myUnreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => { state.loading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        const exists = state.messages[conversationId].some(m => m._id === message._id);
        if (!exists) {
          state.messages[conversationId].push(message);
        }
      })
      .addCase(getOrCreateConversation.fulfilled, (state, action) => {
        const exists = state.conversations.some(c => c._id === action.payload._id);
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
        state.activeConversation = action.payload;
      });
  },
});

export const {
  setActiveConversation, addMessage, setUserOnline, setTyping, incrementUnread, clearUnread
} = chatSlice.actions;
export default chatSlice.reducer;