import { RequestHandler } from 'express';

import { NotFoundError } from '../errors/AppError';

const notFoundHandler: RequestHandler = (req, res, next) => {
  next(new NotFoundError());
};

export default notFoundHandler;
