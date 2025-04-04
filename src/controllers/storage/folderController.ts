import { AuthenticatedRequest } from 'express';

import { FlashMessages, FlashTypes } from '../../config/constants';
import userService from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

const postNewFolder = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const userId = req.user.id;
    const folderName = req.body.foldername;
    const parentPublicFolderId = req.params.publicFolderId;

    await userService.addUserFolder(userId, parentPublicFolderId, folderName);
    req.flash(FlashTypes.SUCCESS, FlashMessages.STORAGE.FOLDER_SUCCES);
    res.redirect('/dashboard');
  },
);

export default { postNewFolder };
