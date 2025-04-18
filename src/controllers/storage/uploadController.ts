import { AuthenticatedRequest } from 'express';

import asyncHandler from '../../utils/asyncHandler';

const postUploadFile = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    // We receive req.files
    // We then process, optionally filter and throw error on wrong files / wrong size / max files
    // We do other stuff to store it on 3rd party host
    res.redirect('/dashboard');
  },
);

export default { postUploadFile };
