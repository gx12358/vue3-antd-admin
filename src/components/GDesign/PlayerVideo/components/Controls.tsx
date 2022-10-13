import { defineComponent, ref } from 'vue'
import Progress from '../components/Progress'
import PlayBack from '../components/PlayBack'
import Setting from '../components/Settings'

export default defineComponent({
  props: {
    open: Boolean as PropType<boolean>,
    prefixCls: String as PropType<string>
  },
  setup(props, { expose }) {
    const settingsLayer = ref()
    const progressLayer = ref()
    const playbackLayer = ref()

    expose({
      remove: () => {
        progressLayer.value?.remove()
        playbackLayer.value?.remove()
        settingsLayer.value?.remove()
      }
    })

    return () => (
      <>
        {props.open && (
          <div class={`${props.prefixCls}-dashboard`}>
            <Progress ref={progressLayer} prefixCls={`${props.prefixCls}-progress`} />
            <div class={`${props.prefixCls}-controls`}>
              <div class={`${props.prefixCls}-controls-playback`}>
                <PlayBack ref={playbackLayer} prefixCls={`${props.prefixCls}-playback`} />
              </div>
              <Setting ref={settingsLayer} prefixCls={props.prefixCls} />
            </div>
          </div>
        )}
      </>
    )
  }
})
