import { Router } from 'express';

import registerController from '../../controllers/registerController';

const registerRouter = Router();

registerRouter.get('/', registerController.getRegisterPage);

export default registerRouter;
