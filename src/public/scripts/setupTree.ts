interface TreeFile {
  name: string;
}

interface TreeFolder {
  name: string;
  publicUrl: string;
  files?: TreeFile[];
  children?: TreeFolder[];
}

function handleTreeClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const expandButton = target.closest('.folder-group > button');

  if (!expandButton) return;

  const childGroup = expandButton.nextElementSibling as HTMLElement;

  if (childGroup) {
    childGroup.classList.toggle('hidden');
    const chevronIcon = expandButton.querySelector(
      '.chevron',
    ) as HTMLImageElement;
    if (childGroup.classList.contains('hidden')) {
      chevronIcon.src = '/assets/img/tree-closed.svg';
    } else {
      chevronIcon.src = '/assets/img/tree-open.svg';
    }
  }
}

function buildTree(
  structure: { folders: TreeFolder[]; files: TreeFile[] } | undefined,
) {
  if (!structure) return;

  const treeBase = document.getElementById('tree-view') as HTMLElement;
  treeBase.innerHTML = '';

  const fragmentTreeStructure = document.createDocumentFragment();

  const folderNodeTemplate = document.getElementById(
    'folder-node',
  ) as HTMLTemplateElement;
  const fileNodeTemplate = document.getElementById(
    'file-node',
  ) as HTMLTemplateElement;

  let indentationLevel = 4;

  function traverseFolders(
    parentElement: HTMLElement | DocumentFragment,
    folder: TreeFolder,
    currentIndentationLevel: number,
  ) {
    const folderGroupClone = folderNodeTemplate.content.cloneNode(
      true,
    ) as DocumentFragment;
    const folderNameElement = folderGroupClone.querySelector(
      '.node-name',
    ) as HTMLElement;
    folderNameElement.textContent = folder.name;
    const childrenGroupElement = folderGroupClone.querySelector(
      '.children-group',
    ) as HTMLElement;

    childrenGroupElement.classList.add(`pl-${currentIndentationLevel}`);

    if (folder.children && folder.children.length > 0) {
      folder.children.forEach((folderChild) => {
        traverseFolders(
          childrenGroupElement,
          folderChild,
          currentIndentationLevel,
        );
      });
    }

    if (folder.files && folder.files.length > 0) {
      folder.files.forEach((file: TreeFile) => {
        const fileNodeClone = fileNodeTemplate.content.cloneNode(
          true,
        ) as DocumentFragment;

        const fileName = fileNodeClone.querySelector(
          '.node-name',
        ) as HTMLElement;
        fileName.textContent = file.name;

        childrenGroupElement.append(fileNodeClone);
      });
    }

    parentElement.append(folderGroupClone);
  }

  structure.folders.forEach((folder) => {
    traverseFolders(fragmentTreeStructure, folder, indentationLevel);
  });

  structure.files.forEach((file) => {
    const fileNodeClone = fileNodeTemplate.content.cloneNode(
      true,
    ) as DocumentFragment;
    const fileName = fileNodeClone.querySelector('.node-name') as HTMLElement;
    fileName.textContent = file.name;
    fragmentTreeStructure.append(fileNodeClone);
  });

  treeBase.append(fragmentTreeStructure);

  treeBase.addEventListener('click', handleTreeClick);
}

export default async function setupTree() {
  try {
    const response = await fetch('/api/tree', {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    const treeStructure = data.tree;

    console.log(treeStructure);
    buildTree(treeStructure);
  } catch (error) {
    console.error(error);
  }
}
