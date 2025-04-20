import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import config from '../config';
import { FlashMessages } from '../config/constants';
import { NotifyError } from '../errors/NotifyError';

const upload = multer({
  limits: {
    files: Number(config.file_num_limit),
    fileSize: Number(config.file_size_limit),
  },
});

const uploadFiles = upload.array('ufile');

function uploadFilesMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  uploadFiles(req, res, (err) => {
    if (!err) {
      return next();
    }

    // Handle multer specific errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_COUNT') {
        const notifyFileLimit = new NotifyError(
          FlashMessages.FILE_NUM_LIMIT,
          400,
          '/dashboard',
        );

        return next(notifyFileLimit);
      }

      if (err.code === 'LIMIT_FILE_SIZE') {
        const notifyFileSize = new NotifyError(
          FlashMessages.FILE_SIZE_LIMIT,
          400,
          '/dashboard',
        );

        return next(notifyFileSize);
      }
    }

    // Handle other errors
    const unexpectedError = new NotifyError(
      FlashMessages.UNEXPECTED_ERROR,
      500,
    );

    return next(unexpectedError);
  });
}

export default uploadFilesMiddleware;
