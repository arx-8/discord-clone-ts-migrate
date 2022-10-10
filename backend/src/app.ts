// @ts-expect-error TS(7016): Could not find a declaration file for module 'expr... Remove this comment to see the full error message
import express from 'express';
import helmet from 'helmet';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'xss-... Remove this comment to see the full error message
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'comp... Remove this comment to see the full error message
import compression from 'compression';
import cors from 'cors';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pass... Remove this comment to see the full error message
import passport from 'passport';
import httpStatus from 'http-status';
// @ts-expect-error TS(2614): Module '"./config/passport"' has no exported membe... Remove this comment to see the full error message
import { jwtStrategy } from './config/passport';
import routes from './routes/v1';
// @ts-expect-error TS(2614): Module '"./middlewares/error"' has no exported mem... Remove this comment to see the full error message
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
const app = express();

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.options(
  '*',
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req: $TSFixMe, res: $TSFixMe, next: $TSFixMe) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
