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
};
