<template>
  <a-list itemLayout="horizontal" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a :key="item.actions.key">{{ item.actions.text }}</a>
        </template>
        <a-list-item-meta :title="item.title" :description="item.description">
          <template #avatar>
            <TaobaoOutlined v-if="item.avatar === 'taobao'" class="taobao" />
            <AlipayOutlined v-if="item.avatar === 'alipay'" class="alipay" />
            <DingdingOutlined v-if="item.avatar === 'dingding'" class="dingding" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { TaobaoOutlined, AlipayOutlined, DingdingOutlined } from '@ant-design/icons-vue'
import { bindingViewData } from '../utils/config'

export default defineComponent({
  components: {
    TaobaoOutlined,
    AlipayOutlined,
    DingdingOutlined
  },
  setup() {
    const state = reactive({
      data: bindingViewData
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
