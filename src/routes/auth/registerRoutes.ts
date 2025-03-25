import { Router } from 'express';

import registerController from '../../controllers/auth/registerController';

const registerRouter = Router();

registerRouter.get('/', registerController.getRegisterPage);
registerRouter.post('/', registerController.postRegisterUser);

export default registerRouter;
