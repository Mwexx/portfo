const express = require('express');
const router = express.Router();
const { validateContactForm } = require('../middleware/validation');

// Use WhatsApp sender instead of email
const { sendWhatsAppMessage } = require('../utils/whatsapp');

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
    // Send WhatsApp message with form data
    await sendWhatsAppMessage({ name, email, message });
    res.status(200).json({
      success: true,
      message: 'Message sent successfully via WhatsApp! I\'ll get back to you soon.'
    });
    console.log(`✅ WhatsApp message sent from: ${name} <${email}>`);
  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send WhatsApp message. Please try again later.'
    });
  }
});

module.exports = router;