import Joi from 'joi';
import { validateRequest } from '../../../helper/validate';
import * as service from '../service';

const uploadFile = async (req, res, next) => {
  try {
    const data = await service.uploadFiles(req?.files);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getSignedUrl = async (req, res, next) => {
  try {
    const inputData = validateRequest(req, {
      filename: Joi.string().required(),
    });
    const data = await service.getSignedUrl(inputData?.filename);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export { uploadFile, getSignedUrl };
