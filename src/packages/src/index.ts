import { Viewer } from 'cesium'
import { setViewer } from './core/viewer'
import * as measure from './core/measure'
const useCesiumTools = () => {
  return { ...measure }
}
const initCesiumTools = (viewer: Viewer) => {
  setViewer(viewer)
}

export { initCesiumTools, useCesiumTools }
