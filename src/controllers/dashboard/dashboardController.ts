import { AuthenticatedRequest } from 'express';

import userServiceInstance from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

const getDashboardPage = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const userId = req.user.id;
    const publicFolderId = req.params.publicFolderId;

    let folderContent = await userServiceInstance.getDirectoryData(
      userId,
      publicFolderId,
    );

    folderContent.folders = await Promise.all(
      folderContent.folders.map(async (folder) => {
        let folderSize = await userServiceInstance.getFolderSize(folder.id);

        return { folderSize, ...folder };
      }),
    );

    res.render('pages/dashboard', { folderContent });
  },
);

export default {
  getDashboardPage,
};
