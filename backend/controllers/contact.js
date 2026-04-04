const { validationResult } = require('express-validator');
const { sendContactEmail } = require('../utils/email');

const sendContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, subject, message } = req.body;

    await sendContactEmail({ name, email, subject, message });

    res.json({ message: 'Your message has been sent successfully! We will get back to you soon.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};

module.exports = { sendContact };