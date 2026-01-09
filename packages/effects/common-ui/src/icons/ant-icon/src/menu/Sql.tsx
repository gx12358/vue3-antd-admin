import type { FunctionalComponent } from 'vue'

const MySqlIcon: FunctionalComponent<any> = (props = {}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
{/* Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE */}
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M14 3v4a1 1 0 0 0 1 1h4M5 20.25c0 .414.336.75.75.75H7a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H6a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1.25a.75.75 0 0 1 .75.75" />
        <path d="M5 12V5a2 2 0 0 1 2-2h7l5 5v4m-1 3v6h2m-7-6a2 2 0 0 1 2 2v2a2 2 0 1 1-4 0v-2a2 2 0 0 1 2-2m1 5l1.5 1.5" />
      </g>
    </svg>
  )
}

export default MySqlIcon
