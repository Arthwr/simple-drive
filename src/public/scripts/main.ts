import setupToast from './setupToast.js';
import setupSignInValidators from './setupValidation.js';

document.addEventListener('DOMContentLoaded', () => {
  setupSignInValidators();
  setupToast();
});
