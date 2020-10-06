import { Router } from 'express';
import ride from '../controller/ride';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/', ride.getAllRides);

router.get('/:rideId', ride.getOneRide);

router.post('/create', verifyToken, ride.createRideOffer);

router.delete('/delete/:rideId', verifyToken, ride.deleteRideOffer);

export default router;
