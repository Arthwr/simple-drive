import { Request, Response } from 'express';

import { NotifyError } from '../errors/NotifyError';

const notifyRedirect = (
  req: Request,
  res: Response,
  err: NotifyError,
): void => {
  req.flash('error', err.message);

  if (err.redirectTo) {
    return res.redirect(err.status, err.redirectTo);
  }

  if (req.method === 'POST') {
    res.redirect(err.status, req.originalUrl);
  }

  return res.redirect(err.status, '/');
};

export default notifyRedirect;
