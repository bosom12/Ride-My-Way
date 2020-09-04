import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import userController from '../controller/user';
import passController from '../controller/password';

const router = Router();

router.post('/create', userController.createUserAccount);

router.post('/forget', passController.forgetPassword);

router.put('/reset-password', passController.resetPassword);

router.post('/login', userController.loginUser);

router.patch('/verify', passController.verifyUser);

router.post('/verify/resend', passController.resendVerifyUser);

router.delete('/', verifyToken, userController.deleteAccount);

export default router;
