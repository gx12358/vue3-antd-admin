<template>
  <a-list itemLayout="horizontal" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a-switch
            checkedChildren="开"
            unCheckedChildren="关"
            v-model:checked="item.checkedValue"
          />
        </template>
        <a-list-item-meta :title="item.title" :description="item.description" />
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { notificationViewData } from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      data: notificationViewData
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
