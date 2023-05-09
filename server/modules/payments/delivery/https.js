const Joi = require('joi');

const service = require('../service');

const {
  validateRequest,
  getPaginationValidationProps,
} = require('../../../helper/validate');

const initializePayment = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      noOfUsers: Joi.number().required(),
      plan: Joi.string().required(),
      email: Joi.string().required(),
      frequency: Joi.string()
        .default('yearly')
        .valid('monthly', 'yearly', 'custom'),
      paymentType: Joi.string()
        .default('INITIAL_PAYMENT')
        .valid('INITIAL_PAYMENT', 'UPGRADE_PAYMENT', 'RENEWAL_PAYMENT'),
      purpose: Joi.string()
        .default('SUBSCRIPTION')
        .valid('SUBSCRIPTION', 'MARKET_PLACE'),
    });

    const data = await service.initializePayment(inputData);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      reference: Joi.string().required(),
    });

    const data = await service.verifyPayment(inputData);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export { initializePayment, verifyPayment };
