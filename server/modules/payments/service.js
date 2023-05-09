import client from './grpc.client';
import HttpError from '../../helper/httpError';
import { publishToQueue } from '../../helper/rabbitmq';

export const initializePayment = async function (inputData) {
  try {
    return await new Promise((resolve, reject) => {
      client.initializePayment(inputData, (err, payload) => {
        if (err) {
          reject(err);
        }
        resolve(payload);
      });
    });
  } catch (error) {
    throw error;
  }
};

export const verifyPayment = async function (inputData) {
  try {
    const subscription = await new Promise((resolve, reject) => {
      client.verifyPayment(inputData, (err, payload) => {
        if (err) {
          reject(err);
        }
        resolve(payload);
      });
    });

    if (Object.keys(subscription).length) {
      await publishToQueue('subscription-successful', {
        email: subscription.email,
        licenseKey: subscription.license,
      });
    }
    return subscription;
  } catch (error) {
    if (error?.message?.includes('Payment failed')) {
      throw new HttpError(400, 'Payment failed, please try again');
    }
    throw error;
  }
};
