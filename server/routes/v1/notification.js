'use strict';
import express from 'express';


import {
 getAllNotification,
 getNotification
} from '../../modules/notification/delivery/http';

const router = express.Router();

router.get('/notification/getNotification/:notification_id', getNotification);
router.get('/notification/get-all-notification/:page', getAllNotification);


export default router;
