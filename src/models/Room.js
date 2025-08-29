import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['basic', 'premium'],
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  features: [{
    type: String
  }],
  image: {
    type: String,
    default: 'default-room.png'
  },
  status: {
    type: String,
    enum: ['available', 'occupied'],
    default: 'available'
  },
  currentBooking: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startTime: Date,
    endTime: Date,
    duration: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Room = mongoose.model('Room', roomSchema);
