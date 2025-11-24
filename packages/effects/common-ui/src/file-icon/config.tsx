import audio from './svg/audio.svg'
import image from './svg/image.svg'
import markdown from './svg/markdown.svg'
import pdf from './svg/pdf.svg'
import powerpoint from './svg/powerpoint.svg'
import table from './svg/table.svg'
import video from './svg/video.svg'
import word from './svg/word.svg'
import zip from './svg/zip.svg'

export const IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg']

export const DEFAULT_ICON_COLOR = '#BBCADC'

export const PRESET_FILE_ICONS: {
  ext: string[];
  color: string;
  icon?: any;
}[] = [
  {
    color: '#46B059',
    icon: table,
    ext: ['xlsx', 'xls'],
  },
  {
    color: '#7AD72B',
    icon: image,
    ext: IMG_EXTS,
  },
  {
    color: '#6C6C6C',
    icon: markdown,
    ext: ['md', 'mdx'],
  },
  {
    color: '#FF4539',
    icon: pdf,
    ext: ['pdf'],
  },
  {
    color: '#FF6A46',
    icon: powerpoint,
    ext: ['ppt', 'pptx'],
  },
  {
    color: '#1890FF',
    icon: word,
    ext: ['doc', 'docx'],
  },
  {
    color: '#673AB7',
    icon: zip,
    ext: ['zip', 'rar', '7z', 'tar', 'gz'],
  },
  {
    color: '#FF4539',
    icon: video,
    ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
  },
  {
    color: '#FF656A',
    icon: audio,
    ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
  },
]
