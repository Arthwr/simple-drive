import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/customErrors';

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
