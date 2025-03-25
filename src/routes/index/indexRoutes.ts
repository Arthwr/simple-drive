import { Router } from 'express';

import indexController from '../../controllers/index/indexController';

const indexRouter = Router();

indexRouter.get('/', indexController.getIndexPage);

export default indexRouter;
