import { NextFunction, Request, RequestHandler, Response } from 'express';

// prettier-ignore
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
