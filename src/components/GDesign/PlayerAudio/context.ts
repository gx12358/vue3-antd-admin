import type { Ref } from 'vue'
import { useContext } from '@gx-design-vue/pro-provider'

export interface AudioContextProps {
  /* 附加属性 */
  player?: Ref<HTMLAudioElement | null>;
  loading?: Ref<boolean>;
  isPlaying?: Ref<boolean>;
  muted?: Ref<boolean>;
  play?: () => void;
  pause?: () => void;
  changeLoading?: (val: boolean) => void;

  [key: string]: any;
}

export const {
  provideContext: provideAudioContext,
  useInjectContext: useAudioContext
} = useContext<AudioContextProps>('player-audio')
