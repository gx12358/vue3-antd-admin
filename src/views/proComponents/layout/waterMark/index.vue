<script setup lang="ts">
import type { Color } from '@gx-design-vue/color-picker'
import { GColorPicker } from '@gx-design-vue/color-picker'
import { GProCard } from '@gx-design-vue/pro-card'
import { useMediaQuery } from '@gx-design-vue/pro-hooks'
import { GPorWaterMark } from '@gx-design-vue/pro-watermark'
import { computed, reactive, ref } from 'vue'

const colSize = useMediaQuery()

const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')

const code = ref(`<GPorWaterMark
  :rotate="-2"
  content="示例水印"
  fontColor="#064417"
  :fontSize="15"
  :zIndex="18"
>
  <div>xxx</div>
</GPorWaterMark>`)

const predefineColors = ref([
  '#FF9D4E', // 0 - 橘黄色
  '#5BD8A6', // 1 - 绿色
  '#5B8FF9', // 2 - 蓝色
  '#F7664E', // 3 - 红色
  '#FF86B7', // 4 - 水红色
  '#2B9E9D', // 5 - 墨绿色
  '#9270CA', // 6 - 紫色
  '#6DC8EC', // 7 - 浅蓝色
  '#667796', // 8 - 黛蓝色
  '#F6BD16' // 9 - 黄色
])

const formState = reactive({
  content: '示例水印',
  fontColor: 'rgba(0,0,0,.15)',
  fontSize: 16,
  zIndex: 10,
  rotate: -22
})
</script>

<template>
  <g-pro-page-container :content-style="{ position: 'relative' }">
    <a-typography id="watermark-customize">
      <a-typography-title :level="2">
        自定义配置
      </a-typography-title>
    </a-typography>
    <a-typography>
      <a-typography>
        这里给出一些通用配置项。如需进一步配置请联系我们。
      </a-typography>
    </a-typography>
    <div class="water-mark">
      <div style="padding: 40px 24px">
        <GProCard
          bordered
          header-bordered
          :class="$style['gx-pro-card-contain-card']"
          title="水印自定义配置器"
          :body-style="{ display: 'flex', padding: 0, flexWrap: isMobile ? 'wrap' : '' } as CSSProperties"
        >
          <div :style="{ flexShrink: 0, width: isMobile ? '100%' : '70%', borderRight: '1px solid #f0f0f0' }">
            <GProCard :bordered="false">
              <GPorWaterMark
                :content="formState.content"
                :font-color="typeof formState.fontColor === 'string' ? formState.fontColor : (formState.fontColor as Color).toCssString()"
                :font-size="formState.fontSize"
                :z-index="formState.zIndex"
                :rotate="formState.rotate"
              >
                <div :class="$style['customize-set']">
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam aliquid
                    perferendis, adipisci dolorum officia odio natus facere cumque iusto libero
                    repellendus praesentium ipsa cupiditate iure autem eos repudiandae delectus totam?
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo praesentium, aperiam
                    numquam voluptatibus asperiores odio? Doloribus saepe, eligendi facere inventore
                    culpa, exercitationem explicabo earum laborum deleniti reiciendis deserunt
                    accusantium ullam.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia voluptas numquam
                    impedit architecto facilis aliquam at assumenda, nostrum explicabo accusantium
                    ipsam error provident voluptate molestias magnam quisquam excepturi illum sit!
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, accusantium quo
                    corporis fugit possimus quaerat ad consequatur veniam voluptatum ut cumque illo
                    beatae. Magni assumenda eligendi itaque eum voluptate non!
                  </p>
                </div>
                <h4>
                  下面是一张zIndex 为 10 的 position 为 relative 图片，
                  <br>
                  如果要在图片中展示水印尝试调大右侧的 zIndex 滑块试试。
                </h4>
                <img
                  src="/src/assets/public_images/watermark.svg"
                  alt="示例图片"
                  :style="{ zIndex: 10, maxWidth: '100%', position: 'relative' }"
                >
              </GPorWaterMark>
            </GProCard>
          </div>
          <div style="width: 100%">
            <GProCard :bordered="false" title="配置面板" :head-style="{ borderBottom: 0 } as CSSProperties">
              <a-form layout="vertical" :model="formState">
                <a-form-item label="水印文字">
                  <a-input v-model:value="formState.content" placeholder="Basic usage" />
                </a-form-item>
                <a-form-item label="字体颜色">
                  <GColorPicker
                    v-model:value="formState.fontColor"
                    :show-alpha="false"
                    :swatches="predefineColors"
                  />
                </a-form-item>
                <a-form-item label="字体大小">
                  <a-slider v-model:value="formState.fontSize" :min="1" :max="100" />
                </a-form-item>
                <a-form-item label="zIndex">
                  <a-slider v-model:value="formState.zIndex" :min="1" :max="100" />
                </a-form-item>
                <a-form-item label="旋转角度">
                  <a-slider v-model:value="formState.rotate" :min="-90" :max="90" />
                </a-form-item>
              </a-form>
              <a-divider />
            </GProCard>
            <a-typography-paragraph style="margin: 0 24px 0 24px" copyable class="gx-code-block">
              <pre>{{ code }}</pre>
            </a-typography-paragraph>
          </div>
        </GProCard>
      </div>
    </div>
  </g-pro-page-container>
</template>

<style lang="less" module>
.water-mark {
  position: relative;
  z-index: 90;
  margin-top: 15px;
  background-color: rgb(240, 242, 245);
  border: 1px solid #ebedf1;
  border-radius: 1px;
}

.customize-set {
  p {
    margin-top: 0;
    margin-bottom: 1em;
  }
  
  h4 {
    margin-top: 0;
    margin-bottom: 0.5em;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  
  img {
    vertical-align: middle;
    border-style: none;
  }
}
</style>
