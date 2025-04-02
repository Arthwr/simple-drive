import { Router } from 'express';

import folderController from '../../controllers/storage/folderController';

const folderRouter = Router();

folderRouter.post('/', folderController.postNewFolder);

export default folderRouter;
