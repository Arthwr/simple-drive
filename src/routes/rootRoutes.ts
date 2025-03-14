import { Router } from 'express';

import rootController from '../controllers/rootController';

const rootRouter = Router();

rootRouter.get('/', rootController.getRoot);

export default rootRouter;
