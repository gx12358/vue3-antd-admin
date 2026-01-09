<script setup lang="ts">
import { dataURLtoFile } from '@gx-design-vue/pro-utils'
import Cropper from 'cropperjs'

let cropper

const loading = ref(true)

const image = new Image()
image.src = '/img/image.jpg'
image.alt = 'Picture'

onMounted(() => {
  initCrop(image)
})

function initCrop(imageEl: HTMLImageElement) {
  if (cropper) cropper.destroy()

  cropper = new Cropper(imageEl, {
    container: '.gx-image-editor-canvas',
    template: `<cropper-canvas background>
  <cropper-image rotatable scalable skewable slottable translatable></cropper-image>
  <cropper-shade theme-color="rgba(255,255,255,0.4)"></cropper-shade>
  <cropper-handle action="move" plain></cropper-handle>
  <cropper-selection initial-aspect-ratio="1" initial-coverage="0.5" resizable shadow-root-mode="open" slottable>
    <cropper-handle plain action="move"></cropper-handle>
    <cropper-handle theme-color="rgba(0,0,0)" action="n-resize"></cropper-handle>
    <cropper-handle theme-color="rgba(0,0,0)" action="e-resize"></cropper-handle>
    <cropper-handle theme-color="rgba(0,0,0)" action="s-resize"></cropper-handle>
    <cropper-handle theme-color="rgba(0,0,0)" action="w-resize"></cropper-handle>
    <cropper-handle theme-color="rgba(0,0,0)" action="ne-resize"></cropper-handle>
    <cropper-handle theme-color="rgba(0,0,0)" action="nw-resize"></cropper-handle>
    <cropper-handle theme-color="rgba(0,0,0)" action="se-resize"></cropper-handle>
    <cropper-handle theme-color="rgba(0,0,0)" action="sw-resize"></cropper-handle>
  </cropper-selection>
</cropper-canvas>`
  })

  if (cropper.container) {
    const canvas = cropper.container.querySelector('cropper-canvas')
    const cropperImage = cropper.container.querySelector('cropper-image')
    const selection = cropper.container.querySelector('cropper-selection')
    if (cropperImage) {
      cropperImage.$ready(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
      cropperImage.addEventListener('transform', (event) => {
        const cropperCanvasRect = canvas.getBoundingClientRect()
        const cropperImageDiv = document.createElement('div')
        cropperImageDiv.style.cssText = `position: absolute; width: ${cropperImage.style.width}; height: ${cropperImage.style.height}; transform: matrix(${event.detail.matrix.join(', ')})`
        canvas.appendChild(cropperImageDiv)
        const cropperImageRect = cropperImageDiv.getBoundingClientRect()
        canvas.removeChild(cropperImageDiv)

        const maxSelection = {
          x: cropperImageRect.left - cropperCanvasRect.left,
          y: cropperImageRect.top - cropperCanvasRect.top,
          width: cropperImageRect.width,
          height: cropperImageRect.height,
        }

        if (!inSelection(selection, maxSelection)) {
          event.preventDefault()
        }
      })
    }
    if (selection) {
      selection.addEventListener('change', (event) => {
        if (!canvas) return

        const cropperCanvasRect = canvas.getBoundingClientRect()
        const selection = event.detail

        let maxSelection = {
          x: 0,
          y: 0,
          width: cropperCanvasRect.width,
          height: cropperCanvasRect.height,
        }

        if (!inSelection(selection, maxSelection)) {
          event.preventDefault()
          return
        }

        const cropperImageRect = cropperImage.getBoundingClientRect()
        maxSelection = {
          x: cropperImageRect.left - cropperCanvasRect.left,
          y: cropperImageRect.top - cropperCanvasRect.top,
          width: cropperImageRect.width,
          height: cropperImageRect.height,
        }

        if (!inSelection(selection, maxSelection)) {
          event.preventDefault()
        }
      })
    }
  }
}

function inSelection(selection, maxSelection) {
  return (
    selection.x >= maxSelection.x
    && selection.y >= maxSelection.y
    && (selection.x + selection.width) <= (maxSelection.x + maxSelection.width)
    && (selection.y + selection.height) <= (maxSelection.y + maxSelection.height)
  )
}

function onReset() {
  loading.value = true
  initCrop(image)
}

function onSelectRadio(radio: string) {
  const radioNum = radio.split(':').map(Number)
  if (cropper.container) {
    const selection = cropper.container.querySelector('cropper-selection')
    selection.setAttribute('aspect-ratio', radioNum[0] / radioNum[1])

    nextTick(() => {
      selection.$center()
    })
  }
}

function onRotateLeft() {
  if (cropper.container) {
    const cropperImage = cropper.container.querySelector('cropper-image')
    cropperImage.$rotate('-45deg')
  }
}

function onScale() {
  if (cropper.container) {
    const cropperImage = cropper.container.querySelector('cropper-image')
    cropperImage.$scale(-1, 1)
  }
}

async function onOk() {
  if (cropper.container) {
    const selection = cropper.container.querySelector('cropper-selection')
    const result = await selection.$toCanvas()
    // 转换为 Data URL (Base64)
    const dataURL = result.toDataURL('image/png') // 可以指定类型，如 'image/jpeg'
    return {
      file: dataURLtoFile(dataURL, 'cropper.png'),
      dataURL
    }
  }
}
</script>

<template>
  <div class="h-4rem" />
  <div style="max-width: 70rem;" class="mx-auto px-2rem">
    <div class="gx-image-editor">
      <div v-if="loading" class="gx-image-editor-loading">
        <a-spin spinning tip="loading image" />
      </div>
      <div class="gx-image-editor-root" :style="{ opacity: loading ? '0' : 1, visibility: loading ? 'hidden' : 'visible' }">
        <div class="gx-image-editor-nav">
          <a-button class="gx-image-editor-button gx-image-editor-nav-set" @click="onReset">
            <template #icon>
              <svg
                class="icon" width="24" height="24" viewBox="0 0 24
    24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" stroke-linecap="round" stroke-linejoin="round"
              >
                <g>
                  <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" stroke-width=".125em">
                    <path d="M7.388 18.538a8 8 0 10-2.992-9.03" />
                    <path fill="currentColor" d="M2.794 11.696L2.37 6.714l5.088 3.18z" />
                    <path d="M12 8v4M12 12l4 2" />
                  </g>
                </g>
              </svg>
            </template>
          </a-button>
          <a-button class="gx-image-editor-button rd-30px h-28px leading-2" type="primary" @click="onOk">
            <span class="text-[0.75em]">完成</span>
          </a-button>
        </div>
        <div class="gx-image-editor-nav-main">
          <a-dropdown :placement="'rightTop' as any">
            <a-button class="gx-image-editor-button gx-image-pannel-button">
              <svg
                class="icon" width="24" height="24" viewBox="0 0 24
    24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" stroke-linecap="round" stroke-linejoin="round"
              >
                <g>
                  <g fill="currentColor">
                    <rect opacity="0.2" x="2" y="4" width="10" height="18" rx="1" />
                    <rect opacity="0.3" x="4" y="8" width="14" height="14" rx="1" />
                    <rect opacity="0.4" x="6" y="12" width="17" height="10" rx="1" />
                  </g>
                </g>
              </svg>
              <span class="text-[.75em]">裁剪形状</span>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="onSelectRadio('1:1')">
                  1:1
                </a-menu-item>
                <a-menu-item @click="onSelectRadio('2:1')">
                  2:1
                </a-menu-item>
                <a-menu-item @click="onSelectRadio('3:2')">
                  3:2
                </a-menu-item>
                <a-menu-item @click="onSelectRadio('4:3')">
                  4:3
                </a-menu-item>
                <a-menu-item @click="onSelectRadio('5:4')">
                  5:4
                </a-menu-item>
                <a-menu-item @click="onSelectRadio('16:10')">
                  16:10
                </a-menu-item>
                <a-menu-item @click="onSelectRadio('16:9')">
                  16:9
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-button class="gx-image-editor-button gx-image-pannel-button" @click="onScale">
            <svg
              class="icon" width="24" height="24" viewBox="0 0 24
    24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" stroke-linecap="round" stroke-linejoin="round"
            ><g><g stroke="none" fill="currentColor"><path d="M11.93 7.007V20a1 1 0 0 1-1 1H5.78a1 1 0 0 1-.93-1.368l5.15-12.993a1 1 0 0 1 1.929.368z" /><path d="M14 7.007V20a1 1 0 0 0 1 1h5.149a1 1 0 0 0 .93-1.368l-5.15-12.993A1 1 0 0 0 14 7.007z" opacity=".6" /></g></g></svg>
            <span class="text-[.75em]">水平翻转</span>
          </a-button>
          <a-button class="gx-image-editor-button gx-image-pannel-button" @click="() => onRotateLeft()">
            <svg
              class="icon" width="24" height="24" viewBox="0 0 24
    24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" stroke-linecap="round" stroke-linejoin="round"
            ><g><g stroke="none" fill="currentColor"><path fill="none" d="M-1-1h582v402H-1z" /><rect x="3" rx="1" height="12" width="12" y="9" /><path d="M15 5h-1a5 5 0 015 5 1 1 0 002 0 7 7 0 00-7-7h-1.374l.747-.747A1 1 0 0011.958.84L9.603 3.194a1 1 0 000 1.415l2.355 2.355a1 1 0 001.415-1.414l-.55-.55H15z" /></g></g></svg>
            <span class="text-[.75em]">向左旋转</span>
          </a-button>
        </div>
        <div class="gx-image-editor-main">
          <div class="gx-image-editor-panel">
            <div class="gx-image-editor-util-header" />
            <div class="gx-image-editor-util-main">
              <div class="gx-image-editor-canvas" />
            </div>
            <div class="gx-image-editor-util-footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.gx-image-editor {
  position: relative;
  max-width: 100%;
  min-width: 20em;
  height: 42em;
  max-height: calc(100vh - 4em);
  min-height: 30em;
  font-size: 16px;

  * {
    box-sizing: content-box;
    word-wrap: normal;
  }

  .gx-image-editor-button {
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: inherit;
    pointer-events: all;

    .icon {
      width: 1em;
      height: 1em;
    }
  }

  .gx-image-editor-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
  }

  .gx-image-editor-root {
    transition: background-color 1ms, outline-color 1ms, color 0.1s ease-in-out, dir 1ms;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    padding: 1em;
    overflow: hidden;
    border-radius: .325rem;
    display: grid;
    text-align: left;
    text-transform: none;
    text-rendering: optimizeLegibility;
    grid-template-rows: min-content auto;
    grid-template-columns: auto;
    grid-template-columns: 6em auto;

    .gx-image-editor-nav {
      max-width: 100%;
      box-sizing: border-box;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      grid-row: 1;
      grid-column: 1;
      z-index: 3;
      grid-column: 1 / span 2;

      .gx-image-editor-nav-set {
        width: 1.75em;
        height: 1.75em;
        justify-content: center;
        padding: 0;
        border-radius: 50%;
      }
    }

    .gx-image-editor-nav-main {
      display: flex;
      overflow: hidden;
      z-index: 3;
      flex-direction: column;
      gap: 0.5em;
      position: absolute;
      left: 1em;
      top: 4em;
      bottom: 4em;

      .gx-image-pannel-button {
        line-height: 1.1;
        height: auto;
        flex-direction: column;
        justify-content: center;
      }
    }

    .gx-image-editor-main {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr;
      max-width: 100vw;
      grid-row: 2;
      grid-column: 2;

      .gx-image-editor-panel {
        pointer-events: all;
        padding-top: .5em;
        padding-bottom: .5em;
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        contain: layout size;
        box-sizing: border-box;

        .gx-image-editor-util-header {
          padding-top: .5em;
          padding-bottom: .5em;

          .gx-image-editor-tools-bar {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 1em;
          }
        }

        .gx-image-editor-util-main {
          pointer-events: all;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0 1rem 1rem 1rem;
          min-height: 1px;
          touch-action: none;

          .gx-image-editor-canvas {
            width: 100%;
            height: 100%;

            :deep(cropper-canvas) {
              width: 100%;
              height: 100%;

              cropper-image {
                transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
              }

              cropper-handle[action$=-resize]:after {
                width: 8px;
                height: 8px;
                border-radius: 50%;
              }
            }
          }
        }

        .gx-image-editor-util-footer {
          padding: 1rem 1rem 1rem 0;
        }
      }
    }

    &::after {
      border-radius: inherit;
      content: "";
      height: 100%;
      left: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      width: 100%;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1), 0 0 0 2px #fff;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .1), 0 0 0 2px hsl(var(--color-background));
    }
  }
}
</style>
