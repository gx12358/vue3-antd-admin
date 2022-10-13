<template>
  <g-pro-page-container>
    <div class="flex gap-40px items-start">
      <div class="w-720px h-405px">
        <g-player-video
          :autoplay="false"
          src="http://cdn.aikan.pdnews.cn/vod/content/2022092010/25df52d136a54ad2acca8c2ad0642271.mp4"
        />
      </div>
      <div class="min-w-500px">
        <g-player-audio
          src="https://zbbf9-hw.ahtv.cn/ahtv-obs/20220120/756a96e4-6721-f06d-47c5-112615859190.mp3"
        />
      </div>
    </div>
  </g-pro-page-container>
</template>

<script setup lang="ts">
import GPlayerVideo from '@gx-design/PlayerVideo'
import GPlayerAudio from '@gx-design/PlayerAudio'
</script>

<style lang="less" module></style>
