export interface MaterialListItem {
  id: string | number;
  url?: string;
  previewUrl?: string;
  localPreviewUrl?: string;
  // 1 图片 2 音频 3 视频 4 其他
  type?: '1' | '2' | '3' | '4';
  loading?: boolean;
  coverImageLoaded?: 'load' | 'error' | 'success';
  uploadStatus?: 'active' | 'success' | 'exception';
  file?: File;
  name?: string;
  coverImg?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  allowPlay?: boolean;
  allowFormat?: boolean;
  progress?: number;
  sizeSolt?: string;
  message?: string;
}

export interface UploadExpose {
  onView: (row: MaterialListItem) => void;
  onDelete: (row: MaterialListItem) => void;
  onDownload: (row: MaterialListItem) => Promise<void>;
  setDataValue: (list: MaterialListItem[]) => void;
  addDataValue: (params: Partial<MaterialListItem>) => void;
  changeDataValue: (id: MaterialListItem['id'], params: Partial<MaterialListItem>) => void;
  deleteDataValue: (id: MaterialListItem['id']) => void;
  changeFileDataValue: (file: File, params: Partial<MaterialListItem>) => void;
  deleteFileDataValue: (file: File) => void;
  batchChangeDataValue: (list: (Partial<MaterialListItem>)[]) => void;
}
