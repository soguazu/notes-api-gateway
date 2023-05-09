'use strict';
import express from 'express';
import { validateAdminToken } from '../middlewares';

import {
  initializePayment,
  verifyPayment,
} from '../../modules/payments/delivery/https';

const router = express.Router();

router.post('/payments/initialize', initializePayment);
router.post('/payments/verify', verifyPayment);

export default router;
