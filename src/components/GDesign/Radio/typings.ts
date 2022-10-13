import { ExtractPropTypes } from 'vue'
import { radioProps, radioGroupProps } from './props'

export type RadioProps = Partial<ExtractPropTypes<typeof radioProps>>;
export type RadioGroupProps = Partial<ExtractPropTypes<typeof radioGroupProps>>;
