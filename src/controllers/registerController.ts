import asyncHandler from '../utils/asyncHandler';

const getRegisterPage = asyncHandler(async (req, res, next) => {
  res.render('pages/register');
});

export default { getRegisterPage };
