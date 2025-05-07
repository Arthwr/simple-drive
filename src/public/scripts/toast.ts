import capitalize from './utils/capitalize.js';

enum FlashTypes {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

const serverToast = document.getElementById('toast') as HTMLElement;
const toastMessageTemplate = document.getElementById(
  'toast-template',
) as HTMLTemplateElement;

const iconCache: Record<FlashTypes, HTMLImageElement> = {
  [FlashTypes.SUCCESS]: new Image(),
  [FlashTypes.ERROR]: new Image(),
  [FlashTypes.INFO]: new Image(),
  [FlashTypes.WARNING]: new Image(),
};

Object.entries(iconCache).forEach(([key, img]) => {
  img.src = `/assets/img/flash-icons/${key.toLowerCase()}-icon.svg`;
});

export function showToastNotification(type: FlashTypes, message: string) {
  if (serverToast) {
    const serverToastShown = !serverToast.classList.contains('invisible');
    if (serverToastShown) return;
  }

  if (!toastMessageTemplate) return;

  const clientToastShown = document.querySelector('.toast-client');
  if (clientToastShown) return;

  const toastClone = toastMessageTemplate.content.cloneNode(
    true,
  ) as DocumentFragment;

  const toastElement = toastClone.querySelector('.toast-client') as HTMLElement;
  const toastTypeElement = toastClone.querySelector(
    '.toast-type',
  ) as HTMLElement;
  const toastIcon = toastClone.querySelector('.toast-icon') as HTMLElement;
  const toastIconImg = toastClone.querySelector('img') as HTMLImageElement;
  const toastMessage = toastClone.querySelector('.toast-msg') as HTMLElement;
  const progressBar = toastClone.querySelector(
    '.toast-client > .t-progress',
  ) as HTMLElement;

  toastTypeElement.textContent = capitalize(type);
  toastTypeElement.classList.add(`text-flash-${type}`);

  toastIconImg.src = iconCache[type].src;
  toastIconImg.alt = `${type} message`;
  toastIcon.classList.add(`bg-flash-${type}`);

  toastMessage.textContent = message;

  document.body.appendChild(toastClone);

  if (toastElement && progressBar) {
    progressBar.addEventListener(
      'animationend',
      () => {
        toastElement.remove();
      },
      { once: true },
    );
  }

  const closeButton = toastElement.querySelector('button');
  if (closeButton) {
    closeButton.addEventListener(
      'click',
      () => {
        toastElement.remove();
      },
      { once: true },
    );
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const toastData = localStorage.getItem('upload-toast');
  if (toastData) {
    const { type, message } = JSON.parse(toastData);
    showToastNotification(type, message);
    localStorage.removeItem('upload-toast');
  }
});
