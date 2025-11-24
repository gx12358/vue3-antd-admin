import type { ExtraMaterialListItem, MaterialListItem } from '@gx/design'
import { GUpload, proUploadProps } from '@gx/design'
import { defineComponent, ref } from 'vue'
import { useUpload } from '@/hooks/system'

const GAdminUpload = defineComponent({
  name: 'GAdminUpload',
  props: {
    ...proUploadProps,
    previewPathFn: Function as PropType<(name: string) => Promise<string>>,
    uploadBefore: Function as PropType<() => Promise<void>>,
  },
  emits: {
    change: (_urls: string[], _data: MaterialListItem[]) => true,
  },
  setup(props, { slots }) {
    const { upload } = useUpload()

    const dataExtraInfo = ref<ExtraMaterialListItem[]>([])

    const uploadHttps = async (file, id) => {
      props.uploadBefore && await props.uploadBefore?.()

      const response = await upload({
        file,
        progressCallback: props.progress ? (progress) => {
          dataExtraInfo.value.push({ id, progress })
        } : undefined
      })

      let previewUrl = response.previewUrl

      if (response.code === 200) {
        if (id) {
          if (dataExtraInfo.value.some(item => item.id === id)) {
            dataExtraInfo.value = dataExtraInfo.value.map((item) => {
              if (item.id === id) {
                return { ...item, ossObjectName: response.name }
              }
              return item
            })
          } else {
            dataExtraInfo.value.push({ id, ossObjectName: response.name })
          }
          if (props.previewPathFn) {
            previewUrl = await props.previewPathFn(response.name || '')
          }
        }
      }

      return {
        code: response.code,
        data: {
          url: previewUrl,
          previewUrl
        }
      }
    }

    return () => {
      return (
        <GUpload
          {...props}
          dataExtraInfo={dataExtraInfo.value}
          request={uploadHttps}
          v-slots={slots}
        />
      )
    }
  }
})

export default GAdminUpload
