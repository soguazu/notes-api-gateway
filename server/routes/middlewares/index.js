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

    // const user = (
    //   await UserRepository.getWorkspaceUser(decoded.id, decoded.workspace)
    // ).toJSON();
    // req.user = user;

    const user = {
      id: decoded.id,
      companyId: decoded.company,
    };

    req.user = user;
    next();
  } catch (error) {
    next(new HttpError(401, 'Not authenticated'));
  }
}

export { validateAdminToken };
