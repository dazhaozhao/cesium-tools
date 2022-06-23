import { Viewer } from 'cesium'
import { initToolbar } from './toolbar'
type ToolsOptions = {
  showToolBar?: boolean
}
const viewerStore = () => {
  let viewer = null as any as Viewer
  const getViewer = () => viewer
  const setViewer = (
    v: Viewer,
    options: ToolsOptions = { showToolBar: true }
  ) => {
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
