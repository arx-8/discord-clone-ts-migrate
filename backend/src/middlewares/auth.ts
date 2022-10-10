// @ts-expect-error TS(7016): Could not find a declaration file for module 'pass... Remove this comment to see the full error message
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
// @ts-expect-error TS(2614): Module '"../config/roles"' has no exported member ... Remove this comment to see the full error message
import { roleRights } from '../config/roles';

const verifyCallback = (req: $TSFixMe, resolve: $TSFixMe, reject: $TSFixMe, requiredRights: $TSFixMe) => async (err: $TSFixMe, user: $TSFixMe, info: $TSFixMe) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight: $TSFixMe) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights: $TSFixMe[]) =>
  async (req: $TSFixMe, res: $TSFixMe, next: $TSFixMe) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
