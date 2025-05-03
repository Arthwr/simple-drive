import { AuthenticatedRequest } from 'express';

import { FlashMessages, FlashTypes } from '../../config/constants';
import { NotifyError } from '../../errors/NotifyError';
import userServiceInstance from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

const postUploadFile = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const userId = req.user.id;
    const publicFolderId = req.params.folderId || null;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      throw new NotifyError(FlashMessages.FILE_NOT_PROVIDED, 400);
    }

    const { successfulCount, failedCount, errors } =
      await userServiceInstance.uploadAndRegisterFiles(
        userId,
        publicFolderId,
        files,
      );

    // Successful or partially successful uploads
    if (failedCount === 0) {
      res.status(200).json({
        type: FlashTypes.SUCCESS,
        message: `${successfulCount} file(s) uploaded successfully.`,
      });
    } else if (successfulCount > 0) {
      const message = `Uploaded ${successfulCount} files successfully, but ${failedCount} failed.`;

      res.status(207).json({
        type: FlashTypes.WARNING,
        message: message,
        errors,
      });
    } else {
      console.error(errors);
      throw new NotifyError(FlashMessages.STORAGE.FAILED_UPLOAD, 500);
    }
  },
);

export default { postUploadFile };
