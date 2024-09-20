<script setup lang="ts">
import GUpload, { type GUploadProps } from '@gx-design/Upload'
import { dataURLtoBlob, getBase64, getBlobUrl } from '@gx-design-vue/pro-utils'
import { computed } from 'vue'

const { user } = useStore()

const urlList = computed(() => [
  user.userInfo.avatar,
  {
    url: 'https://images.unsplash.com/photo-1652451635491-72dfaab20637?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80',
    type: '1'
  },
  'https://artplayer.org/assets/sample/video.mp4',
  'https://zbbf9-hw.ahtv.cn/ahtv-transcoding/20210701/2266acbc-b53d-5576-685c-806cbebda605_audio.mp3'
])

const uploadHttps: GUploadProps['request'] = async (file) => {
  return new Promise((resolve) => {
    getBase64(file).then((res) => {
      setTimeout(() => {
        resolve({
          code: 0,
          url: getBlobUrl(dataURLtoBlob(res)),
          previewUrl: getBlobUrl(dataURLtoBlob(res)),
        })
      }, 1000)
    })
  })
}
</script>

<template>
  <g-pro-page-container>
    <GUpload
      :progress="false"
      :data-list="urlList"
      :request="uploadHttps"
      word-extra="打包后在Mock模式下，不能启用快编功能！"
    />
  </g-pro-page-container>
</template>
