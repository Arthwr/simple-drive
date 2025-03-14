import asyncHandler from '../utils/asyncHandler';

interface RegisterUserBody {
  email: string;
  password: string;
}

const getRegisterPage = asyncHandler(async (req, res) => {
  res.render('pages/register');
});

const postRegisterUser = asyncHandler(async (req, res) => {
  const { email, password }: RegisterUserBody = req.body;
  // const postResult
});

export default { getRegisterPage, postRegisterUser };
