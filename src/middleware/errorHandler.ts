import { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/AppError';
import { NotifyError } from '../errors/NotifyError';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof NotifyError) {
    // Assign error message for user notification
    req.flash('error', err.message);

    // Safely store user return path to redirect
    const returnPath = req.session.returnPath || '/';

    return res.redirect(err.status, returnPath);
  }

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.status;
    message = err.message;
  }

  res.status(statusCode).render('pages/error', { statusCode, message });
};

export default errorHandler;
