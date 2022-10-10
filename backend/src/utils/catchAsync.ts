const catchAsync = (fn: $TSFixMe) => (req: $TSFixMe, res: $TSFixMe, next: $TSFixMe) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
