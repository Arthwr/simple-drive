import makeRequest from './request.js';

const directoryElement = document.getElementById('directory') as HTMLElement;

async function handleDirectoryDelButtonClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  const deleteFolderButton = target.closest('button.del-folder');

  if (deleteFolderButton instanceof HTMLButtonElement) {
    const folderId = deleteFolderButton.dataset.id;
    if (folderId) {
      const spinner = deleteFolderButton.querySelector('.wait-spinner');

      spinner?.classList.remove('hidden');
      deleteFolderButton.disabled = true;

      try {
        const data = await makeRequest(`/delete/folder/${folderId}`, 'POST');

        if (data?.type && data?.message) {
          localStorage.setItem('toast', JSON.stringify({ type: data.type, message: data.message }));
          location.reload();
        } else {
          location.reload();
        }
      } catch (error) {
        spinner?.classList.add('hidden');
        deleteFolderButton.disabled = false;
      }

      return;
    }
  }

  const deleteFileButton = target.closest('button.del-file');
  if (deleteFileButton instanceof HTMLButtonElement) {
    const fileId = deleteFileButton.dataset.id;
    const parentFolderId = deleteFileButton.dataset.parent;

    if (fileId && parentFolderId) {
      const spinner = deleteFileButton.querySelector('.wait-spinner');

      spinner?.classList.remove('hidden');
      deleteFileButton.disabled = true;

      try {
        const data = await makeRequest(`/delete/file/${parentFolderId}/${fileId}`, 'POST');

        if (data?.type && data?.message) {
          localStorage.setItem('toast', JSON.stringify({ type: data.type, message: data.message }));
          location.reload();
        } else {
          location.reload();
        }
      } catch (error) {
        spinner?.classList.add('hidden');
        deleteFileButton.disabled = false;
      }

      return;
    }
  }
}

export default function setupFileDeletion() {
  if (!directoryElement) return;

  directoryElement.addEventListener('click', handleDirectoryDelButtonClick);
}
