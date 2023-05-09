import client from './grpc.client';
import HttpError from '../../helper/httpError';

export const getNotification = async function (notification_id, user_id) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.getNotification({notification_id, user_id}, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });

    console.log(user);
    return user;
  } catch (error) {
    if (error?.message?.includes('unique')) {
      throw new HttpError(409, 'user or company already exists');
    }
    throw error;
  }
};

export const getAllNotification = async function (page, user_id) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.getAllNotification({page, user_id}, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
    return user;
  } catch (error) {
    if (error?.message?.includes('wrong email or password')) {
      throw new HttpError(401, 'You have entered a wrong email or password.');
    }
    throw error;
  }
};

export const createDeviceRegistration = async function (user_id, deviceToken) {
  try {

    const user = await new Promise((resolve, reject) => {
      client.postDeviceRegistration({user_id, deviceToken}, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      })
    });

    return user;
    
  } catch (error) {
    if (error?.message?.includes('wrong email or password')) {
      throw new HttpError(401, 'You have entered a wrong email or password.');
    }
    throw error;
  }
}

export const subscribeDevice = async function (deviceToken, topic) {
  try {

    const user = await new Promise((resolve, reject) => {
      client.postSubscribeTopic({deviceToken, topic}, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      })
    });

    return user;
    
  } catch (error) {
    if (error?.message?.includes('wrong email or password')) {
      throw new HttpError(401, 'You have entered a wrong email or password.');
    }
    throw error;
  }
}

export const UnSubscribeDevice = async function (topic) {
  try {

    const user = await new Promise((resolve, reject) => {
      client.postUnsubscribeTopic({topic}, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      })
    });

    return user;
    
  } catch (error) {
    if (error?.message?.includes('wrong email or password')) {
      throw new HttpError(401, 'You have entered a wrong email or password.');
    }
    throw error;
  }
}

