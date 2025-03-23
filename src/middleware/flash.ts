//  Simplified version of npm connect-flash: https://github.com/jaredhanson/connect-flash/
import { Request, RequestHandler } from 'express';

import { FlashTypes } from '../config/constants';

function _flash(
  this: Request,
  type: FlashTypes,
  message?: string,
): string | undefined {
  if (!this.session) {
    console.error('Error: req.flash() requires express-session');
    return;
  }

  if (!this.session.flash) {
    this.session.flash = {};
  }

  const flashStore = this.session.flash;

  if (type && message) {
    flashStore[type] = message;
    return;
  }

  if (type) {
    const msg = flashStore[type];
    delete flashStore[type];
    return msg;
  }

  return;
}

const flash: RequestHandler = (req, res, next) => {
  if (!req.flash) {
    req.flash = _flash.bind(req);
  }

  next();
};

export default flash;
