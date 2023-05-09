import client from './grpc.client';
import HttpError from '../../helper/httpError';
import { publishToQueue } from '../../helper/rabbitmq';

export const verifyLicence = async function (inputData) {
  try {
    return await new Promise((resolve, reject) => {
      client.verifyLicence(inputData, (err, payload) => {
        if (err) {
          reject(err);
        }
        resolve(payload);
      });
    });
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, 'Subscription not found');
    }
    throw error;
  }
};
