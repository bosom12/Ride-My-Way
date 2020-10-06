import { Form } from 'form-my-simple-validation';
import db from '../model';
import formSchema from '../validator/schema';

/**
 * @desc Request
 */
class Request {
  /**
   * @desc REQUEST RIDE
   * @param {*} req
   * @param {*} res
   * @return {object} JSON
   */
  static async requestRide(req, res) {
    try {
      const { _id } = req.user;
      const { rideId } = req.params;
      const { message } = req.body;

      /**
       * @desc VALIDATOR
       * @return {validatorResult} JSON
       */
      const validationResult = Form.validateFields(
        'requestRide',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const foundRide = await db.Ride.findOne({ _id: rideId });
      if (!foundRide) {
        return res
          .status(404)
          .json({ message: 'This ride does not exist' });
      }
      if (_id.equals(foundRide.driverId)) {
        return res
          .status(404)
          .json({ message: 'opps! sorry you cannot order your own ride' });
      }

      if (foundRide.seats < 1) {
        return res
          .status(404)
          .json({ message: 'opps! sorry there is no more space' });
      }

      const request = await db.Request.create({
        passengerId: _id, driverId: foundRide.driverId, rideId: foundRide._id, message
      });

      foundRide.seats -= 1;
      await foundRide.save();

      return res.status(201).json({
        message: 'Your request has been successfully created',
        data: request,
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc GET ALL REQUEST TO A RIDE
   * @param {object} req
   * @param {object} res
   * @return {object} JSON
   */
  static async getAllRequestToRide(req, res) {
    try {
      const { rideId } = req.params;
      const { _id: userId } = req.user;

      const request = await db.Request.find({ driverId: userId, rideId });

      if (!request.length) {
        return res.status(200).json({ message: 'No request yet' });
      }

      return res.status(200).json({ message: 'Successful', request });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  }
}

export default Request;
