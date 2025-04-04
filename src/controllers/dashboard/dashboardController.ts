import { AuthenticatedRequest } from 'express';

import userService from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

const getDashboardPage = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const userId = req.user.id;
    const publicFolderId = req.params.publicFolderId;

    const folderContent = await userService.getDirectoryData(
      userId,
      publicFolderId,
    );

    res.render('pages/dashboard', { folderContent });
  },
);

export default {
  getDashboardPage,
};
