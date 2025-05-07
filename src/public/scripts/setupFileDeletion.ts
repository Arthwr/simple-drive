import { showToastNotification } from './toast.js';

const directoryElement = document.getElementById('directory') as HTMLElement;

async function postFolderDelRequest(folderId: string) {
  try {
    const response = await fetch(`/delete/folder/${folderId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = `${response.status} ${response.statusText}`;

      if (errorData.type && errorData.message) {
        errorMessage = errorData.message;
        showToastNotification(errorData.type, errorData.message);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    const { type, message } = data;

    if (type && message) {
      localStorage.setItem('toast', JSON.stringify({ type, message }));
      location.reload();
    }
  } catch (error) {
    console.error('Delete error: ', error);
  }
}

async function handleFolderDeleteClick(event: MouseEvent) {
  const targetDelButton = (event.target as HTMLElement).closest(
    'button.del-folder',
  ) as HTMLButtonElement;
  const folderId = (targetDelButton as HTMLButtonElement).dataset.id;

  if (targetDelButton && folderId) {
    targetDelButton.disabled = true;
    await postFolderDelRequest(folderId);
  }
}

export default function setupFileDeletion() {
  if (!directoryElement) return;

  directoryElement.addEventListener('click', handleFolderDeleteClick);
}
