'use strict';
import express from 'express';


import { validateAdminToken } from '../middlewares';


import {
 getAllNotification,
 getNotification,
 deviceRegistration,
 subscribe,
 Unsubscribe
} from '../../modules/notification/delivery/http';

const router = express.Router();

router.get('/notification/getNotification/:notification_id', validateAdminToken, getNotification);
router.get('/notification/get-all-notification/:page',validateAdminToken, getAllNotification);
router.post('/nofitication/device-registration', validateAdminToken, deviceRegistration);
router.post('/notification/subscribe-topic', validateAdminToken, subscribe);
router.post('/notification/unsubscribe-topic', validateAdminToken, Unsubscribe);


export default router;
