import { Viewer } from 'cesium'
import { initToolbar } from './toolbar'
import { ToolsOptions } from './types'
const viewerStore = () => {
  let viewer = null as any as Viewer
  const getViewer = () => viewer
  const setViewer = (v: Viewer, options: ToolsOptions) => {
    if (!viewer) {
      viewer = v
      if (options && options.showToolBar) {
        initToolbar()
      }
    }
  }
  return {
    setViewer,
    getViewer,
  }
}
export const { getViewer, setViewer } = viewerStore()
