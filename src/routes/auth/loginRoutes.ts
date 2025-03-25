import { Router } from 'express';

import loginController from '../../controllers/auth/loginController';

const loginRouter = Router();

loginRouter.get('/', loginController.getLoginPage);
loginRouter.post('/', loginController.postLoginUser);

export default loginRouter;
