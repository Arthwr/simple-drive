import { UnexpectedRegistrationError } from '../errors/NotifyError';
import userService from '../services/UserService';
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
  const newUser = await userService.addUserMember(email, password);

  if (!newUser) {
    throw new UnexpectedRegistrationError();
  }

  req.flash('success', `Thank you for joining us! You can safely login now.`);
  res.status(201).redirect('/');
});

export default { getRegisterPage, postRegisterUser };
