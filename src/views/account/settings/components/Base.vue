<script setup lang="ts">
import type { RulesState } from '@gx-admin/hooks/system'
import type { UserDetails } from '@gx-mock/config/user'
import cityOptions from '@/assets/json/china.json'
import { updateUserDetails } from '@/services/userCenter'
import { isEmail, isPhone } from '@/utils/validate'
import { useRequest } from '@gx-admin/hooks/core'
import { useForm } from '@gx-admin/hooks/system'
import { GUpload } from '@gx-design/Upload'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'

type UserFormState = UserDetails & { adressCode?: string[] }

const { user } = useStore()
const { run, loading } = useRequest(updateUserDetails, {
  manual: true,
  onSuccess: () => message.success('操作成功！')
})

const formState = reactive<UserFormState>({
  ...user.userInfo,
  adressCode: user.userInfo.provinceCode && user.userInfo.cityCode
    ? [ user.userInfo.provinceCode, user.userInfo.cityCode, user.userInfo.districtCode ]
    : []
})

const ruleState = reactive<RulesState<UserFormState>>({
  nickName: [
    {
      required: true,
      message: '请输入昵称！'
    }
  ],
  email: [
    {
      required: true,
      pattern: isEmail('', true),
      message: '请输入正确的邮箱地址！'
    }
  ],
  adressCode: [
    {
      required: true,
      message: '请选择国家/地区！'
    }
  ],
  introduction: [
    {
      required: true,
      message: '请输入个人简介！'
    }
  ],
  phone: [
    {
      required: true,
      pattern: isPhone('', true),
      message: '请输入正确的联系电话！'
    }
  ],
})

const { resetFields, validateInfos, validate } = useForm<UserFormState>(formState, ruleState)

watch(() => user.userInfo, state => Object.assign(formState, { ...state }), { deep: true })

const filter = (inputValue, path) => path.some(option => option.label?.toLowerCase()
  .indexOf(inputValue.toLowerCase()) > -1)

const submitInfos = () => {
  validate().then((_) => {
    run(unref(formState))
  }).catch((_) => {})
}
</script>

<template>
  <div class="leading-28px text-20px mb-12px font-500 text-rgba-[0-0-0-0.88]">
    基本设置
  </div>
  <g-spin :spinning="loading">
    <a-form :colon="false" layout="vertical">
      <div class="flex gap-100px">
        <div class="flex-main-448">
          <a-form-item v-bind="validateInfos.nickName" label="昵称">
            <a-input v-model:value="formState.nickName" allow-clear placeholder="请输入昵称" />
          </a-form-item>
          <a-form-item v-bind="validateInfos.introduction" label="个人简介">
            <a-textarea v-model:value="formState.introduction" :auto-size="{ minRows: 5 }" allow-clear placeholder="请输入个人简介" />
          </a-form-item>
          <a-form-item v-bind="validateInfos.adressCode" label="国家/地区">
            <a-cascader
              v-model:value="formState.adressCode"
              style="width: 100%"
              allow-clear
              :dropdown-style="{ minWidth: '400px' }"
              :options="cityOptions"
              :show-search="{ filter }"
              placeholder="请选择国家/地区"
              :get-popup-container="(trigger) => trigger.parentNode"
            />
          </a-form-item>
          <a-form-item v-bind="validateInfos.email" label="邮箱">
            <a-input v-model:value="formState.email" type="email" allow-clear placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item v-bind="validateInfos.phone" label="联系电话">
            <a-input v-model:value="formState.phone" :maxlength="11" show-count type="number" allow-clear placeholder="请输入联系电话" />
          </a-form-item>
        </div>
        <div class="flex-main">
          <a-form-item v-bind="validateInfos.avatar" label="头像">
            <GUpload
              :limit="1"
              :data-list="[ formState.avatar ]"
              :progress="false"
              :card-style="{ width: '144px', height: '144px' }"
              show-editor
              shape="circle"
              @change="list => formState.avatar = list.join()"
            />
          </a-form-item>
        </div>
      </div>
      <a-button @click="resetFields">
        重置基本信息
      </a-button>
      <a-button type="primary" class="ml-10px" @click="submitInfos">
        更新基本信息
      </a-button>
    </a-form>
  </g-spin>
</template>

<style scoped lang="less">

</style>
