import {
  Cartesian3,
  Entity,
  ScreenSpaceEventType,
  Ray,
  ScreenSpaceEventHandler,
} from 'cesium'
import { addHandler } from './handler'
import { addLabel, addLine, addPoint, addPolyGon } from './label'
import { MeasureCallback } from './types'
import {
  formatDistance,
  getCenterOfGravityPoint,
  getDistance,
  getSpaceDistance,
  transformCartesianArrayToWGS84Array,
} from './utils'
import { getViewer } from './viewer'
import area from '@turf/area'
import { polygon, Position } from '@turf/helpers'

export let entityCollection = [] as any as Entity[]
const destroy = () => {
  entityCollection.length &&
    entityCollection.forEach((entity) => getViewer().entities.remove(entity))
  entityCollection = []
}
/**
 * 距离测量
 * @param callback
 * @returns
 */
function measurePolyLine(callback?: MeasureCallback) {
  getViewer().scene.globe.depthTestAgainstTerrain = true
  if (!getViewer()) throw new Error('viewer is not defined')
  const positions = [] as Cartesian3[]
  let distance = 0
  let currentLabelEntity = null as any as Entity
  getViewer().canvas.style.cursor = 'crosshair'
  // 注册鼠标左击事件
  const _handler = addHandler((clickEvent) => {
    clickEvent = clickEvent as ScreenSpaceEventHandler.PositionedEvent
    const cartesian = getViewer().scene.globe.pick(
      getViewer().camera.getPickRay(clickEvent.position) as Ray,
      getViewer().scene
    )
    if (!cartesian) return
    if (positions.length == 0) {
      positions.push(cartesian.clone())
    }
    positions.push(cartesian)
    addPoint(cartesian)
    const _distance = getDistance(
      positions.length >= 3 ? positions[positions.length - 3] : positions[0],
      positions[positions.length - 1]
    )
    distance = _distance + distance
    if (_distance > 0 && positions.length >= 2) {
      addLabel(positions[positions.length - 1], formatDistance(distance))
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
      addLine(positions)
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
      getViewer().scene.globe.depthTestAgainstTerrain = false
      callback && typeof callback === 'function' && callback(positions)
    },
    ScreenSpaceEventType.RIGHT_CLICK
  )
}

/**
 * 面积测量或地形挖掘
 * @param callback
 * @param isArea
 */
function measurePolygon(callback?: MeasureCallback, isArea = true) {
  const positions = [] as Cartesian3[]
  let labelEntity = null as any as Entity
  getViewer().canvas.style.cursor = 'crosshair'
  getViewer().scene.globe.depthTestAgainstTerrain = false
  // left click event
  const _handler = addHandler((clickEvent) => {
    clickEvent = clickEvent as ScreenSpaceEventHandler.PositionedEvent
    const cartesian = getViewer().scene.globe.pick(
      getViewer().camera.getPickRay(clickEvent.position) as Ray,
      getViewer().scene
    )
    if (!cartesian) return false
    if (positions.length == 0) {
      positions.push(cartesian.clone())
      addPoint(cartesian)
    }
    if (positions.length >= 2) {
      positions.push(cartesian)
      addPoint(cartesian)
      addLine(positions)
      addPolyGon(positions)
    }
  }, ScreenSpaceEventType.LEFT_CLICK)
  // move event
  _handler.setInputAction((moveEvent: ScreenSpaceEventHandler.MotionEvent) => {
    const movePosition = getViewer().scene.globe.pick(
      getViewer().camera.getPickRay(moveEvent.endPosition) as Ray,
      getViewer().scene
    )
    if (!movePosition || !positions.length) return
    if (positions.length == 1) {
      positions.push(movePosition)
      addLine(positions)
    } else if (positions.length == 2) {
      positions.pop()
      positions.push(movePosition)
    }
    if (positions.length >= 3 && isArea) {
      if (positions.length >= 4) positions.pop()
      positions.pop()
      positions.push(movePosition)
      positions.push(positions[0])
      // 绘制label
      if (labelEntity) {
        getViewer().entities.remove(labelEntity)
        entityCollection.splice(entityCollection.indexOf(labelEntity), 1)
      }
      const _area = area(
        polygon([
          transformCartesianArrayToWGS84Array(positions).map((item) => [
            item.lng,
            item.lat,
          ]),
        ] as Position[][])
      )
      const text =
        '面积：' +
        (_area < 1000000
          ? Math.abs(_area).toFixed(4) + ' 平方米'
          : Math.abs(Number(_area / 1000000.0)).toFixed(4) + ' 平方公里')

      const centerPoint = getCenterOfGravityPoint(positions)
      labelEntity = addLabel(centerPoint, text)
    }
  }, ScreenSpaceEventType.MOUSE_MOVE)
  // right click event
  _handler.setInputAction(
    (clickEvent: ScreenSpaceEventHandler.PositionedEvent) => {
      const clickPosition = getViewer().scene.globe.pick(
        getViewer().camera.getPickRay(clickEvent.position) as Ray,
        getViewer().scene
      )
      if (!clickPosition || positions.length <= 3) return false
      addPoint(clickPosition)
      getViewer().canvas.style.cursor = 'default'
      callback && typeof callback === 'function' && callback(positions)
      _handler.destroy()
    },
    ScreenSpaceEventType.RIGHT_CLICK
  )
}

export { measurePolyLine, measurePolygon, destroy }
