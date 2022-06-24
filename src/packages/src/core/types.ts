import type { Cartesian3 } from 'cesium'
export type ToolsOptions = {
  showToolBar?: boolean
}

export type MeasureCallback = (positions: Cartesian3[]) => void
