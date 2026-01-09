import type { FunctionalComponent } from 'vue'

const UploadCloudIcon: FunctionalComponent<any> = (props = {}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
{/* Icon from Remix Icon by Remix Design - https://github.com/Remix-Design/RemixIcon/blob/master/License */}
      <path fill="currentColor" d="M7 20.981a6.5 6.5 0 0 1-2.936-12a8.001 8.001 0 0 1 15.872 0a6.5 6.5 0 0 1-2.936 12V21H7zM13 13h3l-4-5l-4 5h3v4h2z" />
    </svg>
  )
}

export default UploadCloudIcon
