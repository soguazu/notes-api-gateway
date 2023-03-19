'use strict';
import express from 'express';

import { validateAdminToken } from '../middlewares';
import { routeValidateUUID } from '../../helper/validate';
import { updateCompanyUser } from '../../modules/users/delivery/http';

const router = express.Router();

router.use(['/users'], validateAdminToken);

router.put('/users/:id', routeValidateUUID, updateCompanyUser);

export default router;
