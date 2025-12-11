<script setup lang="ts">
import { useMediaQuery } from '@gx-design-vue/pro-hooks'
import TableTabs from './components/TableTabs/index.vue'
import { provideAdvancedContext } from './context'

const colSize = useMediaQuery()

const tabActiveKey = ref('detail')

const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs' || colSize.value === 'md')

provideAdvancedContext({
  isMobile
})
</script>

<template>
  <g-pro-page-container :use-page-card="false">
    <template #contentRender>
      <div class="flex items-center justify-between">
        <div class="font-600 text-20px leading-32px text-hidden-1">
          单号：234231029431
        </div>
        <a-dropdown-button v-if="isMobile" type="primary" placement="bottomRight">
          <template #icon>
            <down-outlined />
          </template>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">
                操作一
              </a-menu-item>
              <a-menu-item key="2">
                操作二
              </a-menu-item>
              <a-menu-item key="3">
                选项一
              </a-menu-item>
              <a-menu-item key="4">
                选项二
              </a-menu-item>
              <a-menu-item key="5">
                选项三
              </a-menu-item>
            </a-menu>
          </template>
          主操作
        </a-dropdown-button>
        <div v-else class="flex gap-8px">
          <a-button-group>
            <a-button>操作一</a-button>
            <a-button>操作二</a-button>
            <a-dropdown placement="bottomRight">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">
                    选项一
                  </a-menu-item>
                  <a-menu-item key="2">
                    选项二
                  </a-menu-item>
                  <a-menu-item key="3">
                    选项三
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <EllipsisOutlined />
              </a-button>
            </a-dropdown>
          </a-button-group>
          <a-button type="primary">
            主操作
          </a-button>
        </div>
      </div>
      <div class="w-full flex gap-20px mt-12px lt-xs:flex-wrap lt-sm:flex-wrap">
        <a-descriptions size="small" :column="isMobile ? 1 : 2">
          <a-descriptions-item label="创建人">
            曲丽丽
          </a-descriptions-item>
          <a-descriptions-item label="订购产品">
            XX 服务
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            2017-07-07
          </a-descriptions-item>
          <a-descriptions-item label="关联单据">
            <a>12421</a>
          </a-descriptions-item>
          <a-descriptions-item label="生效日期">
            2017-07-07 ~ 2017-08-08
          </a-descriptions-item>
          <a-descriptions-item label="备注">
            请于两个工作日内确认
          </a-descriptions-item>
        </a-descriptions>
        <div class="flex-main flex justify-between min-w-200px">
          <a-statistic title="状态" value="待审批" />
          <a-statistic title="订单金额" :value="568.08" prefix="¥" />
        </div>
      </div>
    </template>
    <a-tabs v-model:active-key="tabActiveKey">
      <a-tab-pane key="detail" tab="详情" />
      <a-tab-pane key="rule" tab="规则" />
    </a-tabs>
    <div class="mt-16px gx-card">
      <div class="gx-card-header">
        流程进度
      </div>
      <div class="gx-card-body">
        <a-steps :direction="isMobile ? 'vertical' : 'horizontal'" :current="1">
          <template #progressDot="{ status, prefixCls }">
            <a-popover v-if="status === 'process'" placement="topLeft" arrow-point-at-center>
              <template #content>
                <div class="w-160px">
                  吴加号
                  <div class="float-right">
                    <a-badge status="default">
                      <template #text>
                        <span class="text-grba-[0-0-0-0.45]">未响应</span>
                      </template>
                    </a-badge>
                  </div>
                  <div class="mt-4px">
                    耗时：2小时25分钟
                  </div>
                </div>
              </template>
              <span :class="`${prefixCls}-icon-dot`" />
            </a-popover>
            <span v-else :class="`${prefixCls}-icon-dot`" />
          </template>
          <a-step title="创建项目">
            <template #description>
              <div class="step-description">
                <div>
                  曲丽丽
                  <dingding-outlined class="ml-8px" />
                </div>
                <div>2016-12-12 12:32</div>
              </div>
            </template>
          </a-step>
          <a-step title="部门初审">
            <template #description>
              <div class="step-description">
                <div>
                  周毛毛
                  <dingding-outlined class="text-primary ml-8px" />
                </div>
                <div><a>催一下</a></div>
              </div>
            </template>
          </a-step>
          <a-step title="财务复核" />
          <a-step title="完成" />
        </a-steps>
      </div>
    </div>
    <div class="mt-16px gx-card">
      <div class="gx-card-header">
        用户信息
      </div>
      <div class="gx-card-body">
        <a-descriptions class="mb-24px">
          <a-descriptions-item label="用户姓名">
            付小小
          </a-descriptions-item>
          <a-descriptions-item label="会员卡号">
            32943898021309809423
          </a-descriptions-item>
          <a-descriptions-item label="身份证">
            3321944288191034921
          </a-descriptions-item>
          <a-descriptions-item label="联系方式">
            18112345678
          </a-descriptions-item>
          <a-descriptions-item label="联系地址">
            曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions class="mb-24px" title="信息组">
          <a-descriptions-item label="某某数据">
            725
          </a-descriptions-item>
          <a-descriptions-item label="该数据更新时间">
            2017-08-08
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span>
                某某数据
                <a-tooltip title="数据说明">
                  <info-circle-outlined class="ml-4px" />
                </a-tooltip>
              </span>
            </template>
            725
          </a-descriptions-item>
          <a-descriptions-item label="该数据更新时间">
            2017-08-08
          </a-descriptions-item>
        </a-descriptions>
        <h4 class="mb-16px">
          信息组
        </h4>
        <div class="gx-card">
          <div class="gx-card-header !bg-fill-alter">
            多层级信息组
          </div>
          <div class="gx-card-body">
            <a-descriptions class="mb-16px" title="组名称">
              <a-descriptions-item label="负责人">
                林东东
              </a-descriptions-item>
              <a-descriptions-item label="角色码">
                1234567
              </a-descriptions-item>
              <a-descriptions-item label="所属部门">
                XX公司 - YY部
              </a-descriptions-item>
              <a-descriptions-item label="过期时间">
                2017-08-08
              </a-descriptions-item>
              <a-descriptions-item label="描述">
                这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
              </a-descriptions-item>
            </a-descriptions>
            <a-divider class="!my-16px" />
            <a-descriptions class="mb-16px" title="组名称" :column="1">
              <a-descriptions-item label="学名">
                Citrullus lanatus (Thunb.) Matsum. et
                Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..
              </a-descriptions-item>
            </a-descriptions>
            <a-divider class="!my-16px" />
            <a-descriptions title="组名称">
              <a-descriptions-item label="负责人">
                付小小
              </a-descriptions-item>
              <a-descriptions-item label="角色码">
                1234568
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-16px gx-card">
      <div class="gx-card-header">
        用户近半年来电记录
      </div>
      <div class="gx-card-body flex-center">
        <g-empty />
      </div>
    </div>
    <TableTabs />
  </g-pro-page-container>
</template>

<style lang="less" scoped>
@import "./style";
</style>
