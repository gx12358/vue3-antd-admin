import { ExtractPropTypes } from 'vue'
import { cascaderProps } from './props'

export type CascaderProps = Partial<ExtractPropTypes<typeof cascaderProps>>;
