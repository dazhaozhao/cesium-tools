import * as Cesium from 'cesium'
import { setViewer } from './core/viewer'
import * as measure from './core/measure'
import './style/index.scss'
const useCesiumTools = () => {
  return { ...measure }
}
const initCesiumTools = (viewer: Cesium.Viewer) => {
  setViewer(viewer)
}

export { initCesiumTools, useCesiumTools }
