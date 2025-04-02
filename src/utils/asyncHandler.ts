import { NextFunction, Request, RequestHandler, Response } from 'express';

const asyncHandler = <R extends Request = Request>(
  fn: (req: R, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return (req, res, next) => {
    return Promise.resolve(fn(req as R, res, next)).catch(next);
  };
};

export default asyncHandler;
