import { visualizer } from 'rollup-plugin-visualizer'
import { isReportMode } from '../../util'

export function configVisualizerConfig() {
  if (isReportMode()) {
    return visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    }) as Plugin
  }
  return []
}
