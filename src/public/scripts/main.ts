import setupSignInValidators from './regValidation.js';

document.addEventListener('DOMContentLoaded', () => {
  setupSignInValidators();
  setupToast();
});

function setupToast() {
  const toast = document.getElementById('toast') as HTMLElement;

  if (!toast) return;

  const button = toast.querySelector('button') as HTMLButtonElement;
  button.addEventListener('click', () => {
    toast.classList.toggle('invisible');
  });

  const progressBar = toast.querySelector('.t-progress') as HTMLElement;
  progressBar.addEventListener('animationend', () => {
    toast.classList.toggle('invisible');
  });
}
