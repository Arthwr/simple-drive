function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 bytes';

  const base = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(base));

  return (
    parseFloat((bytes / Math.pow(base, index)).toFixed(2)) + ' ' + sizes[index]
  );
}

function handleFilePreviewClick(event: MouseEvent) {
  const removeButton = (event.target as HTMLElement).closest(
    'button',
  ) as HTMLButtonElement;
  if (
    !removeButton ||
    !(event.currentTarget as HTMLElement).contains(removeButton)
  )
    return;

  const fileElement = removeButton.closest('.file-item');
  if (!fileElement) return;

  fileElement.remove();
}

function handleFiles(this: HTMLInputElement) {
  const fileList: FileList | null = this.files;

  if (!fileList || fileList.length === 0) return;

  const template = document.getElementById(
    'file-item-template',
  ) as HTMLTemplateElement;
  const container = document.getElementById('file-preview-list') as HTMLElement;
  const fragmentFilesList = document.createDocumentFragment();
  container.innerHTML = '';

  if (template && container) {
    Array.from(fileList).forEach((file) => {
      const singleFileClone = template.content.cloneNode(
        true,
      ) as DocumentFragment;

      const fileNameElement = singleFileClone.querySelector('.file-name');
      const fileSizeElement = singleFileClone.querySelector('.file-size');

      if (fileNameElement) fileNameElement.textContent = file.name;
      if (fileSizeElement)
        fileSizeElement.textContent = formatFileSize(file.size);

      fragmentFilesList.appendChild(singleFileClone);
    });
  }

  container.appendChild(fragmentFilesList);
}

export default function setupFilesPreview() {
  const fileInput = document.getElementById('ufile') as HTMLInputElement;

  if (!fileInput) return;

  fileInput.addEventListener('change', handleFiles);

  const previewList = document.getElementById(
    'file-preview-list',
  ) as HTMLElement;

  if (!previewList) return;

  previewList.addEventListener('click', handleFilePreviewClick);
}
