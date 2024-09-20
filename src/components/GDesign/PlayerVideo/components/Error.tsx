import type { FunctionalComponent as FC } from 'vue'
import { isFunction } from '@gx-design-vue/pro-utils'

export interface ErrorPlayer {
  open: boolean
  prefixCls: string
  refresh: () => void
  title?: string
  errMsg?: string
}

const DefaultErrorRender = (refresh: ErrorPlayer['refresh']) => (
  <>
    请
    &nbsp;
    <a onClick={refresh}>刷新</a>
    &nbsp;
    试试
  </>
)

const Error: FC<ErrorPlayer> = (props: ErrorPlayer, { slots }) => {
  return (
    <div
      style={props.open ? undefined : { display: 'none' }}
      class={{
        [`${props.prefixCls}-layer`]: true,
        [`${props.prefixCls}-error`]: true
      }}
    >
      <div class={`${props.prefixCls}-error-wrapper`}>
        <div class={`${props.prefixCls}-error-wrapper_title`}>
          {slots.title && isFunction(slots.title) ? (
            <div v-slots={{ default: () => slots.title?.() }} />
          ) : (
            <>{props.title || DefaultErrorRender(props.refresh)}</>
          )}
        </div>
        <p class={`${props.prefixCls}-error-wrapper_msg`}>{props.errMsg}</p>
      </div>
    </div>
  )
}

export default Error
