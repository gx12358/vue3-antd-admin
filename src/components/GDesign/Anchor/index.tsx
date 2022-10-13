import {
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  onUnmounted,
  reactive,
  watch,
  watchEffect
} from 'vue'
import { cloneDeep } from 'lodash-es'
import { Drawer } from 'ant-design-vue'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import { useStore } from '@gx-vuex'
import { getPrefixCls } from '@gx-admin/utils'
import { getScroll, scrollTo, throttleByAnimationFrame } from '@gx-design/utils'
import { useMediaQuery } from '@gx-admin/hooks/event'
import { handleOffsetTop } from '@/utils/util'
import { DefaultAnchor } from './DefaultAnchor'

import './style.less'

const { viewScrollRoot } = config.defaultSettings

export const handelInkStyle = (level = 1, isMobile?) => {
  return {
    paddingLeft: `${level * (isMobile ? 24 : 12)}px`
  }
}

export interface anchorState {
  visible: boolean
  dataSource: any[]
}

export const anchorProps = {
  actionRef: Function,
  links: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  root: {
    type: String as PropType<string>,
    default: viewScrollRoot || '#gx-pro-admin>.gx-scrollbar>.gx-scrollbar-wrap'
  }
}

const GAnchor = defineComponent({
  props: anchorProps,
  setup(props) {
    const store = useStore()

    const prefixCls = getPrefixCls({
      suffixCls: 'anchor'
    })

    const colSize = useMediaQuery()

    const fixedMultiTab = computed(() => store.settings.fixedMultiTab)

    const defaultOffsetTop = computed(() => (fixedMultiTab.value ? 48 + 62 : 48))

    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')

    const state: anchorState = reactive({
      visible: false,
      dataSource: []
    })

    const bindScrollEvent = () => {
      const { root } = props
      const container = document.querySelector(root) as HTMLInputElement
      container.addEventListener('scroll', (e: Event) => {
        handleScroll(e)
      })
      handleScroll({
        target: container
      })
    }

    const scrollRemove = () => {
      const { root } = props
      const container = document.querySelector(root) as HTMLInputElement
      if (container) {
        container.removeEventListener('scroll', (e: Event) => {
          handleScroll(e)
        })
      }
      ;(handleScroll as any).cancel()
    }

    watch(
      () => props.links,
      (data) => {
        state.dataSource = cloneDeep(data)
      },
      {
        deep: true,
        immediate: true
      }
    )

    watch(
      () => props.root,
      () => {
        scrollRemove()
        nextTick(() => {
          bindScrollEvent()
        })
      }
    )

    onMounted(() => {
      nextTick(() => {
        bindScrollEvent()
      })
    })
    onActivated(() => {
      nextTick(() => {
        bindScrollEvent()
      })
    })
    onUnmounted(() => {
      scrollRemove()
    })

    const handelAnchorActive = (scrollTop, anchor, afterAnchor) => {
      if (!anchor) return false
      return (
        scrollTop >= handleOffsetTop(anchor).top - defaultOffsetTop.value &&
        scrollTop <
          (afterAnchor ? handleOffsetTop(afterAnchor).top - defaultOffsetTop.value : 10000)
      )
    }

    const handleScroll = throttleByAnimationFrame((e: Event | { target: any }) => {
      const scrollTop = getScroll(e.target, true)
      setTimeout(() => {
        state.dataSource.map((item: any, index) => {
          const anchor = document.querySelector(item.link)
          const afterAnchor =
            index + 1 === state.dataSource.length
              ? null
              : document.querySelector(state.dataSource[index + 1]['link'])
          item.active = handelAnchorActive(scrollTop, anchor, afterAnchor)
          return item
        })
      }, 110)
    })

    const goAnchor = (selector) => {
      const targetNode = document.querySelector(selector) || { offsetTop: 0 }
      const { root } = props
      scrollTo(handleOffsetTop(targetNode).top - defaultOffsetTop.value, {
        getContainer: () => document.querySelector(root) as HTMLInputElement,
        duration: 450
      })
    }

    watchEffect(() => {
      if (props.actionRef)
        props.actionRef({
          goAnchor
        })
    })

    return () => (
      <>
        {isMobile.value ? (
          <Drawer
            width={300}
            visible={state.visible}
            closable={false}
            placement={'right'}
            bodyStyle={{ padding: 0 }}
            onClose={() => (state.visible = false)}
            handle={
              <div
                onClick={() => (state.visible = !state.visible)}
                class={`${prefixCls}-drawer-handle`}
              >
                {state.visible ? (
                  <CloseOutlined style={{ fontSize: '20px' }} />
                ) : (
                  <MenuOutlined style={{ fontSize: '20px' }} />
                )}
              </div>
            }
          >
            <DefaultAnchor
              prefixCls={prefixCls}
              isfixedMultiTab={fixedMultiTab.value}
              isMobile={isMobile.value}
              dataSource={state.dataSource}
              onGoAnchor={(path) => goAnchor(path)}
            />
          </Drawer>
        ) : (
          <DefaultAnchor
            prefixCls={prefixCls}
            isfixedMultiTab={fixedMultiTab.value}
            dataSource={state.dataSource}
            onGoAnchor={(path) => goAnchor(path)}
          />
        )}
      </>
    )
  }
})

export default GAnchor
