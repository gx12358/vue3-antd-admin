import { useProLayout } from '@gx-design-vue/pro-layout'
import { computed } from 'vue'
import { useStore } from '@/store'

export default function () {
  const router = useRouter()
  const { layout } = useStore()

  const { tabsRouter } = useProLayout(computed(() => layout.proLayout))

  const routerBack = (path: string) => {
    router.push({ path })
    tabsRouter.close()
  }

  return {
    tabsRouter,
    routerBack
  }
}
