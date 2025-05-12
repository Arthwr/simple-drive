import makeRequest from './request.js';
import { showToastNotification } from './toast.js';
import { FlashTypes } from './toast.js';

const directoryElement = document.querySelector('#directory') as HTMLElement;
const inputRenameTemplate = document.querySelector('#rename-field') as HTMLTemplateElement;

function handleRenameCancel(anchorElement: HTMLElement, groupWrapper: HTMLElement, renameButton: HTMLButtonElement) {
  anchorElement.classList.remove('hidden');
  groupWrapper.remove();
  renameButton.disabled = false;
}

async function handleRenameRequest(entityId: string | undefined, parentEntityId: string | undefined, newName: string) {
  let data: any;

  if (entityId && parentEntityId) {
    // Rename for file
    data = await makeRequest(`/rename/file/${parentEntityId}/${entityId}`, 'POST', JSON.stringify({ name: newName }));
  } else if (entityId) {
    // Rename for folder
    data = await makeRequest(`/rename/folder/${entityId}`, 'POST', JSON.stringify({ name: newName }));
  }

  if (data?.type && data?.message) {
    localStorage.setItem('toast', JSON.stringify({ type: data.type, message: data.message }));
    location.reload();
  } else {
    location.reload();
  }
}

function handleRenameClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const renameButton = target.closest('.rename') as HTMLButtonElement;

  if (!(renameButton instanceof HTMLButtonElement)) return;

  const entityId = renameButton.dataset.id;
  const parentEntityId = renameButton.dataset.parent;

  const entityGroupElement = renameButton.closest('div.entity-group') as HTMLElement;
  const entityAnchorElement = entityGroupElement?.querySelector('a') as HTMLAnchorElement;

  renameButton.disabled = true;
  entityAnchorElement.classList.add('hidden');

  if (!inputRenameTemplate) return;

  const inputClone = inputRenameTemplate.content.cloneNode(true) as DocumentFragment;
  entityGroupElement.prepend(inputClone);

  const cancelRenameButton = entityGroupElement.querySelector('button.rename-cancel-btn') as HTMLButtonElement;
  const renameGroupElement = entityGroupElement.querySelector('.rename-group') as HTMLElement;

  if (cancelRenameButton) {
    cancelRenameButton.addEventListener('click', () =>
      handleRenameCancel(entityAnchorElement, renameGroupElement, renameButton),
    );
  }

  const renameConfirmButton = renameGroupElement.querySelector('.rename-confirm-btn');
  const renameInput = renameGroupElement.querySelector('input') as HTMLInputElement;

  if (renameConfirmButton) {
    renameConfirmButton.addEventListener('click', () => {
      const newName = renameInput?.value.trim();

      if (!newName) {
        showToastNotification(FlashTypes.ERROR, 'Name can not be empty');
        return;
      }

      handleRenameRequest(entityId, parentEntityId, newName);
    });
  }
}

export default function setupRenameRequest() {
  if (!directoryElement) return;

  directoryElement.addEventListener('click', handleRenameClick);
}
