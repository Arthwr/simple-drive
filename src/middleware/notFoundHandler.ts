import { NextFunction, Request, Response } from 'express';

import { NotFoundError } from '../errors/customErrors';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
};

export default notFoundHandler;
