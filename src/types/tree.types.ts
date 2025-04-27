interface TreeFile {
  name: string;
}

interface TreeFolder {
  name: string;
  publicUrl: string;
  files?: TreeFile[];
  children?: TreeFolder[];
}
