import asyncHandler from '../../utils/asyncHandler';

const getDashboardPage = asyncHandler(async (req, res, next) => {
  res.render('pages/dashboard');
});

export default {
  getDashboardPage,
};
