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
    return res.status(err.status).redirect(err.redirectTo);
  }

  if (req.method === 'POST') {
    return res.status(err.status).redirect(req.path);
  }

  return res.status(err.status).redirect('/');
};

export default notifyRedirect;
