interface FileMap {
  index: string;
  file: File;
}

let filesPayload: FileMap[] = [];

const fileInput = document.getElementById('ufile') as HTMLInputElement;
const previewContainer = document.getElementById(
  'file-preview-container',
) as HTMLElement;
const previewList = document.getElementById('file-preview-list') as HTMLElement;
const template = document.getElementById(
  'file-item-template',
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

function handleFiles(this: HTMLInputElement) {
  const fileList: FileList | null = this.files;

  previewList.innerHTML = '';
  filesPayload = [];

  if (!fileList || fileList.length === 0) {
    updatePreviewVisibility();
    return;
  }

  if (!template || !previewList) {
    return;
  }

  const fragmentFilesList = document.createDocumentFragment();

  Array.from(fileList).forEach((file, index) => {
    const singleFileClone = template.content.cloneNode(
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
  if (!fileInput || !previewContainer || !template) return;

  fileInput.addEventListener('change', handleFiles);
  previewList.addEventListener('click', handleFileRemovalClick);
}
