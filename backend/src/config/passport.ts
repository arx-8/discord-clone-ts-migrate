// @ts-expect-error TS(7016): Could not find a declaration file for module 'pass... Remove this comment to see the full error message
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from './config';
// @ts-expect-error TS(2614): Module '"./tokens"' has no exported member 'tokenT... Remove this comment to see the full error message
import { tokenTypes } from './tokens';
import { User } from '../models';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: $TSFixMe, done: $TSFixMe) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default {
  jwtStrategy,
};
