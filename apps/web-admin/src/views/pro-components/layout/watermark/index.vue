<script setup lang="ts">
import type { Color, ColorPickerProps } from '@gx-design-vue/color-picker'
import { GColorPicker, generate, presetPalettes } from '@gx-design-vue/color-picker'
import { GPorWaterMark } from '@gx-design-vue/pro-watermark'
import { computed, reactive } from 'vue'

type Presets = Required<ColorPickerProps>['presets'][number]

const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map<Presets>(([ label, colors ]) => ({ label, colors }))

const presets = genPresets({
  '蓝色': generate('#5B8FF9'),
  '红色': generate('#F7664E'),
  '水红色': generate('#FF86B7'),
  '橘黄色': generate('#FF9D4E'),
  '绿色': generate('#5BD8A6'),
  '墨绿色': generate('#2B9E9D'),
  '紫色': generate('#9270CA'),
  '浅蓝色': generate('#6DC8EC'),
  '黛蓝色': generate('#667796'),
  '黄色': generate('#F6BD16'),
})

const formState = reactive({
  content: '示例水印',
  fontColor: '#FF9D4E',
  fontSize: 16,
  zIndex: 10,
  rotate: -22
})

const font = computed(() => {
  return {
    color: typeof formState.fontColor === 'string' ? formState.fontColor : (formState.fontColor as Color).toCssString(),
    fontSize: formState.fontSize,
  }
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
    <div class="gx-card">
      <div class="gx-card-body">
        <div class="flex gap-base">
          <div>
            <GPorWaterMark
              :content="formState.content"
              :font="font"
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
                src="/src/assets/images/public/watermark.png"
                alt="示例图片"
                :style="{ zIndex: 10, maxWidth: '100%', position: 'relative' }"
              >
            </GPorWaterMark>
          </div>
          <div class="p-l-sm bd-l-split">
            <a-form class="w-280px" layout="vertical" :model="formState">
              <a-form-item label="水印文字">
                <a-input v-model:value="formState.content" placeholder="Basic usage" />
              </a-form-item>
              <a-form-item label="字体颜色">
                <GColorPicker
                  v-model:value="formState.fontColor"
                  :presets="presets"
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
          </div>
        </div>
      </div>
    </div>
  </g-pro-page-container>
</template>

<style lang="less" module>
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
