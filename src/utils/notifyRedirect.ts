import { Request, Response } from 'express';

import { FlashTypes } from '../config/constants';
import { NotifyError } from '../errors/NotifyError';

const notifyRedirect = (
  req: Request,
  res: Response,
  err: NotifyError,
): void => {
  // Assign error message for user notification
  req.flash(FlashTypes.ERROR, err.message);

  if (err.redirectTo) {
    return res.redirect(err.status, err.redirectTo);
  }

  if (req.method === 'POST') {
    return res.redirect(err.status, req.path);
  }

  return res.redirect(err.status, '/login');
};

export default notifyRedirect;
