import Result403 from '@/assets/error_images/403.png'
import Result404 from '@/assets/error_images/404.png'
import ResultCloud from '@/assets/error_images/cloud.png'
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

import './style.less'

export interface SubInfo {
  headline: string
  info: string
  exceptionImage: string
}

interface ResultSubInfo {
  404: SubInfo
  403: SubInfo
}

interface ResultState {
  jumpTime: number
  oops: string
  headline: string
  info: string
  btn: string
  timer: number | any
  exceptionImage: any
}

const resultSubInfo: ResultSubInfo = {
  '404': {
    headline: '当前页面不存在...',
    info: '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
    exceptionImage: Result404
  },
  '403': {
    headline: '您没有操作角色...',
    info: '当前帐号没有操作角色,请联系管理员。',
    exceptionImage: Result403
  }
}

export default defineComponent({
  props: {
    status: {
      type: String,
      required: true,
      default: '404'
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()

    const routers = computed(() => store.routes.routes)

    const backRouter = computed(() => (routers.value?.length ? '/' : '/user/login'))

    const state = reactive<ResultState>({
      jumpTime: 5,
      oops: '抱歉!',
      headline: '您没有操作角色...',
      info: '当前帐号没有操作角色,请联系管理员。',
      btn: `${routers.value?.length ? '返回首页' : '返回登录页'}`,
      timer: 0,
      exceptionImage: Result404
    })

    const handleBackRouter = () => {
      router.push({ path: backRouter.value })
      if (routers.value?.length) {
        console.log(222)
      } else {
        store.user.resetPermissions()
      }
      clearInterval(state.timer)
    }

    const timeChange = () => {
      state.timer = setInterval(() => {
        if (state.jumpTime) {
          state.jumpTime--
        } else {
          handleBackRouter()
        }
      }, 1000)
    }

    onMounted(() => {
      timeChange()
    })

    onBeforeUnmount(() => {
      clearInterval(state.timer)
    })

    watch(
      () => props.status,
      (val: string) => {
        Object.keys(resultSubInfo).map((item: string) => {
          if (item === val) {
            Object.keys(resultSubInfo[item]).map((el: any) => {
              state[el] = resultSubInfo[item][el]
              return el
            })
          }
          return item
        })
      },
      {
        deep: true,
        immediate: true
      }
    )

    return () => (
      <div class="error-container">
        <div class="error-content">
          <a-row gutter={20}>
            <a-col lg={12} md={12} sm={24} xl={12} xs={24}>
              <div class="pic-error">
                <img class="pic-error-parent" src={state.exceptionImage} />
                <img class={[ 'pic-error-child', 'left' ]} src={ResultCloud} />
              </div>
            </a-col>
            <a-col lg={12} md={12} sm={24} xl={12} xs={24}>
              <div class="bullshit">
                <div class="bullshit-oops">{state.oops}</div>
                <div class="bullshit-headline">{state.headline}</div>
                <div class="bullshit-info">{state.info}</div>
                <a class="bullshit-return-home" onClick={() => handleBackRouter()}>
                  {state.jumpTime}
                  s
                  &nbsp;
                  {state.btn}
                </a>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    )
  }
})
