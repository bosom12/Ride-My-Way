import { Router } from 'express';
import user from './user';
import ride from './ride';
import request from './request';

const router = Router();

router.use('/user', user);
router.use('/ride', ride);
router.use('/request', request);

export default router;
