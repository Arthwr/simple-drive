import asyncHandler from '../../utils/asyncHandler';

const getIndexPage = asyncHandler(async (req, res, next) => {
  return res.redirect('/dashboard');
});

export default {
  getIndexPage,
};
