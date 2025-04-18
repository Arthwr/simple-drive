import capitalize from './utils/capitalize.js';

interface FileMap {
  index: string;
  file: File;
}

enum FlashTypes {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

let filesPayload: FileMap[] = [];

const iconCache: Record<FlashTypes, HTMLImageElement> = {
  [FlashTypes.SUCCESS]: new Image(),
  [FlashTypes.ERROR]: new Image(),
  [FlashTypes.INFO]: new Image(),
  [FlashTypes.WARNING]: new Image(),
};

Object.entries(iconCache).forEach(([key, img]) => {
  img.src = `/assets/img/flash-icons/${key.toLowerCase()}-icon.svg`;
});

const fileInput = document.getElementById('ufile') as HTMLInputElement;
const previewContainer = document.getElementById(
  'file-preview-container',
) as HTMLElement;
const confirmButton = previewContainer.querySelector('button');

const previewList = document.getElementById('file-preview-list') as HTMLElement;
const fileItemTemplate = document.getElementById(
  'file-item-template',
) as HTMLTemplateElement;

const serverToast = document.getElementById('toast') as HTMLElement;
const toastMessageTemplate = document.getElementById(
  'toast-template',
) as HTMLTemplateElement;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 bytes';

  const base = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(base));

  return (
    parseFloat((bytes / Math.pow(base, index)).toFixed(2)) + ' ' + sizes[index]
  );
}

function updatePreviewVisibility() {
  if (!previewContainer) return;

  if (filesPayload.length > 0) {
    previewContainer.classList.remove('hidden');
  } else {
    previewContainer.classList.add('hidden');
  }
}

function showToastNotification(type: FlashTypes, message: string) {
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

function handleFileRemovalClick(event: MouseEvent) {
  const removeButton = (event.target as HTMLElement).closest('button');

  if (!removeButton) return;

  const fileElement = removeButton.closest('.file-item') as HTMLElement;
  const targetIndex = fileElement.dataset.fileIndex;

  if (targetIndex && fileElement) {
    filesPayload = filesPayload.filter((file) => file.index !== targetIndex);
    fileElement.remove();
    updatePreviewVisibility();
  }
}

function handleFilesUpload(filesPayload: FileMap[]) {
  if (!filesPayload || filesPayload.length === 0) return;

  const formData = new FormData();

  filesPayload.forEach(({ index, file }) => {
    formData.append('ufile', file);
  });

  fetch('/upload', {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  })
    .then(async (response) => {
      let errorMessage = `${response.status} ${response.statusText}`;

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.type && errorData.message) {
          errorMessage = errorData.message;
          showToastNotification(errorData.type, errorData.message);
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    })
    .then((data) => {
      const type = data.type;
      const message = data.message;

      if (type && message) {
        showToastNotification(type, message);
      }
    })
    .catch((err) => {
      console.error('Upload error: ', err);
    });
}

function handleFiles(this: HTMLInputElement) {
  const fileList: FileList | null = this.files;

  previewList.innerHTML = '';
  filesPayload = [];

  if (!fileList || fileList.length === 0) {
    updatePreviewVisibility();
    return;
  }

  if (!fileItemTemplate || !previewList) {
    return;
  }

  const fragmentFilesList = document.createDocumentFragment();

  Array.from(fileList).forEach((file, index) => {
    const singleFileClone = fileItemTemplate.content.cloneNode(
      true,
    ) as DocumentFragment;

    const fileItemElement = singleFileClone.querySelector(
      '.file-item',
    ) as HTMLElement;
    const fileNameElement = singleFileClone.querySelector(
      '.file-name',
    ) as HTMLElement;
    const fileSizeElement = singleFileClone.querySelector(
      '.file-size',
    ) as HTMLElement;

    if (fileItemElement) fileItemElement.dataset.fileIndex = index.toString();
    if (fileNameElement) fileNameElement.textContent = file.name;
    if (fileSizeElement)
      fileSizeElement.textContent = formatFileSize(file.size);

    fragmentFilesList.appendChild(singleFileClone);
    filesPayload.push({ index: index.toString(), file });
  });

  previewList.appendChild(fragmentFilesList);
  updatePreviewVisibility();
}

export default function setupFilesUpload() {
  if (!fileInput || !previewContainer || !fileItemTemplate || !confirmButton)
    return;

  fileInput.addEventListener('change', handleFiles);
  previewList.addEventListener('click', handleFileRemovalClick);
  confirmButton.addEventListener('click', () =>
    handleFilesUpload(filesPayload),
  );
}
