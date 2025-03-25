import passport from 'passport';

import asyncHandler from '../../utils/asyncHandler';

const getLoginPage = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }

  res.render('pages/login');
});

const postLoginUser = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
});

export default { getLoginPage, postLoginUser };
