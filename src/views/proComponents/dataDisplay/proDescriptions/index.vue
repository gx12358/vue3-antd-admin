<template>
  <g-pro-page-container>
    <div class="w-516px h-240px">
      <GSwiper draggable>
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
        >
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
        >
      </GSwiper>
    </div>
  </g-pro-page-container>
</template>

<style lang="less" scoped>
.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>
