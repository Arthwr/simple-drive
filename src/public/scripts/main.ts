import setupFilesUpload from './setupFilesUpload.js';
import setupToast from './setupToast.js';
import setupTree from './setupTree.js';
import setupSignInValidators from './setupValidation.js';

document.addEventListener('DOMContentLoaded', () => {
  setupSignInValidators();
  setupToast();
  setupFilesUpload();
  setupTree();
});
