import { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/AppError';
import { NotifyError } from '../errors/NotifyError';
import notifyRedirect from '../utils/notifyRedirect';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof NotifyError) {
    // Determine redirect path based on error and request
    return notifyRedirect(req, res, err);
  }

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.status;
    message = err.message;
  }

  console.error(err);
  res.status(statusCode).render('pages/error', { statusCode, message });
};

export default errorHandler;
