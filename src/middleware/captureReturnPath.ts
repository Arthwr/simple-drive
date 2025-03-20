import asyncHandler from '../utils/asyncHandler';

const captureReturnPath = asyncHandler(async (req, res, next) => {
  if (req.method === 'GET') {
    req.session.returnPath = req.originalUrl;
  }

  next();
});

export default captureReturnPath;
