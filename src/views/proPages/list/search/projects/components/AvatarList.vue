<template>
  <div :class="$style.avatarList" :style="style">
    <ul>
      <li
        :key="getKey(item.id, index)"
        v-for="(item, index) in data"
        :class="avatarSizeToClassName(size)"
      >
        <template v-if="renderItem ?? $slots.renderItem">
          <slot name="renderItem" :el="item" :index="index" />
        </template>
        <template v-else-if="item.name">
          <a-tooltip>
            <template #title>
              {{ item.name }}
            </template>
            <a-avatar :src="item.avatar" :size="size" style="cursor: pointer" />
          </a-tooltip>
        </template>
        <template v-else>
          <a-avatar :src="item.avatar" :size="size" />
        </template>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import type { CSSProperties } from 'vue'
import { defineComponent, getCurrentInstance } from 'vue'
import type { SizeType } from '@gx-admin/utils'
import { PropTypes } from '@/utils'

type AvatarItemProps = {
  name: VueNode
  avatar: string
  size?: SizeType | 'mini' | number
}

export const avatarListProps = {
  data: Array as PropType<AvatarItemProps[]>,
  size: String as PropType<SizeType | 'mini' | number>,
  maxLength: PropTypes.number,
  style: CSSStyleSheet as PropType<CSSProperties>,
  excessItemsStyle: CSSStyleSheet as PropType<CSSProperties>,
  renderItem: PropTypes.any
}

export default defineComponent({
  props: avatarListProps,
  setup() {
    const instance: any = getCurrentInstance()
    const $style: any = instance.type?.__cssModules?.$style
    const getKey = (id: string, index: number) => `${id}-${index}`
    const avatarSizeToClassName = (size?: SizeType | 'mini' | number) => {
      return {
        [`${$style.avatarItem}`]: true,
        [`${$style.avatarItemLarge}`]: size === 'large',
        [`${$style.avatarItemSmall}`]: size === 'small',
        [`${$style.avatarItemMini}`]: size === 'mini'
      }
    }
    return {
      avatarSizeToClassName,
      getKey
    }
  }
})
</script>

<style lang="less" module>
@import './index';
</style>
