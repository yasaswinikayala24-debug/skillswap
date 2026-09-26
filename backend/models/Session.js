const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    exchangeRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: [true, 'Exchange request ID is required']
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer user ID is required']
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Participant user ID is required']
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date and time is required']
    },
    duration: {
      type: Number,
      default: 60
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  },
  {
    timestamps: true
  }
);

sessionSchema.index({ organizer: 1, scheduledAt: 1 });
sessionSchema.index({ participant: 1, scheduledAt: 1 });
sessionSchema.index({ exchangeRequest: 1 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
