import db from '../model/';
import { Form } from 'form-my-simple-validation';
import formSchema from '../validator/schema';
import { uuid } from 'uuidv4';
import { send } from '../utils/mail';
import * as Utils from '../utils/helpers';

/**
 * @desc CLASS
 */
class User {
  /**
   * @desc CREATING USER ACCOUNT
   * @param {*} REQUEST
   * @param {*} RESPONSE
   *  @return {obj} JSON
   */
  static async createUserAccount(req, res) {
    try {
      const { fullName, username, phoneNumber, email, password } = req.body;

      /**
       * @desc VALIDATE ACCOUNT
       * @return {validatorResult} JSON
       */

      // const validationResult = Form.validateFields(
      //   'signUp',
      //   formSchema,
      //   req.body
      // );

      // if (validationResult.error) {
      //   return res.status(400).json(validationResult);
      // }

      const foundUser = await db.User.findOne({ email });

      if (foundUser) {
        return res
          .status(401)
          .json({ error: true, message: 'user already exist' });
      }

      const user = await db.User.create({
        fullName,
        username,
        phoneNumber,
        email,
        password,
      });
      // const origin = 'origin';

      // const host = 'host';

      //SEND VERIFICATION LINK
      // const verifyToken = uuid();

      // const verifyExpire = Date.now() + 3600000;
      // user.verifyToken = verifyToken;
      // user.verifyExpire = verifyExpire;
      // await user.save();

      // const URL = origin
      //   ? `${origin}/verify?verify_Token=${user.verifyToken}`
      //   : `${host}/api/user/verify?verify_Token=${user.verifyToken}`;
      // await send({
      //   email,
      //   subject: 'verify account',
      //   html: `<div>
      //   <p style="text-transform: capitalize;">Hi ${fullName},</p>
      //   <p>you are one click away to complete our registration.</p>
      //   <p>please kindly click the link to verify your account : <a href="${URL}">${URL}</a></p>
      //   <p>Have a great day.</p>
      //   </div>`,
      // });

      return res.status(201).json({
        message: 'Signup successful',
        user,
      });
      // return res.status(201).json({
      //   message:
      //     'A link has been sent to your email address to verify your account',
      //   user,
      // });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc LOGIN USER
   * @param {*} REQUEST
   * @param {*} RESPONSE
   * @return {obj} JSON
   */

  static async loginUser(req, res) {
    try {
      const { dataField, password } = req.body;

      /**
       * @desc VALIDATE ACCOUNT
       * @return {validatorResult} JSON
       */
      const validationResult = Form.validateFields(
        'login',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      let user = null;

      const isPhone = Utils.isPhoneNumber(dataField);

      // QUERY DATABASE
      if (!isPhone) {
        user = await db.User.findOne(db.Users, { email: dataField });
      } else {
        user = await db.User.findOne(db.Users, { PhoneNumber: dataField });
      }

      if (user) {
        console.log(user)
        const passwordMatch = await user.comparePassword(password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'password incorrect' });
        }
        /**
         * @desc GENERATE TOKEN FOR AUTHORIZATION
         * @returns {String} void
         */
        const token = Utils.generateToken({ id: user._id });

        return res.status(200).json({
          message: 'Account is successfully logged in',
          user,
          token,
        });
      }

      return res
        .status(400)
        .json({
          message: `${
            isPhone ? 'Phone number is incorrect' : 'Email is incorrect'
          }`,
        });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc DELETE USER ACCOUNT
   * @param {*} req The request object
   * @param {*} req The response object
   * @return {obj}JSON
   */
  static async deleteAccount(req, res) {
    try {
      const { _id: userId } = req.user;

      const foundUser = await db.User.findOne({ _id: userId });
      if (!foundUser) {
        return res.status(404).json({ message: 'user not found' });
      }
      const user = await db.User.findByIdAndRemove(userId);

      return res
        .status(200)
        .json({ message: 'Account deleted successfully', user });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
}

export default User;
