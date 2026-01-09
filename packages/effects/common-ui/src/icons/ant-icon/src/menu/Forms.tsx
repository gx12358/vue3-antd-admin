import type { FunctionalComponent } from 'vue'

const FormsIcon: FunctionalComponent<any> = (props = {}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path fill="currentColor" d="M16 20.975v-3h-3v-2h3v-3h2v3h3v2h-3v3zM3 18v-2h2v2zm4 0v-2h4.075q-.075.525-.062 1t.087 1zm-4-4v-2h2v2zm4 0v-2h6.65q-.575.4-1.037.9T11.8 14zm-4-4V8h2v2zm4 0V8h12v2zM3 6V4h2v2zm4 0V4h12v2z" />
    </svg>
  )
}

export default FormsIcon
