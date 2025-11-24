import type { PropType } from 'vue'

export type DivProps = HTMLAttributes<HTMLDivElement>

export type SvgProps = HTMLAttributes<SVGSVGElement>

type IconProps = SvgProps & DivProps

export interface FileTypeIconProps extends IconProps {
  color?: string;
  name?: string;
  size?: number;
  variant?: 'color' | 'mono';
}

export const fileTypeIconProps = () => {
  return {
    color: {
      type: String as PropType<string>,
      default: ''
    },
    name: {
      type: String as PropType<string>,
      default: ''
    },
    size: {
      type: Number as PropType<number>,
      default: 48
    },
    variant: {
      type: String as PropType<'color' | 'mono'>,
      default: 'color'
    }
  }
}
