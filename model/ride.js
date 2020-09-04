import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema(
  {
    userId: {
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
    driver: {
      type: String,
      trim: true,
      required: 'drivers name is required ',
    },
    seats: {
      type: String,
      required: 'seat is required',
    },
    cost: {
      type: String,
      required: 'cost is required',
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
