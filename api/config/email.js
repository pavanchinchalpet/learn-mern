const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log('Attempting to send OTP email to:', email);
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'MERN Quest - Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎮 MERN Quest</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Learning Adventure Awaits</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; text-align: center;">Login Verification Code</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Hello! You requested a login verification code for your MERN Quest account.
            </p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; border: 2px solid #6366f1; text-align: center; margin: 25px 0;">
              <p style="color: #475569; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <div style="font-size: 32px; font-weight: bold; color: #6366f1; letter-spacing: 5px; font-family: monospace;">${otp}</div>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 25px 0;">
              <strong>Important:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>Security Tip:</strong> Never share this code with anyone. MERN Quest will never ask for your verification code via email or phone.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              This email was sent from MERN Quest Learning Platform<br>
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail
};
