import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    departure: {
      type: String,
      trim: true,
      required: ' departure is required ',
    },
    destination: {
      type: String,
      trim: true,
      required: 'destination is required',
    },
    message: {
      type: String,
      trim: true,
      required: 'message is required ',
    },
    seats: {
      type: Number,
      default: 0
    },
    cost: {
      type: Number,
      default: 0.00
    },
    time: {
      type: String,
      required: 'time is required',
    },
    date: {
      type: String,
      required: 'date is required',
    },
  },
  {
    timestamps: true,
  }
);

const rideUser = mongoose.model('Ride', RideSchema);

export default rideUser;
