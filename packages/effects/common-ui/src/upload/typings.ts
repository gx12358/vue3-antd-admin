export interface MaterialListItem {
  id: string | number;
  url?: string;
  previewUrl?: string;
  localPreviewUrl?: string;
  type?: '1' | '2' | '3' | '4';
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
