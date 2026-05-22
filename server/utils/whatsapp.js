// utils/whatsapp.js
const twilio = require('twilio');

// Load from environment variables for security
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. 'whatsapp:+14155238886'
const whatsappTo = process.env.WHATSAPP_TO; // e.g. 'whatsapp:+254104081145'

const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async ({ name, email, message }) => {
  const body = `New Portfolio Inquiry\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
  try {
    const msg = await client.messages.create({
      from: whatsappFrom,
      to: whatsappTo,
      body
    });
    console.log('✅ WhatsApp message sent! SID:', msg.sid);
    return { success: true, sid: msg.sid };
  } catch (error) {
    console.error('❌ WhatsApp message failed:', error.message);
    throw new Error('Failed to send WhatsApp message.');
  }
};

module.exports = { sendWhatsAppMessage };