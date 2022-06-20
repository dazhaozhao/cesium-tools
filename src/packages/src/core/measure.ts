import {
  Cartesian3,
  Entity,
  ScreenSpaceEventType,
  Ray,
  Color,
  HeightReference,
  ScreenSpaceEventHandler,
  CallbackProperty,
} from 'cesium'
import { addHandler } from './handler'
import { addLabel, addLine, addPoint } from './label'
import { formatDistance, getDistance, getSpaceDistance } from './utils'
import { getViewer } from './viewer'

const entityCollection = [] as any as Entity[]
const handlers = [] as any as ScreenSpaceEventHandler[]

/**
 * 距离测量
 * @param callback
 * @returns
 */
function measurePolyLine(callback: (positions: Cartesian3[]) => void) {
  if (!getViewer()) throw new Error('viewer is not defined')
  const positions = [] as Cartesian3[]
  let distance = 0
  let currentLabelEntity = null as any as Entity
  getViewer().canvas.style.cursor = 'crosshair'
  // 注册鼠标左击事件
  const _handler = addHandler((clickEvent) => {
    const cartesian = getViewer().scene.globe.pick(
      getViewer().camera.getPickRay(clickEvent.position) as Ray,
      getViewer().scene
    )
    if (!cartesian) return
    if (positions.length == 0) {
      positions.push(cartesian.clone())
    }
    positions.push(cartesian)
    const _point = addPoint(cartesian)
    entityCollection.push(_point)
    const _distance = getDistance(
      positions.length >= 3 ? positions[positions.length - 3] : positions[0],
      positions[positions.length - 1]
    )
    distance = _distance + distance
    if (_distance > 0 && positions.length >= 2) {
      const entity = addLabel(
        positions[positions.length - 1],
        formatDistance(distance)
      )
      entityCollection.push(entity as Entity)
    }
  }, ScreenSpaceEventType.LEFT_CLICK)
  // 移动
  _handler.setInputAction((moveEvent: ScreenSpaceEventHandler.MotionEvent) => {
    var movePosition = getViewer().scene.globe.pick(
      getViewer().camera.getPickRay(moveEvent.endPosition) as Ray,
      getViewer().scene
    )
    if (!movePosition) return
    if (positions.length >= 2) {
      positions.pop()
      positions.push(movePosition)
      const line = addLine(positions)
      entityCollection.push(line)
      if (currentLabelEntity) {
        getViewer().entities.remove(currentLabelEntity)
        entityCollection.splice(entityCollection.indexOf(currentLabelEntity), 1)
      }
      currentLabelEntity = addLabel(
        movePosition,
        formatDistance(getSpaceDistance(positions))
      )
    }
  }, ScreenSpaceEventType.MOUSE_MOVE)
  // 右键结束
  _handler.setInputAction(
    (clickEvent: ScreenSpaceEventHandler.PositionedEvent) => {
      getViewer().canvas.style.cursor = 'default'
      positions.pop()
      getViewer().entities.remove(currentLabelEntity)
      entityCollection.splice(entityCollection.indexOf(currentLabelEntity), 1)
      _handler.destroy()
      callback && typeof callback === 'function' && callback(positions)
    },
    ScreenSpaceEventType.RIGHT_CLICK
  )
}

export { measurePolyLine }
