import { onClickOutside } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import Volume from '../components/Volume'
import { useVideoContext } from '../context'
import { settingsBackDrop } from '../utils/config'

const Settings = defineComponent({
  props: {
    prefixCls: String as VuePropType<string>
  },
  setup(props, { expose }) {
    const { player, loop, autoplay, fullScreen, toggleScreen } = useVideoContext()

    const open = ref(0)
    const isLoop = ref(false)
    const isAutoplay = ref(false)
    const settingsPanel = ref()
    const volumeLayer = ref()
    const settingsConfigs = ref(cloneDeep(settingsBackDrop.filter(el => !el.disabled)))

    const settingsPanelStyle = reactive({
      width: 250,
      height: settingsConfigs.value.length * 35
    })

    const speedItem = computed(() => settingsConfigs.value.find(item => item.type === 'speed'))

    watch(
      () => loop.value,
      (val) => {
        isLoop.value = val
      },
      {
        immediate: true
      }
    )

    watch(
      () => autoplay.value,
      (val) => {
        isAutoplay.value = val
      },
      {
        immediate: true
      }
    )

    const setVideoConfig = (type, value) => player.value[type] = value

    const requestPictureInPicture = () => {
      try {
        if (player.value !== document.pictureInPictureElement) {
          player.value.requestPictureInPicture()
        } else {
          document.exitPictureInPicture()
        }
      } catch (err) {
        console.error(err)
      }
    }

    const changeSettingValue = (params: { type: string; value?: number }) => {
      settingsConfigs.value = settingsConfigs.value.map((item) => {
        if (item.type === params.type) {
          item.value = params.value
        }
        return item
      })
    }

    const changePanelOpen = (value: number, params?: { type: string; value?: number }) => {
      open.value = value
      if (value === 1 || value === 0) {
        settingsPanelStyle.width = 250
        settingsPanelStyle.height = settingsBackDrop.length * 35
      }
      if (value === 2) {
        settingsPanelStyle.width = 200
        settingsPanelStyle.height = (speedItem.value.configs.length + 1) * 35 + 1
      }
      if (params) {
        if (params.type === 'loop' && value === 1)
          setVideoConfig('loop', params.value)
        if (params.type === 'autoplay' && value === 1)
          setVideoConfig('autoplay', params.value)
        if (params.type === 'speed' && value === 1)
          setVideoConfig('playbackRate', params.value)
        if (params.type === 'pictureInPicture' && value === 1)
          requestPictureInPicture()
        if (params.value)
          changeSettingValue(params)
      }
    }

    onClickOutside(settingsPanel, (e) => {
      if (e.target['attributes']?.['data-target']?.value === 'settings') {
        changePanelOpen(open.value ? 0 : 1)
      } else {
        changePanelOpen(0)
      }
    })

    expose({
      remove: () => {
        volumeLayer.value?.remove()
      }
    })

    return () => (
      <div class={`${props.prefixCls}-controls-settings`}>
        <Volume ref={volumeLayer} prefixCls={`${props.prefixCls}-controls-volume`} />
        <div class={`${props.prefixCls}-controls-backdrop`}>
          <i data-target="settings" class="playerfont icon player-shezhitianchong" />
          <div
            ref={settingsPanel}
            style={{
              display: open.value ? 'block' : 'none',
              width: `${settingsPanelStyle.width}px`,
              height: `${settingsPanelStyle.height}px`
            }}
            class={`${props.prefixCls}-controls-backdrop_filter`}
          >
            <div
              class={{
                [`${props.prefixCls}-settings-panel`]: true,
                [`${props.prefixCls}-settings-panel_current`]: open.value === 1
              }}
            >
              {settingsConfigs.value.map(item => (
                <div
                  class={`${props.prefixCls}-settings-panel_item`}
                  onClick={() =>
                    changePanelOpen(item.panelStatus, {
                      type: item.type,
                      value: item.type === 'speed' ? null : item.value === 1 ? 2 : 1
                    })}
                >
                  <div class={`${props.prefixCls}-settings-panel_item_left`}>
                    <i class={`icon playerfont ${item.icon}`} />
                    {item.name}
                  </div>
                  <div class={`${props.prefixCls}-settings-panel_item_right`}>
                    {item.type === 'speed' ? (
                      <>
                        <div class={`${props.prefixCls}-settings-panel_item_right_tooltip`}>
                          {(item.configs as any).find(el => el.value === item.value).name}
                        </div>
                        <div class={`${props.prefixCls}-settings-panel_item_right_icon`}>
                          <i class="playerfont icon player-youce" />
                        </div>
                      </>
                    ) : (
                      <div
                        class={{
                          [`${props.prefixCls}-settings-switch`]: true,
                          ['open']: item.value === 2
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div
              class={{
                [`${props.prefixCls}-settings-panel`]: true,
                [`${props.prefixCls}-settings-panel_current`]: open.value === 2
              }}
            >
              <div
                onClick={() => changePanelOpen(1)}
                class={`${props.prefixCls}-settings-panel_back ${props.prefixCls}-settings-panel_item`}
              >
                <div class={`${props.prefixCls}-settings-panel_item_left`}>
                  <i class="playerfont icon player-zuoce" />
                  <span style={{ marginLeft: '10px' }}>{speedItem.value.name}</span>
                </div>
              </div>
              {speedItem.value.configs.map(el => (
                <div
                  onClick={() =>
                    changePanelOpen(1, {
                      type: 'speed',
                      value: el.value
                    })}
                  class={{
                    [`${props.prefixCls}-settings-panel_item`]: true,
                    [`${props.prefixCls}-settings-panel_current`]:
                    speedItem.value.value === el.value
                  }}
                >
                  <div class={`${props.prefixCls}-settings-panel_item_left`}>
                    <i class="playerfont icon icon-check player-gouxuan" />
                    {el.name}
                  </div>
                  <div class={`${props.prefixCls}-settings-panel_item_right`} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {fullScreen.value ? (
          <i onClick={toggleScreen} class="playerfont icon player-ExitFullScreen" />
        ) : (
          <i onClick={toggleScreen} class="playerfont icon player-FullScreen" />
        )}
      </div>
    )
  }
})

export default Settings
