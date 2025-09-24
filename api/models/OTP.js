const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for automatic cleanup of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Static method to create OTP for email
otpSchema.statics.createOTP = async function(email) {
  try {
    // Remove any existing OTPs for this email
    await this.deleteMany({ email });
    
    const otp = this.generateOTP();
    const otpRecord = new this({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    });
    
    await otpRecord.save();
    return otp;
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw new Error('Failed to create OTP');
  }
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp) {
  try {
    const otpRecord = await this.findOne({
      email,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    // Check attempts limit
    if (otpRecord.attempts >= 3) {
      await this.deleteOne({ _id: otpRecord._id });
      return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    // Mark as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to verify OTP' };
  }
};

module.exports = mongoose.model('OTP', otpSchema);
