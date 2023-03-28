'use strict';
import Joi from 'joi';
import {
  validateRequest,
  validateRequestWithCustomSchema,
} from '../../../helper/validate';
import * as service from '../service';
import HttpError from '../../../helper/httpError';

const signup = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      name: Joi.string().required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().min(8).required(),
      role: Joi.string()
        .valid('OPERATOR', 'LINE_SUPERINTENDENT', 'UNIT_SUPERINTENDENT')
        .optional(),
      license: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required(),
      company: Joi.string().required(),
      recoveryEmail: Joi.string().email({ minDomainSegments: 2 }).optional(),
      description: Joi.string().optional(),
      pictureUrl: Joi.string().uri().optional(),
    });

    const data = await service.signup(inputData);

    res.json({
      success: true,
      message:
        'Registration successful. Check your email to verify your account.',
      data,
    });
  } catch (error) {
    // console.log(error, '*****');
    next(error);
  }
};
const login = async function (req, res, next) {
  try {
    const inputData = validateRequestWithCustomSchema(
      req,
      Joi.object()
        .keys({
          email: Joi.string().email({ minDomainSegments: 2 }).required(),
          password: Joi.string().min(8).required(),
        })
        .error(
          new HttpError(401, 'You have entered a wrong email or password.')
        )
    );

    const data = await service.login(inputData);
    // Log action
    req.user = { id: data.id, company: data.companyId };

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
const verifyEmail = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      token: Joi.string().required(),
    });
    const data = await service.verifyEmail(inputData.token);
    res.json({
      success: true,
      message: 'Email verified successfully.',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
const resendVerificationEmail = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
    });

    await service.resendVerificationEmail(inputData.email);
    res.json({
      success: true,
      message: 'Check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
};
const forgotPassword = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      email: Joi.string().required(),
    });

    await service.forgotPassword(inputData.email);

    res.json({
      success: true,
      message: 'Check your email to reset your password.',
    });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async function (req, res, next) {
  try {
    const inputData = validateRequest(req, {
      token: Joi.string().required(),
      newPassword: Joi.string().required().min(8).messages({
        'string.min':
          'Password length must be at least {#limit} characters long.',
        'any.required': 'New password is required',
      }),
    });

    const data = await service.resetPassword(
      inputData.token,
      inputData.newPassword
    );
    res.json({
      success: true,
      message: 'Password reset successful.',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
const updatePassword = async function (req, res, next) {};
const updateCompanyUser = async function (req, res, next) {};

export {
  signup,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateCompanyUser,
};
