const express = require('express');
const { body } = require('express-validator');
const { sendContact } = require('../controllers/contact');

const router = express.Router();

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ min: 3, max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }),
], sendContact);

module.exports = router;