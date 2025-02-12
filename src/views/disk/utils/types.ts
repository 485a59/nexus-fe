interface FileItem {
  id: string;
  name: string;
  type: string;
  size?: string;
  updatedAt: string;
  isDir?: number;
}

interface FolderItem {
  parentId?: number;
  name?: string;
}

export type { FileItem, FolderItem };
