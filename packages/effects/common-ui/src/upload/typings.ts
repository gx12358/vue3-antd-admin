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
