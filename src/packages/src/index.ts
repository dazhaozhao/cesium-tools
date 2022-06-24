import * as Cesium from 'cesium'
import { setViewer } from './core/viewer'
import * as measure from './core/measure'
import './style/index.scss'
import { ToolsOptions } from './core/types'

const useCesiumTools = () => {
  return { ...measure }
}
const initCesiumTools = (
  viewer: Cesium.Viewer,
  options: ToolsOptions = { showToolBar: true }
) => {
  setViewer(viewer, options)
}

export { initCesiumTools, useCesiumTools }
