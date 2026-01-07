import type { FunctionalComponent } from 'vue'

const LinesIcon: FunctionalComponent<any> = (props = {}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      {/* Icon from Humbleicons by Jiří Zralý - https://github.com/zraly/humbleicons/blob/master/license */}
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export default LinesIcon
