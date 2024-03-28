import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { inject, provide } from 'vue'

export type ContextType = any

export interface AudioContextProps {
  /* 附加属性 */
  player?: Ref<HTMLAudioElement>;
  loading?: Ref<boolean>;
  isPlaying?: Ref<boolean>;
  muted?: Ref<boolean>;
  play?: () => void;
  pause?: () => void;
  changeLoading?: (val: boolean) => void;

  [key: string]: any;
}

const audioContextInjectKey: InjectionKey<AudioContextProps> = Symbol('video-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType> = audioContextInjectKey,
  defaultValue?: ContextType
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideAudioContext = (value: AudioContextProps | ComputedRef<AudioContextProps>) => {
  provide(audioContextInjectKey, value)
}

export const useAudioContext = () =>
  useContext<Required<AudioContextProps>>(audioContextInjectKey, [])
