import { defineComponent, reactive } from 'vue'

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  setup(props) {
    const style: any = reactive({
      textAlign: 'center',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 0
    })
    const spinStyle = reactive({
      position: 'absolute',
      left: '50%',
      top: '40%',
      transform: 'translate(-50%, -50%)'
    })
    return () => (
      <>
        {props.loading ? (
          <div style={style}>
            <a-spin size={props.size} style={spinStyle} tip={props.tip} />
          </div>
        ) : null}
      </>
    )
  }
})
