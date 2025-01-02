import { type ProLayoutExpose, useProLayout } from '@gx-design-vue/pro-layout'
import { computed } from 'vue'

export default function () {
  const router = useRouter()
  const { layout } = useStore()

  const { tabsRouter } = useProLayout(computed(() => layout.proLayoutRef as ProLayoutExpose))

  const routerBack = (path: string) => {
    router.push({ path })
    tabsRouter.close()
  }

  return {
    tabsRouter,
    routerBack
  }
}
