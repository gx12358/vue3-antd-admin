<template>
  <div :class="$style.baseView">
    <template v-if="loading">
      <div :class="$style.skeletonContent">
        <Skeleton avatar :paragraph="{ rows: 6 }" />
      </div>
    </template>
    <template v-else>
      <div :class="$style.left">
        <a-form layout="vertical">
          <a-form-item label="邮箱" v-bind="validateInfos.email">
            <a-input
              :style="{ width: isMobile ? '100%' : '328px' }"
              v-model:value="formState.email"
              placeholder="请输入您的邮箱"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="昵称" v-bind="validateInfos.name">
            <a-input
              :style="{ width: isMobile ? '100%' : '328px' }"
              v-model:value="formState.name"
              placeholder="请输入您的昵称"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="个人简介" v-bind="validateInfos.profile">
            <a-textarea
              :style="{ width: isMobile ? '100%' : '440px' }"
              v-model:value="formState.profile"
              :auto-size="{ minRows: 4 }"
              placeholder="请输入个人简介"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="国家/地区" v-bind="validateInfos.country">
            <a-select
              :style="{ width: isMobile ? '100%' : '216px' }"
              show-search
              optionFilterProp="text"
              placeholder="请输入您的国家或地区"
              v-model:value="formState.country"
              allow-clear
            >
              <a-select-option value="China" text="中国">中国</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="所在省市">
            <a-space
              :class="{
                [`${$style.formGroupContainer}`]: true,
                [`${$style.mobile}`]: isMobile
              }"
            >
              <a-form-item v-bind="validateInfos.province">
                <a-select
                  :style="{ width: isMobile ? '100%' : '216px' }"
                  show-search
                  allow-clear
                  placeholder="请输入您的所在省"
                  option-filter-prop="text"
                  v-model:value="formState.province"
                  :class="$style.item"
                  :getPopupContainer="
                    (trigger) => {
                      if (trigger && trigger.parentNode) {
                        return trigger.parentNode
                      }
                      return trigger
                    }
                  "
                  :not-found-content="provinceFetching ? undefined : null"
                  @change="handleChangeProvince"
                >
                  <template v-if="provinceFetching" #notFoundContent>
                    <a-spin size="small" />
                  </template>
                  <a-select-option
                    v-for="item in provinceData"
                    :key="item.value"
                    :value="item.value"
                    :text="item.label"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item v-bind="validateInfos.city">
                <a-select
                  :style="{ width: isMobile ? '100%' : '216px' }"
                  show-search
                  allow-clear
                  placeholder="请输入您的所在城市"
                  option-filter-prop="text"
                  v-model:value="formState.city"
                  :getPopupContainer="
                    (trigger) => {
                      if (trigger && trigger.parentNode) {
                        return trigger.parentNode
                      }
                      return trigger
                    }
                  "
                  :class="$style.item"
                  :disabled="!formState.province"
                  :not-found-content="cityFetching ? undefined : null"
                >
                  <template v-if="cityFetching" #notFoundContent>
                    <a-spin size="small" />
                  </template>
                  <a-select-option
                    v-for="item in cityData"
                    :key="item.value"
                    :value="item.value"
                    :text="item.label"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-space>
          </a-form-item>
          <a-form-item label="街道地址" v-bind="validateInfos.address">
            <a-input
              :style="{ width: isMobile ? '100%' : '328px' }"
              v-model:value="formState.address"
              placeholder="请输入您的街道地址"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="街道地址" v-bind="validateInfos.phone">
            <a-input-group>
              <a-space>
                <a-input
                  :style="{ width: isMobile ? '100%' : '80px' }"
                  placeholder="请输入"
                  v-model:value="formState.phoneCode"
                  @change="(e) => handleChangePhone(e, 0)"
                />
                <a-input
                  :style="{ width: isMobile ? '100%' : '214px' }"
                  placeholder="请输入电话号码"
                  v-model:value="formState.phoneNumber"
                  @change="(e) => handleChangePhone(e, 1)"
                />
              </a-space>
            </a-input-group>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="onSubmit">提交</a-button>
            <a-button style="margin-left: 10px" @click="onResetFields">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div :class="$style.right">
        <div :class="$style.avatar_title">头像</div>
        <div :class="$style.avatar">
          <g-image :src="formState.avatar" fit="cover" />
        </div>
        <g-upload listType="text" :limit="1" @change="handleChange">
          <div :class="$style.button_view">
            <a-button>
              <UploadOutlined />
              更换头像
            </a-button>
          </div>
        </g-upload>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs, toRaw } from 'vue'
import { Form, message, Skeleton } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { CurrentUser } from '@/services/account/typings'
import { queryCurrent, queryProvince, queryCity } from '@/services/account/settings'
import useMediaQuery from '@/hooks/event/useMediaQuery'
import { hanndleField } from '@/utils/util'
import { rules } from '../utils/config'

const useForm = Form.useForm

