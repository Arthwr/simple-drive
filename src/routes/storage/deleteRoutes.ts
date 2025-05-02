import { Router } from 'express';

import deleteController from '../../controllers/storage/deleteController';

const deleteRouter = Router();

deleteRouter.post('/folder', deleteController.postDeleteFolder);
deleteRouter.post('/file', deleteController.postDeleteFile);

export default deleteRouter;
