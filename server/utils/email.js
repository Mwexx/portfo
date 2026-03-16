const nodemailer = require('nodemailer');

// 🔴 EMAIL CONFIGURATION - Uses values from .env file
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection configuration
transporter.verify(function(error) {
  if (error) {
    console.error('⚠️ EMAIL SETUP ERROR:', error);
    console.error('💡 Check your .env file email settings!');
  } else {
    console.log('✅ Email server ready to send messages');
  }
});

// Send contact form email
const sendContactEmail = async (formData) => {
  const { name, email, message } = formData;
  
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `New Contact Form: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background: #ffffff;">
        <h2 style="color: #2563eb; margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">New Contact Form Submission</h2>
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 8px 0;"><strong style="color: #0f172a;">Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong style="color: #0f172a;">Email:</strong> <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></p>
        </div>
        <h3 style="color: #0f172a; margin: 25px 0 10px 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">Message</h3>
        <p style="line-height: 1.6; color: #1e293b; background: #f8fafc; padding: 15px; border-radius: 6px;">${message.replace(/\n/g, '<br>')}</p>
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 0.9em; text-align: center; margin-top: 20px;">
          Sent from your portfolio website • ${new Date().toLocaleString()}
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully! ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error('Failed to send email. Please check your email settings.');
  }
};

module.exports = { sendContactEmail };