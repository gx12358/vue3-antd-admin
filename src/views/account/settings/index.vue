<template>
  <g-pro-page-container>
    <div :class="$style.main" ref="dom">
      <div :class="$style.leftMenu">
        <a-menu
          :mode="initConfig.mode"
          :selectedKeys="[initConfig.selectKey]"
          @click="
            ({ key }) => {
              setInitConfig({
                ...initConfig,
                selectKey: key
              })
            }
          "
        >
          <a-menu-item :key="item" v-for="item in Object.keys(menuMap)">
            {{ menuMap[item] }}
          </a-menu-item>
        </a-menu>
      </div>
      <div :class="$style.right">
        <div :class="$style.title">{{ menuMap[initConfig.selectKey] }}</div>
        <BaseView v-if="initConfig.selectKey === 'base'" />
        <Security v-if="initConfig.selectKey === 'security'" />
        <Binding v-if="initConfig.selectKey === 'binding'" />
        <Notification v-if="initConfig.selectKey === 'notification'" />
      </div>
    </div>
  </g-pro-page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, Ref, onBeforeMount } from 'vue'
import BaseView from './components/Base.vue'
import Security from './components/Security.vue'
import Binding from './components/Binding.vue'
import Notification from './components/Notification.vue'

type SettingsStateKeys = 'base' | 'security' | 'binding' | 'notification'
type SettingsState = {
  mode: 'inline' | 'horizontal'
  selectKey: SettingsStateKeys
}

export default defineComponent({
  components: {
    BaseView,
    Security,
    Binding,
    Notification
  },
  setup() {
    const menuMap: Record<string, VueNode> = {
      base: '基本设置',
      security: '安全设置',
      binding: '账号绑定',
      notification: '新消息通知'
    }

    const dom: Ref<any> = ref(null)

    const state = reactive({
      initConfig: {
        mode: 'inline',
        selectKey: 'base'
      } as SettingsState
    })

    const resize = () => {
      requestAnimationFrame(() => {
        if (!dom.value) {
          return
        }
        let mode: 'inline' | 'horizontal' = 'inline'
        const { offsetWidth } = dom.value
        if (dom.value.offsetWidth < 641 && offsetWidth > 400) {
          mode = 'horizontal'
        }
        if (window.innerWidth < 768 && offsetWidth > 400) {
          mode = 'horizontal'
        }
        state.initConfig = {
          ...state.initConfig,
          mode: mode as SettingsState['mode']
        }
      })
    }

    onBeforeMount(() => {
      if (dom.value) {
        window.addEventListener('resize', resize)
        resize()
      }
      window.removeEventListener('resize', resize)
    })

    const setInitConfig = (value: SettingsState) => {
      state.initConfig = value
    }

    return {
      ...toRefs(state),
      menuMap,
      dom,
      setInitConfig
    }
  }
})
</script>

<style lang="less" module>
@import './style';
</style>
