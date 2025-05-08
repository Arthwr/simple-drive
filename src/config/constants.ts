import config from '.';
import formatFileSize from '../utils/formatFileSize';

export const FileExtTypes: Record<string, string[]> = {
  doc: [
    '.doc',
    '.docx',
    '.odt',
    '.rtf',
    '.txt',
    '.tex',
    '.wpd',
    '.pages',
    '.md',
  ],
  pdf: ['.pdf'],
  mus: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.alac', '.m4a'],
  image: [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.tiff',
    '.webp',
    '.svg',
    '.heic',
    '.raw',
  ],
};

export enum FlashTypes {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export const FlashMessages = {
  REGISTRATION_FAILED_EMAIL_TAKEN: 'Email is unavaible or invalid',
  REGISTRATION_SUCCESS: 'Thank you for joining us! You can safely login now.',
  LOGIN_REQUIRED: 'Please log in to access this resource',
  LOGIN_FAILED: 'Invalid email or password',
  LOGIN_SUCCESS: 'Welcome back!',
  UNEXPECTED_ERROR: 'An unexpected error occured. Please try again later.',
  FILE_NUM_LIMIT: `Maximum file upload number is ${config.file_num_limit}`,
  FILE_SIZE_LIMIT: `Maximum file upload size is ${formatFileSize(config.file_size_limit)}`,
  FILE_NOT_PROVIDED: `Please attach the files before uploading`,
  STORAGE: {
    FOLDER_SUCCES: 'New folder created!',
    FAILED_URL: 'Failed to construct file url',
    FAILED_UPLOAD: 'Upload failed, rolled back all uploaded files',
    FOLDER_DELETE_SUCCESS: 'Successfully deleted folder and all its contents',
    FOLDER_DELETE_FAILED:
      'Deletion failed. The folder and files remain unchanged',
    FILE_DELETE_SUCCESS: 'Successfully deleted requested file',
    FILE_DELETE_FAILED: 'Deletion failed. File(s) remain unchanged',
  },
};
