const Joi = require('joi');

const service = require('../service');

const {
  validateRequest,
  getPaginationValidationProps,
} = require('../../../helper/validate');

const getPlans = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      isFree: Joi.boolean().optional(),
      isUnlimited: Joi.boolean().optional(),
      isPublished: Joi.boolean().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      ...getPaginationValidationProps(true, ['name', 'createdAt']),
    });

    const { skip, limit, sortField, sortOrder, ...filter } = inputData;

    const data = await service.getPlans(
      filter,
      skip,
      limit,
      sortField,
      sortOrder,
      true
    );
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getPlan = async function (req, res, next) {
  console.log('got here');
  try {
    const inputData = validateRequest(req, {
      id: Joi.string().required(),
    });

    const data = await service.getPlan(inputData.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const publishPlan = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      id: Joi.string().required(),
    });

    await service.publishPlan(inputData.id);
    res.json({
      success: true,
      message: 'Plan published successfully!',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const unPublishPlan = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      id: Joi.string().required(),
    });

    await service.unPublishPlan(inputData.id);
    res.json({
      success: true,
      message: 'Plan unpublished successfully!',
    });
  } catch (error) {
    next(error);
  }
};

const deletePlan = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      id: Joi.string().required(),
    });

    await service.deletePlan(inputData.id);
    res.json({
      success: true,
      message: 'Plan deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

const createPlan = async function (req, res, next) {
  try {
    const { isUnlimited } = req.body;
    const inputData = validateRequest(
      req,
      getPlanValidationRules(false, isUnlimited)
    );

    const data = await service.createPlan(inputData);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const updatePlan = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      id: Joi.string().required(),
      ...getPlanValidationRules(true),
    });

    const data = await service.updatePlan(inputData);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

function getPlanValidationRules(isEdit = false, isUnlimited = false) {
  const priceRule = isUnlimited
    ? Joi.object()
        .keys({
          currency: Joi.string().required().valid('NGN', 'USD'),
          amount: Joi.number().required().min(1),
          upFront: Joi.number().required().min(1),
        })
        .required()
    : Joi.object().optional();

  return {
    name: isEdit ? Joi.string().optional() : Joi.string().required(),
    description: Joi.string().optional(),
    prices: Joi.object()
      .keys({
        monthly: priceRule,
        yearly: priceRule,
      })
      .optional()
      .allow(null)
      .error(new Error('Monthly and yearly prices must be provided')),
    limits: Joi.object()
      .keys({
        forms: Joi.number().required().min(1),
        entries: Joi.number().required().min(1),
      })
      .optional()
      .allow(null),
    isUnlimited: Joi.boolean().strict().optional(),
    isPublished: Joi.boolean().strict().optional(),
    isFree: Joi.boolean().strict().optional(),
    planType: Joi.string(),
    trialDayPeriod: Joi.number(),
    feature: Joi.object()
      .keys({
        facility: Joi.string().optional().valid('1', '10', 'Unlimited'),
        asset: Joi.object()
          .keys({
            manpower: Joi.string()
              .required()
              .valid('2', '10', '100', 'Unlimited')
              .default('2'),
            machines: Joi.string()
              .required()
              .valid('5', '100', '1000', 'Unlimited')
              .default('5'),
            materials: Joi.string()
              .required()
              .valid('5', '1000', '10000', 'Unlimited')
              .default('5'),
          })
          .optional()
          .allow(null),
        maintenance: Joi.object()
          .keys({
            work: Joi.string()
              .required()
              .valid('10', 'Unlimited')
              .default('10'),
            workOrderLifecycle: Joi.string()
              .required()
              .valid('Not customizable', 'Customizable')
              .default('Not customizable'),
            correctiveMaintenance: Joi.string()
              .required()
              .valid('Yes', 'No')
              .default('Yes'),
            preventiveMaintenance: Joi.string()
              .required()
              .valid('Yes', 'No')
              .default('Yes'),
            predictiveMaintenance: Joi.string()
              .required()
              .valid('Yes', 'No')
              .default('No'),
            prescriptiveMaintenance: Joi.string()
              .required()
              .valid('Yes', 'No')
              .default('No'),
          })
          .optional()
          .allow(null),
        dashboard: Joi.object()
          .keys({
            notes: Joi.string().required().valid('5', 'Unlimited').default('5'),
            agenda: Joi.string()
              .required()
              .valid('Not customizable', 'Customizable')
              .default('Not customizable'),
            safetyMap: Joi.string().required().valid('Yes', 'No').default('No'),
            calendar: Joi.string()
              .required()
              .valid('Not customizable', 'Customizable')
              .default('Not customizable'),
            highlight: Joi.string()
              .required()
              .valid('5', '20', '50', 'Unlimited')
              .default('5'),
            notification: Joi.string()
              .required()
              .valid('Yes', 'No')
              .default('No'),
            digitalSignatures: Joi.string()
              .required()
              .valid('Yes', 'No')
              .default('No'),
          })
          .optional()
          .allow(null),
        ePTW: Joi.object()
          .keys({
            HWP: Joi.string().required().valid('Yes', 'No').default('No'),
            CWP: Joi.string().required().valid('Yes', 'No').default('No'),
            permitTemplate: Joi.string()
              .required()
              .valid('Not customizable', 'Customizable')
              .default('Not customizable'),
            riskAssessment: Joi.string()
              .required()
              .valid('Yes', 'No')
              .default('No'),
            isolation: Joi.object()
              .keys({
                developmentCentre: Joi.string()
                  .required()
                  .valid('Standard', 'Ultimate')
                  .default('Standard'),
                b2BMarketPlace: Joi.string()
                  .required()
                  .valid('Standard', 'Ultimate')
                  .default('Standard'),
                finance: Joi.string()
                  .required()
                  .valid('Standard', 'Ultimate')
                  .default('Standard'),
              })
              .optional()
              .allow(null),
          })
          .optional()
          .allow(null),
      })
      .optional()
      .allow(null),
  };
}

export {
  getPlans,
  getPlan,
  publishPlan,
  unPublishPlan,
  deletePlan,
  createPlan,
  updatePlan,
};
