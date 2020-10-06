import { Form } from 'form-my-simple-validation';
import db from '../model';
import formSchema from '../validator/schema';

/**
 * @desc Rides
 */
class Rides {
  /**
   * @desc GET ALL RIDES
   * @param {object} req
   * @param {object} res
   * @return {object} JSON
   */
  static async getAllRides(req, res) {
    try {
      const ride = await db.Ride.find({}).sort({ createdAt: 'desc' });

      if (!ride.length) {
        return res
          .status(200)
          .json({ message: 'Opps! sorry no available ride yet' });
      }
      return res.status(200).json({ message: 'Successful', ride });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc GET ONE RIDES
   * @param {object} req
   * @param {object} res
   * @return {object} JSON
   */
  static async getOneRide(req, res) {
    try {
      const { rideId } = req.params;

      const ride = await db.Ride.findOne({ _id: rideId });
      if (!ride) {
        return res
          .status(404)
          .json({ message: 'Ride not found', status: 'failed', found: false });
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
   * @desc CREATE RIDES
   * @param {object} req
   * @param {object} res
   * @return {object} JSON
   */
  static async createRideOffer(req, res) {
    try {
      const { _id: driverId } = req.user;
      const {
        departure,
        destination,
        message,
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
      const createRide = await db.Ride.create({
        driverId,
        departure,
        destination,
        message,
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

  /**
   * @desc DELETE RIDES OFFERS
   * @param {object} req
   * @param {object} res
   * @return {object} JSON
   */
  static async deleteRideOffer(req, res) {
    try {
      const { _id: driverId } = req.user;
      const { rideId } = req.params;

      const ride = await db.Ride.findOne({ driverId, _id: rideId });

      if (!ride) {
        return res.status(400).json({ message: 'This ride does not belong to you or does not exist' });
      }
      await db.Ride.findOneAndDelete({ _id: rideId });

      return res.status(200).json({ message: 'Ride deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
}

export default Rides;
