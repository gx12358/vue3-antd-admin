import type { FunctionalComponent } from 'vue'

const AuthIcon: FunctionalComponent<any> = (props = {}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
{/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
      <path fill="currentColor" d="M2 7v2h4v2H4a2 2 0 0 0-2 2v4h6v-2H4v-2h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm7 0v10h2v-4h3v-2h-3V9h4V7zm9 0a2 2 0 0 0-2 2v8h2v-3h2v3h2V9a2 2 0 0 0-2-2zm0 2h2v3h-2z" />
    </svg>
  )
}

export default AuthIcon
