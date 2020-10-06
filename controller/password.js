import { Form } from 'form-my-simple-validation';
import { uuid } from 'uuidv4';
import db from '../model';
import formSchema from '../validator/schema';
import { send } from '../utils/mail';

/**
 * @desc Password
 */
class Password {
  /**
   * @desc FORGET PASSWORD
   * @param {*} req
   * @param {*} res
   * @return {*} JSON
   */
  static async forgetPassword(req, res) {
    try {
      const validationResult = Form.validateFields(
        'forgetPassword',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const foundUser = await db.User.findOne({ email: req.body.email });
      if (!foundUser) {
        return res.status(401).json({ message: 'email not found' });
      }

      const { email } = req.body;

      const host = req.get('Host');

      const origin = req.get('Origin');

      foundUser.resetPasswordToken = uuid();
      foundUser.resetPasswordExpire = Date.now() + 3600000;

      await foundUser.save();
      const resetURL = origin
        ? `${origin}/new-password?Reset_Token=${foundUser.resetPasswordToken}`
        : `${host}/api/user/reset-password?Reset_Token=${foundUser.resetPasswordToken}`;

      await send({
        email,
        subject: 'Reset Password',
        html: `<div>
          <p style="text-transform: capitalize;">Hi,</p>
          <p>You recently requested to reset your password. If this wasn't you, please ignore this mail.</p>
          <p>To reset your password</p>
          <p>
          Click or copy password link to a new tab: <a href='${resetURL}'>
          ${resetURL}</a>
          </p>
          <p>Have a great day.</p>
          </div>`,
      });

      return res
        .status(200)
        .json({ message: 'reset password link has been sent to your email' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc RESET PASSWORD
   * @param {*} req THE REQUEST OBJECT
   * @param {*} res THE RESPONSE OBJECT
   * @return {obj} JSON
   */
  static async resetPassword(req, res) {
    try {
      const validationResult = Form.validateFields(
        'resetPassword',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const user = await db.User.findOne({
        resetPasswordToken: req.query.Reset_Token,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: 'reset password token is invalid' });
      }
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.password = req.body.password;

      await user.save();

      return res
        .status(200)
        .json({ message: 'password reset successfully, proceed to login' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc VERIFICATION
   * @param {*} req
   * @param {*} res
   * @return {obj}JSON
   */
  static async verifyUser(req, res) {
    try {
      const user = await db.User.findOne({
        verifyToken: req.query.verify_Token,
        verifyExpire: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(401).json({ message: 'verify Token is invalid' });
      }
      user.verifyToken = undefined;
      user.verifyExpire = undefined;
      user.isVerified = true;

      await user.save();

      return res.status(200).json({ message: 'Account verify successfully' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }

  /**
   * @desc RESEND VERIFICATION
   * @param {*} req
   * @param {*} res
   * @return {obj}JSON
   */
  static async resendVerifyUser(req, res) {
    try {
      const validationResult = Form.validateFields(
        'resend-verify-token',
        formSchema,
        req.body
      );

      if (validationResult.error) {
        return res.status(400).json(validationResult);
      }

      const { email } = req.body;
      const user = await db.User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'email not found' });
      }
      const host = req.get('Host');

      const origin = req.get('Origin');

      const verifyToken = uuid();
      const verifyExpire = Date.now() + 3600000;

      const URL = origin
        ? `${origin}/verify?verify_Token=${verifyToken}`
        : `${host}/api/user/verify?verify_Token=${verifyToken}`;
      await send({
        email,
        subject: 'verify account',
        html: `<div>
      <p style="text-transform: capitalize;">Hi ${user.fullName},</p>
      <p>you are one click away to complete your registration.</p>
      <p>kindly click the link to verify you account ${URL}</p>
      </div>`,
      });
      user.verifyToken = verifyToken;
      user.verifyExpire = verifyExpire;

      await user.save();

      return res
        .status(200)
        .json({ message: 'verification mail has been sent to your email' });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  }
}

export default Password;
