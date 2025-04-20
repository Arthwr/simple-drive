import { AuthenticatedRequest } from 'express';
import { v4 as uuidv4 } from 'uuid';

import config from '../../config';
import { FlashMessages, FlashTypes } from '../../config/constants';
import supabase from '../../config/supabaseClient';
import { NotifyError } from '../../errors/NotifyError';
import userService from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

import path = require('path');

async function uploadFile(file: Express.Multer.File, userId: string) {
  const fileExt = path.extname(file.originalname);
  const filePath = `users/${userId}/${uuidv4()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(config.supabase_bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new NotifyError(
      `Failed to upload file: ${file.originalname}. Please try again.`,
      500,
    );
  }

  return data.path;
}

async function buildFileUrl(uploadedPath: string) {
  const { data } = supabase.storage
    .from(config.supabase_bucket)
    .getPublicUrl(uploadedPath, { download: true });

  if (!data) {
    throw new NotifyError(FlashMessages.STORAGE.FAILED_URL, 500);
  }

  return data.publicUrl;
}

const postUploadFile = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new NotifyError(FlashMessages.FILE_NOT_PROVIDED, 400);
    }

    const uploadedPaths: string[] = [];
    const publicFolderId = req.params.folderId || null;
    const userId = req.user.id;

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const filePath = await uploadFile(file, userId);
          uploadedPaths.push(filePath);

          const fileUrl = await buildFileUrl(filePath);
          return { name: file.originalname, size: file.size, url: fileUrl };
        }),
      );

      await Promise.all(
        results.map(async (result) => {
          const { name, size, url } = result;
          await userService.addUserFile(
            userId,
            name,
            BigInt(size),
            url,
            publicFolderId,
          );
        }),
      );

      res.status(200).json({
        type: FlashTypes.SUCCESS,
        message: FlashMessages.STORAGE.FILES_SUCCESS,
      });
    } catch (error) {
      // Remove orphan files in case of any network error
      await supabase.storage.from(config.supabase_bucket).remove(uploadedPaths);
      return next(new NotifyError(FlashMessages.STORAGE.FAILED_UPLOAD, 500));
    }
  },
);

export default { postUploadFile };
