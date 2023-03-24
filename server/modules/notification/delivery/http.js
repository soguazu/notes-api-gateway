'use strict';
import * as service from '../service';
import HttpError from '../../../helper/httpError';

const getNotification = async function (req, res, next) {
  try {

    const data = await service.getNotification(req.params.notification_id, req.query.user_id); 

    res.json({
      success: true,
      message:
        'Notification retrieved successfully.',
      data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getAllNotification = async function (req, res, next) {
  try {

    console.log(req.query.user_id)
    console.log(req.params.page);

    const data = await service.getAllNotification(req.params.page, req.query.user_id);
    // Log action

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


export {
  getNotification,
  getAllNotification
};
