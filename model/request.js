import mongoose from 'mongoose';

const requestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rideId: {
      type: String,
      trim: true,
      required: 'rideId is required',
    },
    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const requestUser = mongoose.model('Request', requestSchema);

export default requestUser;
