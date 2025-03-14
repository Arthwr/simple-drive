import asyncHandler from '../utils/asyncHandler';

const getRoot = asyncHandler(async (req, res) => {
  res.render('pages/index');
});

export default { getRoot };
