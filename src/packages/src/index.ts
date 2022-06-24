import { Viewer } from 'cesium'
import { setViewer } from './core/viewer'
import * as measure from './core/measure'
import { ToolsOptions } from './core/types'

const useCesiumTools = () => {
  return { ...measure }
}
const initCesiumTools = (
  viewer: Viewer,
  options: ToolsOptions = { showToolBar: true }
) => {
  setViewer(viewer, options)
}

export { initCesiumTools, useCesiumTools }
