import { FlashMessages, FlashTypes } from '../config/constants';
import asyncHandler from '../utils/asyncHandler';

const messageStore = asyncHandler(async (req, res, next) => {
  const messageTypes = Object.values(FlashTypes);

  for (const type of messageTypes) {
    const flashMessage = req.flash(type);

    if (flashMessage) {
      res.locals.flashMessage = { type, message: flashMessage };
      break;
    }
  }
  next();
});

export default messageStore;
