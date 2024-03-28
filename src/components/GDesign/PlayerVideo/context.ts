import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { inject, provide } from 'vue'

export type ContextType = any

export interface VideoContextProps {
  /* 附加属性 */
  player?: Ref<HTMLVideoElement>;
  loading?: Ref<boolean>;
  isPlaying?: Ref<boolean>;
  loop?: Ref<boolean>;
  autoplay?: Ref<boolean>;
  muted?: Ref<boolean>;
  fullScreen?: Ref<boolean>;
  play?: () => void;
  pause?: () => void;
  toggleScreen?: () => Promise<void>;
  changeLoading?: (val: boolean) => void;

  [key: string]: any;
}

const videoContextInjectKey: InjectionKey<VideoContextProps> = Symbol('video-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType> = videoContextInjectKey,
  defaultValue?: ContextType
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideVideoContext = (value: VideoContextProps | ComputedRef<VideoContextProps>) => {
  provide(videoContextInjectKey, value)
}

export const useVideoContext = () =>
  useContext<Required<VideoContextProps>>(videoContextInjectKey, [])
