class ApiError extends Error {
  isOperational: $TSFixMe;
  statusCode: $TSFixMe;
  constructor(statusCode: $TSFixMe, message: $TSFixMe, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
