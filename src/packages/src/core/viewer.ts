import { Viewer } from 'cesium'

const viewerStore = () => {
  let viewer = null as any as Viewer
  const getViewer = () => viewer
  const setViewer = (v: Viewer) => {
    console.log(v)
    if (!viewer) {
      viewer = v
    }
  }
  return {
    setViewer,
    getViewer,
  }
}
export const { getViewer, setViewer } = viewerStore()
