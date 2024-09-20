<script setup lang="ts">
import GPlayerAudio from '@gx-design/PlayerAudio'
import GPlayerVideo from '@gx-design/PlayerVideo'
import { ref } from 'vue'

const imageUrls = ref([
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
])

const previewList = [
  'https://aliyuncdn.antdv.com/vue.png',
  'https://aliyuncdn.antdv.com/logo.png'
]
</script>

<template>
  <g-pro-page-container>
    <div class="flex justify-between">
      <div>
        <a-typography-title :level="2">
          视频
        </a-typography-title>
        <div class="w-720px h-405px">
          <GPlayerVideo
            :autoplay="false"
            src="https://cdnpdcontent.aikan.pdnews.cn/pdbj-20231016/vod/content/output/d4877c41b58b4517933ae16514667042_opt.mp4"
          />
        </div>
      </div>
      <div>
        <a-typography-title :level="2">
          音频
        </a-typography-title>
        <div class="w-500px">
          <GPlayerAudio
            :src="[
              {
                src: 'https://zbbf9-hw.ahtv.cn/ahtv-transcoding/20210701/2266acbc-b53d-5576-685c-806cbebda605_audio.mp3',
                name: '歌曲',
                author: 'gx12358',
                cover:
                  'https://zbbf9-hw.ahtv.cn/ahtv-obs/20221010/bd2078d8-74a5-353a-639f-a26d26c8457a.jpeg',
              },
            ]"
          />
        </div>
      </div>
    </div>
    <div class="flex gap-20px mt-24px">
      <div>
        <a-typography-title :level="2">
          图片
        </a-typography-title>
        <g-image
          fit="cover"
          class="w-100px"
          src="https://aliyuncdn.antdv.com/vue.png"
          :preview-src-list="previewList"
        />
        <g-image
          fit="cover"
          class="w-100px"
          src="https://aliyuncdn.antdv.com/logo.png"
          :preview-src-list="previewList"
        />
      </div>
      <div>
        <a-typography-title :level="3">
          图片 - 懒加载
        </a-typography-title>
        <div class="w-300px">
          <g-scrollbars :max-height="500">
            <div class="p-20px" style="background: rgb(240, 242, 245)">
              <g-admin-image
                v-for="el in imageUrls"
                :key="el"
                slot-class="min-h-200px"
                slot-image-class="w-50px"
                class="mb-15px"
                :src="el"
                lazy
              />
            </div>
          </g-scrollbars>
        </div>
      </div>
    </div>
  </g-pro-page-container>
</template>
