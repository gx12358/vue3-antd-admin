<script setup lang="ts">
import type { Editor as TinyMCEEditor } from 'tinymce'
import GProEditor from '@gx-design/Editor'
import { useUpload } from '@/hooks/system'

defineOptions({
  name: 'GProEditor'
})

const { upload } = useUpload()

const loading = ref(false)
const editors = ref()
const inputFile = ref<HTMLInputElement>()
const content = defineModel('value', {
  type: String,
  default: ''
})
const plugins = ref([
  'directionality advlist autolink lists link image charmap print preview anchor',
  'searchreplace visualblocks code fullscreen',
  'insertdatetime media table paste code wordcount codesample hr'
])
const toolbar = ref([
  'upload | ' + 'code | undo redo | ' + 'bold italic underline strikethrough subscript superscript blockquote | ' + 'forecolor backcolor bullist numlist selectall newdocument | ' + 'fullscreen | ' + 'formatselect fontsizeselect | ' + 'ltr rtl | ' + 'alignleft aligncenter alignright alignjustify | ' + 'link anchor | ' + 'codesample | ' + 'hr charmap | ' + 'table | ' + 'print searchreplace | '
])

const handleAddButton = (e: TinyMCEEditor) => {
  e.ui.registry.addButton('upload', {
    text: `上传图片`,
    tooltip: '上传图片',
    onAction: () => {
      if (inputFile.value) {
        inputFile.value.value = ''
        inputFile.value.click()
      }
    }
  })
}

async function uploadImage(e) {
  const file = e.target.files[0]
  if (file) {
    loading.value = true
    const response = await upload({
      file,
    })
    if (response.code === 200) {
      const previewUrl = response.previewUrl
      const raf = editors.value.getEditor()
      raf.insertContent(`<img src="${previewUrl}" />`)
    }
    loading.value = false
  }
}
</script>

<template>
  <g-spin :spinning="loading">
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
  </g-spin>
  <input ref="inputFile" class="!hidden" type="file" accept="image/*" @change="uploadImage">
</template>

<style scoped lang="less">

</style>
