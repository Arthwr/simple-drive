const directoryBoxElement = document.getElementById('directory') as HTMLElement;
const menuTemplate = document.getElementById(
  'menu-template',
) as HTMLTemplateElement;

function handleMenuClose() {
  const menuItem = document.querySelectorAll(
    '.menu-item',
  ) as NodeListOf<HTMLElement>;

  if (menuItem && menuItem.length > 0) {
    Array.from(menuItem).forEach((nodeElement) => {
      nodeElement.remove();
    });
  }
}

function handleOutsideClick(event: MouseEvent) {
  const openMenu = document.querySelector('.menu-item');
  if (!openMenu) return;

  const clickedInsideMenu = openMenu.contains(event.target as Node);
  const clickedOnButton = (event.target as HTMLElement).closest('.btn-actions');

  if (!clickedInsideMenu && !clickedOnButton) {
    handleMenuClose();
  }
}

function handleOpenMenu(event: MouseEvent) {
  const target = (event.target as HTMLElement).closest('button.btn-actions');
  if (!target || !menuTemplate) return;

  const anchorDivElement = target.parentElement;
  handleMenuClose();

  const menuClone = menuTemplate.content.cloneNode(true);
  anchorDivElement?.append(menuClone);
}

export default function setupItemMenu() {
  directoryBoxElement.addEventListener('click', handleOpenMenu);
  document.addEventListener('click', handleOutsideClick);
}
