import client from './grpc.client';
import HttpError from '../../helper/httpError';

export const getPlans = async function (
  filter,
  skip,
  limit,
  sortField,
  sortOrder,
  includeCount = false
) {
  try {
    return await new Promise((resolve, reject) => {
      client.getPlans(
        { filter, skip, limit, sortField, sortOrder, includeCount },
        (err, plans) => {
          if (err) {
            reject(err);
          }
          resolve(plans);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export const getPlan = async (id) => {
  try {
    return await new Promise((resolve, reject) => {
      client.getPlan({ id }, (err, plan) => {
        if (err) {
          reject(err);
        }
        resolve(plan);
      });
    });
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, 'plan not found');
    }
    throw error;
  }
};

export const publishPlan = async (id) => {
  try {
    return await new Promise((resolve, reject) => {
      client.publishPlan({ id }, (err, plan) => {
        if (err) {
          reject(err);
        }
        resolve(plan);
      });
    });
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, 'plan not found');
    } else if (error.message?.includes('INVALID_ARGUMENT')) {
      throw new HttpError(400, 'Plan is already published');
    }
    throw error;
  }
};

export const unPublishPlan = async (id) => {
  try {
    return await new Promise((resolve, reject) => {
      client.unPublishPlan({ id }, (err, plan) => {
        if (err) {
          reject(err);
        }
        resolve(plan);
      });
    });
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, 'plan not found');
    } else if (error.message?.includes('INVALID_ARGUMENT')) {
      throw new HttpError(400, 'Plan is already unpublished');
    }
    throw error;
  }
};

export const deletePlan = async (id) => {
  try {
    return await new Promise((resolve, reject) => {
      client.deletePlan({ id }, (err, plan) => {
        if (err) {
          reject(err);
        }
        resolve(plan);
      });
    });
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, 'plan not found');
    }
    throw error;
  }
};

export const createPlan = async (planData) => {
  try {
    await validatePlan(planData);

    return await new Promise((resolve, reject) => {
      client.createPlan(planData, (err, plan) => {
        if (err) {
          reject(err);
        }
        resolve(plan);
      });
    });
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, 'plan not found');
    }
    throw error;
  }
};

export const updatePlan = async (planData) => {
  try {
    return await new Promise((resolve, reject) => {
      client.updatePlan(planData, (err, plan) => {
        if (err) {
          reject(err);
        }
        resolve(plan);
      });
    });
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, 'plan not found');
    }
    throw error;
  }
};

async function validatePlan(plan) {
  /**
   * Validation rules:
   * - Free plan must have limits but cannot have prices
   * - Unlimited plans cannot have limits but can have prices (optional)
   * - Other plans must have both limits and prices
   */

  if (plan.isFree && plan.prices) {
    throw new HttpError(400, 'Free plan cannot have prices');
  }

  // if (plan.isUnlimited) {
  //   if (plan.limits) {
  //     throw new HttpError(400, 'Unlimited plan cannot have limitations');
  //   }
  //   return;
  // }

  if (!plan.isFree && !plan.prices) {
    throw new HttpError(400, 'Price is required for this plan');
  }
  // else if (!plan.limits) {
  //   throw new HttpError(400, 'Plan limitations is required');
  // }
}
