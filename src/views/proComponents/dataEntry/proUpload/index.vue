<template>
  <g-pro-page-container>
    <g-upload
      :autoScreenshot="false"
      :autoGetMediaParams="false"
      :progress="false"
      :data-list="urlList"
      :request="uploadHttps"
      wordExtra="打包后在Mock模式下，不能启用快编功能！"
    />
  </g-pro-page-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@gx-vuex'
import { dataURLtoBlob, getBase64, getBlobUrl } from '@/utils/util'

const store = useStore()
const avatar = computed(() => store.user.avatar)

const urlList = computed(() => [
  avatar.value,
  {
    url: 'https://images.unsplash.com/photo-1652451635491-72dfaab20637?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80',
    type: '1'
  },
  'https://dbxz1-hw.ahtv.cn/ahtv-obs/20210923/256957c3-5bd8-7676-2772-c70f04ad71a2.mp4',
  'https://zbbf9-hw.ahtv.cn/ahtv-transcoding/20210701/2266acbc-b53d-5576-685c-806cbebda605_audio.mp3'
])

const uploadHttps = async (file) => {
  return new Promise((resolve) => {
    getBase64(file).then((res) => {
      setTimeout(() => {
        resolve({
          code: 0,
          url: getBlobUrl(dataURLtoBlob(res))
        })
      }, 5000)
    })
  })
}
</script>

<style lang="less" module></style>
