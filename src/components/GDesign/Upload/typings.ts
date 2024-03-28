export interface MaterialListItem {
  id?: string;
  url?: string;
  previewUrl?: string;
  localPreviewUrl?: string;
  type?: string;
  uploadLoading?: boolean;
  uploadStatus?: 'normal' | 'active' | 'success' | 'exception';
  file?: File;
  loadStatusMsg?: string;
  name?: string;
  coverImg?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  spinning?: boolean;
  loadingText?: string;
  allowFormat?: boolean;
  allowPlay?: boolean;
  progress?: number;
  sizeSolt?: string;
}
