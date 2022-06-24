import { ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium'
import { getViewer } from './viewer'

/**
 * 添加事件
 * @param handler
 * @param type
 * @returns
 */
export const addHandler = (
  handler: (
    e:
      | ScreenSpaceEventHandler.PositionedEvent
      | ScreenSpaceEventHandler.MotionEvent
  ) => void,
  type: ScreenSpaceEventType
): ScreenSpaceEventHandler => {
  const _handler = new ScreenSpaceEventHandler(getViewer().scene.canvas)
  _handler.setInputAction(handler, type)
  return _handler
}