export default defineComponent({
  components: { UploadOutlined, Skeleton },
  setup() {
    const colSize = useMediaQuery()

    const state = reactive({
      loading: false,
      cityData: [] as { label: string; value: string }[],
      provinceData: [] as { label: string; value: string }[],
      cityFetching: false,
      provinceFetching: false,
      currentUser: {} as CurrentUser,
      formState: {
        email: '',
        name: '',
        profile: '',
        country: undefined,
        province: undefined as string | undefined,
        city: undefined as string | undefined,
        address: '',
        phone: '',
        phoneCode: '',
        phoneNumber: '',
        avatar: ''
      }
    })

    const rulesRef = reactive({ ...rules })

    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')

    onMounted(async () => {
      state.loading = true
      provinceData()
      const response: any = await queryCurrent()
      if (response) {
        state.currentUser = response.data || {}
        for (let i in response.data) {
          switch (i) {
            case 'country':
              state.formState[i] = response.data[i] || undefined
              break
            case 'province':
              state.formState[i] = response.data[i] || undefined
              break
            case 'city':
              state.formState[i] = response.data[i] || undefined
              break
            case 'geographic':
              if (response.data[i] && response.data[i]?.province?.key)
                handleChangeProvince(
                  response.data[i]?.province?.key || '',
                  response.data[i]?.city?.key || ''
                )
              state.formState[i] = response.data[i]
              break
            case 'phone':
              state.formState.phoneCode = response.data[i] ? response.data[i].split('-')[0] : ''
              state.formState.phoneNumber = response.data[i] ? response.data[i].split('-')[1] : ''
              state.formState[i] = response.data[i] || ''
              break
            default:
              state.formState[i] = hanndleField(response.data[i], '').value
              break
          }
        }
      }
      state.loading = false
    })

    const { resetFields, validate, validateInfos } = useForm(state.formState, rulesRef)

    const provinceData = async () => {
      state.provinceFetching = true
      const response = await queryProvince()
      if (response) {
        state.provinceData = (response.data || []).map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
        state.formState.province = state.currentUser.geographic?.province?.key || undefined
      }
      state.provinceFetching = false
    }

    const handleChangeProvince = async (value: string, cityCode?: any) => {
      state.cityFetching = true
      const response = await queryCity(value)
      if (response) {
        state.cityData = (response.data || []).map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
        if (cityCode) state.formState.city = cityCode
      }
      state.cityFetching = false
    }

    const handleChangePhone = (e, type) => {
      if (type === 0) {
        state.formState.phone = `${e.target.value}-${state.formState.phone.split('-')[1]}`
      } else {
        state.formState.phone = `${state.formState.phone.split('-')[0]}-${e.target.value}`
      }
    }

    const onResetFields = () => {
      const newValues: any = {}
      for (let i in state.currentUser) {
        switch (i) {
          case 'country':
            newValues[i] = state.currentUser[i] || undefined
            break
          case 'province':
            newValues[i] = state.currentUser[i] || undefined
            break
          case 'city':
            newValues[i] = state.currentUser[i] || undefined
            break
          case 'phone':
            newValues.phoneCode = state.currentUser[i] ? state.currentUser[i].split('-')[0] : ''
            newValues.phoneNumber = state.currentUser[i] ? state.currentUser[i].split('-')[1] : ''
            newValues[i] = state.currentUser[i] || ''
            break
          default:
            newValues[i] = hanndleField(state.currentUser[i], '').value
            break
        }
      }
      resetFields(newValues)
    }

    const handleChange = (urls: string[]) => {
      state.formState.avatar = urls.join()
    }

    const onSubmit = () => {
      validate()
        .then(() => {
          console.log(toRaw(state.formState))
        })
        .catch((_) => {})
    }

    const handleFinish = async () => {
      message.success('更新基本信息成功')
    }

    return {
      ...toRefs(state),
      isMobile,
      handleChange,
      resetFields,
      validateInfos,
      onSubmit,
      onResetFields,
      handleFinish,
      handleChangePhone,
      handleChangeProvince
    }
  }
})
</script>

<style lang="less" module>
.baseView {
  display: flex;
  padding-top: 12px;

  :global {
    .ant-legacy-form-item .ant-legacy-form-item-control-wrapper {
      width: 100%;
    }
  }

  .skeletonContent {
    flex: 1;
  }

  .left {
    min-width: 224px;
    max-width: 448px;
  }

  .right {
    flex: 1;
    padding-left: 104px;

    .avatar_title {
      height: 22px;
      margin-bottom: 8px;
      font-size: @font-size-base;
      line-height: 22px;
      color: @heading-color;
    }

    .avatar {
      width: 144px;
      height: 144px;
      margin-bottom: 12px;
      overflow: hidden;
      border-radius: 50%;

      :global {
        .gx-image {
          width: 144px;
          height: 144px;
        }
      }

      img {
        width: 100%;
      }
    }

    .button_view {
      width: 144px;
      text-align: center;
    }
  }
}

.area_code {
  width: 72px;
}

.phone_number {
  width: 214px;
}

.formGroupContainer {
  flex-wrap: wrap;
  max-width: 100%;

  &.mobile {
    flex: 1;
    width: 100%;

    :global {
      div.ant-space-item {
        flex: 1;
      }
    }
  }

  :global {
    div.ant-space-item {
      max-width: 100%;

      .ant-form-item {
        margin-bottom: 0;

        .ant-form-item-explain,
        .ant-form-item-extra {
          display: none;
        }
      }
    }
  }
}

@media screen and (max-width: @screen-xl) {
  .baseView {
    flex-direction: column-reverse;

    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 448px;
      padding: 20px;

      .avatar_title {
        display: none;
      }
    }
  }
}
</style>
