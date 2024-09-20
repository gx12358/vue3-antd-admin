<script setup lang="ts">
import type { Editor as TinyMCEEditor } from 'tinymce'
import Localization from '@/assets/public_images/localization.png'
import GProEditor from '@gx-design/ProEditor'
import { ref } from 'vue'

const editors = ref()
const content = ref('<p>hello world</p>')
const plugins = ref([
  'directionality advlist autolink lists link image charmap print preview anchor',
  'searchreplace visualblocks code fullscreen',
  'insertdatetime media table paste code wordcount codesample hr'
])
const toolbar = ref([
  'locale | upload | ' + 'code | undo redo | ' + 'bold italic underline strikethrough subscript superscript blockquote | ' + 'forecolor backcolor bullist numlist selectall newdocument | ' + 'fullscreen | ' + 'formatselect fontsizeselect | ' + 'ltr rtl | ' + 'alignleft aligncenter alignright alignjustify | ' + 'link anchor | ' + 'codesample | ' + 'hr charmap | ' + 'table | ' + 'print searchreplace | '
])

const handleAddButton = (e: TinyMCEEditor) => {
  e.ui.registry.addButton('upload', {
    text: `上传文件`,
    tooltip: '上传文件',
    onAction: () => console.log(123)
  })
  e.ui.registry.addButton('locale', {
    text: `<img src="${Localization}" />`,
    tooltip: '自定义工具',
    onAction: () => e.insertContent(`&nbsp;<strong>It's my button!</strong>&nbsp;`)
  })
}
</script>

<template>
  <g-pro-page-container>
    <GProEditor
      ref="editors"
      v-model="content"
      :init="{
        height: 500,
        setup: (editor) => {
          handleAddButton(editor)
        },
      }"
      :plugins="plugins"
      :toolbar="toolbar"
    />
  </g-pro-page-container>
</template>

<style lang="less" module></style>
