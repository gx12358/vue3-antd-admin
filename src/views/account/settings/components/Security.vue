<template>
  <a-list itemLayout="horizontal" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a :key="item.actions.key">{{ item.actions.text }}</a>
        </template>
        <a-list-item-meta :title="item.title" :description="item.description" />
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { securityViewData } from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      data: securityViewData
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
