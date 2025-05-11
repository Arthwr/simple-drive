import { Router } from 'express';

import renameController from '../../controllers/storage/renameController';

const renameRouter = Router();

renameRouter.post('/folder/:folderId', renameController.postRenameFolder);
renameRouter.post('/file/:parentFolderId/:fileId', renameController.postRenameFile);

export default renameRouter;
