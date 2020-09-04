import { Router } from 'express';
import ride from '../controller/ride';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/', verifyToken, ride.getAllRides);

router.get('/:rideId', verifyToken, ride.getOneRide);

router.post('/create', verifyToken, ride.createRideOffer);

export default router;
