const { Message, Conversation } = require('../models/Chat');

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar isOnline lastSeen')
      .populate('lastMessage')
      .populate('listing', 'title images price status')
      .sort({ updatedAt: -1 })
      .lean();

    // Add unread count for current user
    const withUnread = conversations.map(conv => ({
      ...conv,
      myUnreadCount: conv.unreadCount?.[req.user._id.toString()] || 0,
      otherParticipant: conv.participants.find(p => p._id.toString() !== req.user._id.toString()),
    }));

    res.json({ conversations: withUnread });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrCreateConversation = async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot chat with yourself.' });
    }

    // Find existing conversation for same participants and listing
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] },
      listing: listingId || { $exists: false },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId],
        listing: listingId || undefined,
      });
    }

    await conversation.populate('participants', 'name avatar isOnline lastSeen');
    await conversation.populate('listing', 'title images price status');

    res.json({ conversation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    // Verify user is a participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [messages, total] = await Promise.all([
      Message.find({ conversation: conversationId })
        .populate('sender', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Message.countDocuments({ conversation: conversationId }),
    ]);

    // Mark messages as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    // Reset unread count for this user
    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();

    res.json({
      messages: messages.reverse(),
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content: content.trim(),
    });

    await message.populate('sender', 'name avatar');

    // Update conversation last message and unread counts
    conversation.lastMessage = message._id;
    const otherParticipants = conversation.participants.filter(
      p => p.toString() !== req.user._id.toString()
    );
    for (const participantId of otherParticipants) {
      const key = participantId.toString();
      conversation.unreadCount.set(key, (conversation.unreadCount.get(key) || 0) + 1);
    }
    await conversation.save();

    // Emit via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('new_message', message);
      // Notify other participants
      for (const participantId of otherParticipants) {
        io.to(`user:${participantId}`).emit('message_notification', {
          conversationId,
          message,
        });
      }
    }

    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getConversations, getOrCreateConversation, getMessages, sendMessage };