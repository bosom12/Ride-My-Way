import { Router } from 'express';
import request from '../controller/request';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/create/:rideId', verifyToken, request.requestRide);

router.get('/ride', verifyToken, request.getAllRequestToRide);

export default router;
