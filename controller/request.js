import db from '../model';
import { Form } from 'form-my-simple-validation';
import formSchema from '../validator/schema';

/**
 * @desc Request
 */

class Request {
  /**
   * @desc REQUEST RIDE
   * @params {*}REQUEST
   * @Params {*}RESPONSE
   * @return {obj}JSON
   */

  static async requestRide(req, res) {
    try {
      const { userId } = req.user;
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

      const foundRide = await db.Request.find({ rideId });
      if (!foundRide) {
        return res
          .status(404)
          .json({ message: 'Request not find with this rideId' });
      }
      if (userId.equals(foundRide.userId)) {
        return res
          .status(404)
          .json({ message: 'opps! sorry you cannot order your own ride' });
      }

      return res.status(201).json({
        message: 'Your request has been successfully sent',
        data: message,
      });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc GET REQUEST
   * @params {*} REQUEST
   * @params {*} RESPONSE
   * @return {obj} JSON
   */

  static async getAllRequest(req, res) {
    try {
      const AllRequest = await db.Request.find({
        userId: req.user._id,
      }).sort({ createdAt: 'desc' });
      if (!AllRequest.driverId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Request does not belong to you' });
      }

      return res.status(200).json({ message: 'All request retrieved' });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  }
  /**
   * @desc GET ONE REQUEST
   * @params {*}REQUEST
   * @params {*}RESPONSE
   * @return {OBJ}JSON
   */

  static async getOneRequest(req, res) {
    try {
      const { rideId } = req.params;
      const { _id: userId } = req.user;

      const oneRequest = db.Request.findOne({ _id: rideId });

      if (!oneRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (!oneRequest.driverId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Request does not belong to you' });
      }

      return res
        .status(200)
        .json({ success: true, message: 'One request found', oneRequest });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc GET ALL REQUEST TO A RIDE
   * @params {} REQUEST
   * @params {} RESPONSE
   * @return {obj}JSON
   */

  static async getAllRequestToRide(req, res) {
    try {
      const { rideId } = req.params;
      const { userId } = req.user;

      const request = db.Request.find({ rideId });

      if (!request) {
        return res.status(404).json({ message: 'Request not find' });
      }

      if (!request.driverId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Request does not belong to you' });
      }

      return res.status(200).json({ message: 'Request found', request });
    } catch (error) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  static async updateRequest(req, res) {
    try {
      const { rideId } = req.params;
      const { _Id: userId } = req.user;
      const { action } = req.body;

      /**
       * @desc VALIDATOR
       * @return {validatorResult} JSON
       */
      const validationResult = Form.validateFields(
        'updateRide',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const foundRequest = await db.Request.findOne({ rideId });

      if (!foundRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (!foundRequest.driverId.equals(userId)) {
        return res
          .status(404)
          .json({ message: 'Request does not belong to you' });
      }
      const availableSeats = [];
      if (availableSeats.length.equals(driverId) > 4) {
        return res
          .status(404)
          .json({ message: 'No available slots for this ride' });
      } else if (availableSeats.length.equals(driverId) < 4) {
        return res.status(200).json({ message: 'Request Accepted' });
      }
      foundRequest.action = action || foundRequest.action;
      await foundRequest.save();

      return res
        .status(200)
        .json({ message: 'Your request has been updated successfully!' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc DELETE REQUEST
   * @params {*}REQUEST
   * @params {*}RESPONSE
   * @return {OBJ}JSON
   */

  static async deleteRequest(req, res) {
    try {
      const { rideId } = req.params;
      const { _id: userId } = req.user;

      const foundReq = await db.Request.findOne({ rideId });
      if (!foundReq) {
        return res.status(404).json({ message: 'Request not found' });
      }
      if (!foundRequest.driverId.equals(userId)) {
        return res.status(404).json({ message: 'Ride does not belong to you' });
      }
      await db.Request.findOneAndRemove({ userId, _id: rideId });

      return res
        .status(200)
        .json({ message: 'Request is successfully deleted' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
}

export default Request;
