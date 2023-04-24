import * as uuid from 'uuid';
import Joi from 'joi';
const mongoose = require('mongoose');

import HttpError from '../helper/httpError';

const routeValidateUUID = function (req, res, next) {
  console.log(req.params.id);
  if (UUID(req.params.id)) {
    next();
  } else {
    console.log('ends here');
    throw new HttpError(404, 'Not found');
  }
};

const UUID = function (objectId) {
  return uuid.validate(objectId);
};

const routeValidateObjectId = function (req, res, next) {
  if (exports.ObjectId(req.params.id)) {
    next();
  } else {
    throw new HttpError(404, 'Not found');
  }
};

const ObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const validateRequest = function (req, rules) {
  const schema = Joi.object().keys(rules);
  return validateSchema(req, schema);
};

const getPaginationValidationProps = function (
  shouldIncludeSort = false,
  sortFields = ['createdAt']
) {
  const props = {
    skip: Joi.number().optional().min(0),
    limit: Joi.number().optional().min(0),
  };

  if (shouldIncludeSort) {
    props.sortField = Joi.string()
      .optional()
      .valid(...sortFields);
    props.sortOrder = Joi.string().optional().valid('asc', 'desc');
  }

  return props;
};

const getFilter = function (query, fields, checkDate = false) {
  const filter = {};

  for (const field of fields) {
    if (query[field.key] === undefined) {
      continue;
    }

    switch (field.type) {
      case 'bool':
        filter[field.column] = JSON.parse(query[field.key]);
        break;
      case 'objectid':
        filter[field.column] = mongoose.isValidObjectId(query[field.key])
          ? mongoose.Types.ObjectId(query[field.key])
          : null;
        break;
      case 'string_upper':
        filter[field.column] = query[field.key].toUpperCase();
        break;
      default:
        filter[field.column] = query[field.key];
        break;
    }
  }

  if (checkDate && (query.startDate || query.endDate)) {
    filter.createdAt = {};
    if (query.startDate) {
      filter.createdAt.$gte = moment(query.startDate).toDate();
    }
    if (query.endDate) {
      filter.createdAt.$lte = moment(query.endDate).toDate();
    }
  }

  return filter;
};

const filterFieldObj = function (key, column = undefined, type = 'string') {
  return {
    key,
    column: column === undefined ? key : column,
    type,
  };
};

const validateSchema = function (req, schema) {
  const { error, value } = schema.validate({
    ...req.body,
    ...req.params,
    ...req.query,
  });

  if (error) {
    if (error.details) {
      throw new HttpError(400, error.details[0].message);
    } else {
      throw new HttpError(error.status || 400, error.message);
    }
  }
  return value;
};

const validateRequestWithCustomSchema = function (req, schema) {
  return validateSchema(req, schema);
};

export {
  routeValidateUUID,
  ObjectId,
  validateRequest,
  getPaginationValidationProps,
  getFilter,
  filterFieldObj,
  validateRequestWithCustomSchema,
  routeValidateObjectId,
};
