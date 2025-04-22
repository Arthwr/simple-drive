import { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/AppError';
import { NotifyError } from '../errors/NotifyError';
import notifyRedirect from '../utils/notifyRedirect';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const expectsJson = req.accepts('json', 'html') === 'json';

  if (err instanceof NotifyError) {
    // If app errors come from client fetch post requests (file limit and etc)
    if (expectsJson) {
      res.status(err.status).json({ message: err.message, type: 'error' });
      return;
    }

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
