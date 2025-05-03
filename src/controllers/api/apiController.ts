import { AuthenticatedRequest } from 'express';

import { NotifyError } from '../../errors/NotifyError';
import userServiceInstance from '../../services/UserService';
import asyncHandler from '../../utils/asyncHandler';

const getUserFoldersTree = asyncHandler<AuthenticatedRequest>(
  async (req, res, next) => {
    const treeStructure = await userServiceInstance.getUserFolderHierarchy(req.user.id);

    if (!treeStructure) {
      throw new NotifyError("Couldn't retrieve user folder structure", 500);
    }

    res.status(200).json({ tree: treeStructure });
  },
);

export default { getUserFoldersTree };
