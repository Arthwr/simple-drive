import { Router } from 'express';

import uploadController from '../../controllers/storage/uploadController';
import uploadFilesMiddleware from '../../middleware/uploadFiles';

const uploadRouter = Router();

uploadRouter.post('/', uploadFilesMiddleware, uploadController.postUploadFile);

export default uploadRouter;
