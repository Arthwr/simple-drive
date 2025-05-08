import { Router } from 'express';

import deleteController from '../../controllers/storage/deleteController';

const deleteRouter = Router();

deleteRouter.post('/folder/:folderId', deleteController.postDeleteFolder);
deleteRouter.post('/file/:parentFolderId/:fileId', deleteController.postDeleteFile);

export default deleteRouter;
