import { defineComponent, onMounted, reactive, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

const WInputSearch = defineComponent({
  props: {
    searchValue: {
      type: [String, Number],
      required: true
    },
    actionRef: {
      type: Function,
      required: false
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      value: props.searchValue
    })
    onMounted(() => {
      if (props.actionRef) getInputSearch()
    })
    watch(
      () => props,
      (val) => {
        state.value = val.searchValue
      },
      {
        deep: true,
        immediate: true
      }
    )
    /**
     * @Author      gx12358
     * @DateTime    2021/7/16
     * @lastTime    2021/7/16
     * @description 获取pro-table内部方法
     */
    const getInputSearch = () => {
      props.actionRef({
        changeValue: (value) => (state.value = value)
      })
    }
    const handleChange = (e) => {
      state.value = e.target.value
    }
    const handleSearch = (value) => {
      state.value = value
      emit('update:searchValue', value)
    }
    return () => (
      <a-input-search
        {...props}
        value={state.value}
        enterButton={
          <a-button>
            <SearchOutlined />
          </a-button>
        }
        onChange={handleChange}
        onSearch={handleSearch}
      />
    )
  }
})
export default WInputSearch
