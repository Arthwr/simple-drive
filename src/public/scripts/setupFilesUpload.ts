import { showToastNotification } from './toast.js';

interface FileMap {
  fileId: string;
  file: File;
}

let filesPayload: FileMap[] = [];

const dropFile = document.getElementById('dropfile') as HTMLElement;
const fileInput = document.getElementById('ufile') as HTMLInputElement;
const previewContainer = document.getElementById('file-preview-container') as HTMLElement;
const confirmButton = previewContainer?.querySelector('button') as HTMLButtonElement;
const previewList = document.getElementById('file-preview-list') as HTMLElement;
const fileItemTemplate = document.getElementById('file-item-template') as HTMLTemplateElement;

const folderInput = document.getElementById('folder-id') as HTMLInputElement;

function resetUploadUI() {
  filesPayload = [];
  updatePreviewVisibility();
  previewContainer.querySelector('.confirm-spinner')?.classList.add('hidden');
  confirmButton.disabled = false;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 bytes';

  const base = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(base));

  return parseFloat((bytes / Math.pow(base, index)).toFixed(2)) + ' ' + sizes[index];
}

function updatePreviewVisibility() {
  if (!previewContainer) return;

  if (filesPayload.length > 0) {
    previewContainer.classList.remove('hidden');
  } else {
    previewContainer.classList.add('hidden');
  }
}

function renderAndStoreFiles(fileList: File[]) {
  const fragment = document.createDocumentFragment();

  fileList.forEach((file) => {
    const isDuplicate = filesPayload.some((entry) => entry.file.name === file.name && entry.file.size === file.size);

    if (isDuplicate) return;

    const fileId = crypto.randomUUID();

    const fileClone = fileItemTemplate.content.cloneNode(true) as DocumentFragment;

    const fileItem = fileClone.querySelector('.file-item') as HTMLElement;
    const fileName = fileClone.querySelector('.file-name') as HTMLElement;
    const fileSize = fileClone.querySelector('.file-size') as HTMLElement;

    if (fileItem) fileItem.dataset.fileIndex = fileId;
    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = formatFileSize(file.size);

    fragment.appendChild(fileClone);
    filesPayload.push({ fileId, file });
  });

  previewList.appendChild(fragment);
  updatePreviewVisibility();
}

function handleFileRemovalClick(event: MouseEvent) {
  const removeButton = (event.target as HTMLElement).closest('button');

  if (!removeButton) return;

  const fileElement = removeButton.closest('.file-item') as HTMLElement;
  const targetId = fileElement.dataset.fileIndex;

  if (targetId && fileElement) {
    filesPayload = filesPayload.filter((file) => file.fileId !== targetId);
    fileElement.remove();
    updatePreviewVisibility();
  }
}

function handleFileDropHandler(event: DragEvent) {
  event.preventDefault();

  if (!event.dataTransfer || !event.dataTransfer.files) return;

  const files = Array.from(event.dataTransfer.files);
  renderAndStoreFiles(files);
}

function handleFilesUpload() {
  if (!filesPayload || filesPayload.length === 0) return;

  if (!folderInput) return;

  const formData = new FormData();
  const folderId = folderInput.value;

  filesPayload.forEach(({ file }) => {
    formData.append('ufile', file);
  });

  const buttonSpinner = previewContainer.querySelector('.confirm-spinner') as HTMLElement;
  const buttonTextSpan = confirmButton.querySelector('span') as HTMLElement;

  buttonSpinner.classList.remove('hidden');
  buttonTextSpan.textContent = 'Uploading...';
  confirmButton.disabled = true;

  fetch(`/upload/${folderId}`, {
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
        localStorage.setItem('toast', JSON.stringify({ type, message }));
        location.reload();
      }
    })
    .catch((err) => {
      console.error('Upload error: ', err);
    })
    .finally(() => {
      resetUploadUI();
    });
}

function handleFiles(this: HTMLInputElement) {
  const fileList: FileList | null = this.files;
  if (!fileList || !previewList || fileList.length === 0) return;

  previewList.textContent = ``;
  filesPayload = [];

  const files = Array.from(fileList);
  renderAndStoreFiles(files);
}

window.addEventListener('DOMContentLoaded', () => {
  const toastData = localStorage.getItem('toast');
  if (toastData) {
    const { type, message } = JSON.parse(toastData);
    showToastNotification(type, message);
    localStorage.removeItem('toast');
  }
});

export default function setupFilesUpload() {
  if (!fileInput || !previewContainer || !fileItemTemplate || !confirmButton) return;

  fileInput.addEventListener('change', handleFiles);
  dropFile.addEventListener('dragover', (e) => e.preventDefault());
  dropFile.addEventListener('drop', handleFileDropHandler);
  previewList.addEventListener('click', handleFileRemovalClick);
  confirmButton.addEventListener('click', () => handleFilesUpload());
}
