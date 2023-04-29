import jwt from 'jsonwebtoken';
import axios from 'axios';
import HttpError from '../../helper/httpError';

async function validateAdminToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new Error();
    }

    const token = req.headers.authorization.substr(7);
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const user = {
      id: decoded.id,
      companyId: decoded.company,
      email: Buffer.from(decoded.address, 'base64').toString('ascii'),
    };
    req.user = user;
    next();
  } catch (error) {
    next(new HttpError(401, 'Not authenticated'));
  }
}

async function validateSuperAdminToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new Error();
    }

    const token = req.headers.authorization.substr(7);
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if (!decoded?.role || decoded.role !== 'SUPER_ADMIN') {
      throw new HttpError(
        403,
        "You don't have permission to access this endpoint"
      );
    }

    next();
  } catch (error) {
    next(
      new HttpError(403, "You don't have permission to access this endpoint")
    );
  }
}

export { validateAdminToken, validateSuperAdminToken };
