import asyncHandler from '../utils/asyncHandler';

const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  next();
});

export default isAuthenticated;
