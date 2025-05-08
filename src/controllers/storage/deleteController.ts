import { AuthenticatedRequest } from 'express';

import { FlashMessages, FlashTypes } from '../../config/constants';
import { NotifyError } from '../../errors/NotifyError';
import userServiceInstance from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

const postDeleteFolder = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const userId = req.user.id;
    const publicFolderId = req.params.folderId;

    try {
      await userServiceInstance.deleteUserFolder(userId, publicFolderId);

      res.status(200).json({
        type: FlashTypes.SUCCESS,
        message: FlashMessages.STORAGE.FOLDER_DELETE_SUCCESS,
      });
    } catch (error) {
      return next(
        new NotifyError(FlashMessages.STORAGE.FOLDER_DELETE_FAILED, 500),
      );
    }
  },
);

const postDeleteFile = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const userId = req.user.id;
    const publicFolderId = req.params.parentFolderId;
    const publicFileId = req.params.fileId;

    try {
      await userServiceInstance.deleteUserFile(
        userId,
        publicFolderId,
        publicFileId,
      );

      res.status(200).json({
        type: FlashTypes.SUCCESS,
        message: FlashMessages.STORAGE.FILE_DELETE_SUCCESS,
      });
    } catch (error) {
      return next(
        new NotifyError(FlashMessages.STORAGE.FILE_DELETE_FAILED, 500),
      );
    }
  },
);

export default { postDeleteFolder, postDeleteFile };
