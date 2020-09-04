import db from '../model';
import { Form } from 'form-my-simple-validation';
import formSchema from '../validator/schema';

/**
 * @desc Rides
 */

class Rides {
  /**
   * @desc GET ALL RIDES
   * @param {*} REQUEST
   * @param {*} RESPONSE
   * @return {obj} JSON
   */

  static async getAllRides(req, res) {
    try {
      const ride = await db.Ride.find({
        userId: req.user._id,
      }).sort({ createdAt: 'desc' });
      if (!ride.rideId.equals(userId)) {
        return res
          .status(400)
          .json({ message: 'Opps! sorry no available ride yet' });
      }
      if (!ride.rideId.equals(userId)) {
        return res.status(404).json({ message: 'ride does not belong to you' });
      }
      return res.status(200).json({ message: 'rides available', ride });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc GET ONE RIDE
   * @param {*} REQUEST
   * @param {*} RESPONSE
   * @return {obj} JSON
   */

  static async getOneRide(req, res) {
    try {
      const { rideId } = req.params;
      const { _id: userId } = req.user;

      const ride = await db.Ride.findOne({ rideId });
      if (!ride.rideId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Ride not found', status: 'failed', found: false });
      }

      if (!ride.rideId.equals(userId)) {
        return res.status(404).json({ message: 'ride does not belong to you' });
      }
      return res.status(200).json({
        message: 'One ride found',
        ride,
        status: 'success!',
        found: true,
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc CREATING RIDE OFFER
   * @param {*} REQUEST
   * @param {*} RESPONSE
   *  @return {obj} JSON
   */

  static async createRideOffer(req, res) {
    try {
      const { userId } = req.user;
      const {
        departure,
        destination,
        driver,
        seats,
        time,
        date,
        cost,
      } = req.body;

      /**
       * @desc VALIDATOR
       * @return {validatorResult} JSON
       */
      const validationResult = Form.validateFields(
        'createRide',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const findRide = await db.Ride.find({ userId });
      if (!findRide) {
        return res.status(404).json({ message: 'ride not found' });
      }
      const createRide = await db.Ride.create({
        userId: req.user._id,
        departure,
        destination,
        driver,
        seats,
        time,
        date,
        cost,
      });

      return res
        .status(201)
        .json({ message: 'ride is created successfully', data: createRide });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
}

export default Rides;
