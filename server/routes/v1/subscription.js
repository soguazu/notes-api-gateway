'use strict';
import express from 'express';
import { validateAdminToken } from '../middlewares';

import { verifyLicence } from '../../modules/subscription/delivery/https';

const router = express.Router();

router.post('/subscription/verify-license', verifyLicence);

export default router;
