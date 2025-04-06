import { File, Folder } from '@prisma/client';

export interface DirectoryViewData {
  currentFolder: Folder | null;
  parentFolder: Folder | null;
  folders: Folder[];
  files: File[];
  breadcrumbs: ParentFolderInfo[];
}

export interface ParentFolderInfo {
  id: string;
  publicId: string;
  name: string;
  parentId: string | null;
}
