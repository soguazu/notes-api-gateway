import client from './grpc.client';
import HttpError from '../../helper/httpError';
import { publishToQueue } from '../../helper/rabbitmq';

export const tryApp = async function (userData) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.tryApp(userData, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
    await publishToQueue('verify-email', {
      email: user.email,
      first_name: user.name,
      link_url: `${process.env.CLIENT_URL}/verify-email?token=${user.token}}`,
    });
    return user;
  } catch (error) {
    if (error?.message?.includes('unique')) {
      throw new HttpError(409, 'user or company already exists');
    }
    throw error;
  }
};

export const signup = async function (userData) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.createUser(userData, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
    await publishToQueue('verify-email', {
      email: user.email,
      first_name: user.name,
      link_url: `${process.env.CLIENT_URL}/verify-email?token=${user.token}}`,
    });
    return user;
  } catch (error) {
    if (error?.message?.includes('unique')) {
      throw new HttpError(409, 'user or company already exists');
    }
    throw error;
  }
};

export const login = async function (userData) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.login(userData, (err, user) => {
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
    } else if (error?.message?.includes('not found')) {
      throw new HttpError(401, 'You have entered a wrong email or password.');
    }
    throw error;
  }
};
export const verifyEmail = async function (token) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.verifyEmail({ token }, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
    return user;
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, 'token not found');
    } else {
      throw new HttpError(400, 'Invalid token provided');
    }
  }
};
export const resendVerificationEmail = async function (email) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.resendVerificationEmail({ email }, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });

    await publishToQueue('verify-email', {
      email: user.email,
      first_name: user.name,
      link_url: `${process.env.CLIENT_URL}/verify-email?token=${user.token}}`,
    });

    return user;
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, "Email provided isn't registered.");
    }
    throw error;
  }
};
export const forgotPassword = async function (email) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.forgotPassword({ email }, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });

    await publishToQueue('reset-password', {
      email: user.email,
      first_name: user.name,
      link_url: `${process.env.CLIENT_URL}/verify-email?token=${user.token}}`,
    });
  } catch (error) {
    if (error?.message?.includes('not found')) {
      throw new HttpError(404, "Email provided isn't registered.");
    }
    throw error;
  }
};
export const resetPassword = async function (token, password) {
  try {
    const user = await new Promise((resolve, reject) => {
      client.resetPassword({ token, password }, (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
    await publishToQueue('reset-password-successful', {
      email: user.email,
      first_name: user.name,
    });
    return user;
  } catch (error) {
    if (error?.message?.includes('not found')) {
      console.log(error);
      throw new HttpError(400, 'Invalid token provided');
    }
    throw error;
  }
};
export const updatePassword = async function (req, res, next) {};
export const updateCompanyUser = async function (req, res, next) {};
