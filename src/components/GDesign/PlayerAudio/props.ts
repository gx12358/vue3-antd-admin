import type { AudioSource } from './typings'

export const audioProps = {
  src: [ Array, String ] as VuePropType<string | AudioSource[]>
}
