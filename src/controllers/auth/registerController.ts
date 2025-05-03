import { FlashMessages, FlashTypes } from '../../config/constants';
import { UnexpectedError } from '../../errors/NotifyError';
import userServiceInstance from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

interface RegisterUserBody {
  email: string;
  password: string;
}

const getRegisterPage = asyncHandler(async (req, res) => {
  res.render('pages/register');
});

const postRegisterUser = asyncHandler(async (req, res) => {
  const { email, password }: RegisterUserBody = req.body;
  const newUser = await userServiceInstance.addUserMember(email, password);

  if (!newUser) {
    throw new UnexpectedError();
  }

  req.flash(FlashTypes.SUCCESS, FlashMessages.REGISTRATION_SUCCESS);
  res.status(201).redirect('/login');
});

export default { getRegisterPage, postRegisterUser };
