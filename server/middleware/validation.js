const validator = require('validator');

// Contact form validation
const validateContactForm = (req, res, next) => {
  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot spam trap - if filled, it's a bot
  if (botField) {
    return res.status(400).json({
      success: false,
      error: 'Spam detected'
    });
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required'
    });
  }

  // Validate name length
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({
      success: false,
      error: 'Name must be 2-50 characters'
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address'
    });
  }

  // Validate message length
  if (message.length < 10 || message.length > 2000) {
    return res.status(400).json({
      success: false,
      error: 'Message must be 10-2000 characters'
    });
  }

  // Sanitize inputs (remove dangerous characters)
  req.body.name = validator.escape(name.trim());
  req.body.email = validator.normalizeEmail(email.trim());
  req.body.message = validator.escape(message.trim());

  next();
};

module.exports = { validateContactForm };