import asyncHandler from '../utils/asyncHandler';

const getRoot = asyncHandler(async (req, res, next) => {
  res.render('pages/index');
});

export default { getRoot };
