<script lang="ts" setup>
import { GProFormSwitch } from '@gx-design-vue/pro-form'
import { GProCard } from '@gx-design-vue/pro-card'
</script>

<template>
  <g-pro-page-container>
    <GProCard title="默认尺寸" bordered style="max-width: 300px" tooltip="这是提示">
      <template #extra>
        <GProFormSwitch name="Enable" no-style checked-children="启用" un-checked-children="禁用" />
      </template>
    </GProCard>
  </g-pro-page-container>
</template>
