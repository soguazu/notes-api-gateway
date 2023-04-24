'use strict';
import express from 'express';

import { validateAdminToken, validateSuperAdminToken } from '../middlewares';
import { routeValidateObjectId } from '../../helper/validate';
import {
  getPlans,
  getPlan,
  deletePlan,
  publishPlan,
  unPublishPlan,
  createPlan,
  updatePlan,
} from '../../modules/subscriptionPlan/delivery/https';

const router = express.Router();

router.get('/plans', getPlans);
router.get('/plans/:id', routeValidateObjectId, getPlan);
router.use(['/plans'], validateSuperAdminToken);

router.patch('/plans/:id/activate', routeValidateObjectId, publishPlan);
router.patch('/plans/:id/deactivate', routeValidateObjectId, unPublishPlan);
router.delete('/plans/:id', routeValidateObjectId, deletePlan);
router.patch('/plans/:id', routeValidateObjectId, updatePlan);
router.post('/plans', createPlan);

export default router;
