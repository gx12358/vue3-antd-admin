import type { CSSProperties } from 'vue'

export const gMaterialViewProps = {
  type: String as PropType<string>,
  url: {
    type: [ String, Array ] as PropType<string | string[]>
  },
  visible: Boolean as PropType<boolean>,
  playerStyle: Object as PropType<CSSProperties>,
  config: Object as PropType<any>,
  onChange: {
    type: Function as PropType<(visible: boolean) => void>
  },
}
