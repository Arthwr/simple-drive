import { AuthenticatedRequest } from 'express';

import { FlashMessages, FlashTypes } from '../../config/constants';
import userServiceInstance from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

const postNewFolder = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const userId = req.user.id;
    const folderName = req.body.folderName;
    const parentPublicFolderId = req.body.folderId || null;

    await userServiceInstance.addUserFolder(userId, parentPublicFolderId, folderName);
    req.flash(FlashTypes.SUCCESS, FlashMessages.STORAGE.FOLDER_SUCCES);

    const redirectPath = parentPublicFolderId
      ? `/dashboard/${parentPublicFolderId}`
      : '/dashboard';

    res.redirect(redirectPath);
  },
);

export default { postNewFolder };
