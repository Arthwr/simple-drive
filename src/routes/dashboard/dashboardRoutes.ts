import { Router } from 'express';

import dashboardController from '../../controllers/dashboard/dashboardController';

const dashboardRouter = Router();

dashboardRouter.get('/:folderId?', dashboardController.getDashboardPage);

export default dashboardRouter;
