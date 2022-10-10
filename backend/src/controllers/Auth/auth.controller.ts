import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
// @ts-expect-error TS(2305) FIXME: Module '"../../services"' has no exported member '... Remove this comment to see the full error message
import { authService, userService, tokenService, emailService } from '../../services';

const register = catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const result = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...result });
});

const forgotPassword = catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  res.status(httpStatus.NO_CONTENT).send(resetPasswordToken);
});

const resetPassword = catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  res.status(httpStatus.NO_CONTENT).send(verifyEmailToken);
});

const verifyEmail = catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
