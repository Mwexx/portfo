const express = require('express');
const router = express.Router();
const { validateContactForm } = require('../middleware/validation');
const { sendContactEmail } = require('../utils/email');

// Health check endpoint - test if server is running
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Backend server is running perfectly!'
  });
});

// Contact form submission endpoint
router.post('/contact', validateContactForm, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Send email with form data
    await sendContactEmail({ name, email, message });
    
    // Success response to frontend
    res.status(200).json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.'
    });
    
    console.log(`✅ New message from: ${name} <${email}>`);
    
  } catch (error) {
    console.error('Contact form error:', error.message);
    
    // Send helpful error to frontend
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send message. Please try again later.'
    });
  }
});

module.exports = router;