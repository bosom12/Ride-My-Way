import { Router } from 'express';
import request from '../controller/request';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/create/:driverId', verifyToken, request.requestRide);

router.get('/', verifyToken, request.getAllRequest);

router.get('/get/:driverId', verifyToken, request.getOneRequest);

router.get('/:driverId/toRide', verifyToken, request.getAllRequestToRide);

router.put('/update/:driverId', verifyToken, request.updateRequest);

router.delete('/delete/:driverId', verifyToken, request.deleteRequest);

export default router;
