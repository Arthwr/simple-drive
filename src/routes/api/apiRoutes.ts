import { Router } from 'express';

import apiController from '../../controllers/api/apiController';

const apiRouter = Router();

apiRouter.get('/tree', apiController.getUserFoldersTree);

export default apiRouter;
