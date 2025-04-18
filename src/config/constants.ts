import config from '.';
import formatFileSize from '../utils/formatFileSize';

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
  STORAGE: {
    FOLDER_SUCCES: 'New folder created!',
  },
};
