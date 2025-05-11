import { AuthenticatedRequest } from 'express';

import { FlashMessages, FlashTypes } from '../../config/constants';
import { NotifyError } from '../../errors/NotifyError';
import userServiceInstance from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

const postRenameFolder = asyncHandler<AuthenticatedRequest>(async (req, res, next) => {
  const userId = req.user.id;
  const publicFolderId = req.params.folderId;
  const name = req.body.name;

  if (!name) {
    throw new NotifyError(FlashMessages.NO_EMPTY_NAME, 404);
  }

  try {
    await userServiceInstance.renameFolder(userId, publicFolderId, name);

    res.status(200).json({
      type: FlashTypes.SUCCESS,
      message: FlashMessages.STORAGE.FOLDER_RENAME_SUCCESS,
    });
  } catch (error) {
    console.error(error);
    throw new NotifyError(FlashMessages.STORAGE.RENAME_FAILED, 500);
  }
});

const postRenameFile = asyncHandler<AuthenticatedRequest>(async (req, res, next) => {
  const userId = req.user.id;
  const parentFolderId = req.params.parentFolderId;
  const fileId = req.params.fileId;
  const name = req.body.name;

  if (!name) {
    throw new NotifyError(FlashMessages.NO_EMPTY_NAME, 404);
  }

  try {
    await userServiceInstance.renameFile(userId, parentFolderId, fileId, name);

    res.status(200).json({
      type: FlashTypes.SUCCESS,
      message: FlashMessages.STORAGE.FILE_RENAME_SUCCESS,
    });
  } catch (error) {
    console.error(error);
    throw new NotifyError(FlashMessages.STORAGE.RENAME_FAILED, 500);
  }
});

export default { postRenameFolder, postRenameFile };
