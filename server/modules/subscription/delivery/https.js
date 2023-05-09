const Joi = require('joi');

const service = require('../service');

const {
  validateRequest,
  getPaginationValidationProps,
} = require('../../../helper/validate');

const verifyLicence = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      license: Joi.string().required(),
    });

    const data = await service.verifyLicence(inputData);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export { verifyLicence };
