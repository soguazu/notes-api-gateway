'use strict';
import express from 'express';
import { validateAdminToken } from '../middlewares';

import {
  signup,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  tryApp,
} from '../../modules/users/delivery/http';

const router = express.Router();

router.post('/auth/try', tryApp);
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/verify-email', verifyEmail);
router.post('/auth/resend-verification-mail', resendVerificationEmail);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// Authenticated Endpoints

router.use(['/auth/update-password'], validateAdminToken);

router.post('/auth/update-password', updatePassword);

export default router;
