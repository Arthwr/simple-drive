import path from 'node:path';

import { DirectoryViewData } from '../types/directory.types';
import formatFileSize from './formatFileSize';
import getCategoryByExt from './getCategoryByExt';

function capitalize(string: string): string {
  if (!string) return '';

  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getFileIconUrl(fileName: string) {
  const fileExt = path.extname(fileName);
  const category = getCategoryByExt(fileExt);

  if (category) {
    return `/assets/img/${category}-file.svg`;
  }

  return '/assets/img/file-dir-icon.svg';
}

export default {
  capitalize,
  formatDate,
  formatFileSize,
  getFileIconUrl,
};
