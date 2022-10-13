<template>
  <a-typography id="g-skeleton-demo">
    <a-typography-title :level="2" :style="{ color: '#454d64' }">Skeleton</a-typography-title>
  </a-typography>
  <a-space>
    <g-skeleton :loading="loading" :shape="buttonShape" :active="active" :size="size">
      按钮
    </g-skeleton>
    <g-skeleton :loading="loading" :shape="buttonShape" :active="active" :size="size">
      按钮
    </g-skeleton>
    <g-skeleton type="avatar" :shape="avatarShape" :loading="loading" :active="active" :size="size">
      头像
    </g-skeleton>
    <g-skeleton type="input" :loading="loading" :active="active" :size="size"> 输入框 </g-skeleton>
  </a-space>
  <br />
  <br />
  <g-skeleton type="image" :loading="loading"> 图片 </g-skeleton>
  <a-divider orientation="left">骨架按钮、头像、输入框和图像。</a-divider>
  <a-form layout="inline">
    <a-form-item label="Loading">
      <a-switch v-model:checked="loading" />
    </a-form-item>
    <a-form-item label="Active">
      <a-switch v-model:checked="active" />
    </a-form-item>
    <a-form-item label="Active">
      <a-radio-group v-model:value="size">
        <a-radio-button value="default">Default</a-radio-button>
        <a-radio-button value="large">Large</a-radio-button>
        <a-radio-button value="small">Small</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Button Shape">
      <a-radio-group v-model:value="buttonShape">
        <a-radio-button value="default">Default</a-radio-button>
        <a-radio-button value="round">Round</a-radio-button>
        <a-radio-button value="circle">Circle</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Avatar Shape">
      <a-radio-group v-model:value="avatarShape">
        <a-radio-button value="square">Square</a-radio-button>
        <a-radio-button value="circle">Circle</a-radio-button>
      </a-radio-group>
    </a-form-item>
  </a-form>
  <a-typography id="g-skeleton-api" style="margin-top: 15px">
    <a-typography-title :level="2" :style="{ color: '#454d64' }">API</a-typography-title>
  </a-typography>
  <a-typography>
    <a-typography-title :level="3" :style="{ color: '#454d64' }"
      >WSkeletonButtonProps</a-typography-title
    >
  </a-typography>
  <g-pro-table
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="basic"
    :dataSource="basicData"
    row-key="attributes"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import columns from '../utils/columns'
import config from '../utils/config'

export default defineComponent({
  setup() {
    const loading = ref(true)
    const active = ref(false)
    const size = ref('default')
    const buttonShape = ref('default')
    const avatarShape = ref('circle')
    const state = reactive({
      basic: columns.basic,
      basicData: config.basicData
    })
    return {
      loading,
      active,
      size,
      buttonShape,
      avatarShape,
      ...toRefs(state)
    }
  }
})
</script>
