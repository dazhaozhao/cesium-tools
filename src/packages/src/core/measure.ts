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
const entityCollection = [] as any as Entity[]
const handlers = [] as any as ScreenSpaceEventHandler[]

/**
 * 距离测量
 * @param callback
 * @returns
 */
function measurePolyLine(callback: MeasureCallback) {
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
function measurePolygon(callback: MeasureCallback, isArea = true) {
  const positions = [] as Cartesian3[]
  let clickStatus = false
  let labelEntity = null as any as Entity
  getViewer().canvas.style.cursor = 'crosshair'
  getViewer().scene.globe.depthTestAgainstTerrain = false
  // left click event
  const letClickHandler = addHandler((clickEvent) => {
    clickStatus = true
    clickEvent = clickEvent as ScreenSpaceEventHandler.PositionedEvent
    const cartesian = getViewer().scene.globe.pick(
      getViewer().camera.getPickRay(clickEvent.position) as Ray,
      getViewer().scene
    )
    if (!cartesian) return false
    if (positions.length == 0) {
      positions.push(cartesian.clone()) //鼠标左击 添加第1个点
      addPoint(cartesian)
    } else if (positions.length == 2) {
      if (!cartesian) return false
      positions.pop()
      positions.push(cartesian.clone()) // 鼠标左击 添加第2个点
      addPoint(cartesian)
      addPolyGon(positions)
    } else if (positions.length >= 3) {
      if (!cartesian) return false
      positions.pop()
      positions.push(cartesian.clone()) // 鼠标左击 添加第3个点
      addPoint(cartesian)
    }
  }, ScreenSpaceEventType.LEFT_CLICK)
  // move event
  const moveHandler = addHandler((moveEvent) => {
    moveEvent = moveEvent as ScreenSpaceEventHandler.MotionEvent
    const movePosition = getViewer().scene.globe.pick(
      getViewer().camera.getPickRay(moveEvent.endPosition) as Ray,
      getViewer().scene
    )
    if (!movePosition) return false
    if (positions.length == 1) {
      positions.push(movePosition)
      addLine(positions)
    } else {
      if (clickStatus) {
        positions.push(movePosition)
      } else {
        positions.pop()
        positions.push(movePosition)
      }
    }
    if (positions.length >= 3 && isArea) {
      // 绘制label
      if (labelEntity) {
        getViewer().entities.remove(labelEntity)
        entityCollection.splice(entityCollection.indexOf(labelEntity), 1)
      }
      var text =
        '面积：' +
        area(
          polygon([
            transformCartesianArrayToWGS84Array(positions).map((item) => [
              item.lng,
              item.lat,
            ]),
          ] as Position[][])
        )
      var centerPoint = getCenterOfGravityPoint(positions)
      labelEntity = addLabel(centerPoint, text)
      entityCollection.push(labelEntity)
    }
    clickStatus = false
  }, ScreenSpaceEventType.MOUSE_MOVE)
  // right click event
  const rightClickHandler = addHandler((clickEvent) => {
    clickEvent = clickEvent as ScreenSpaceEventHandler.PositionedEvent
    const clickPosition = getViewer().scene.globe.pick(
      getViewer().camera.getPickRay(clickEvent.position) as Ray,
      getViewer().scene
    )
    if (!clickPosition) return false
    positions.pop()
    positions.push(clickPosition)
    positions.push(positions[0]) // 闭合
    addPoint(clickPosition)
    getViewer().canvas.style.cursor = 'default'
    handlers &&
      handlers.length &&
      handlers.forEach((handler) => handler.destroy?.())
    callback && typeof callback === 'function' && callback(positions)
  }, ScreenSpaceEventType.RIGHT_CLICK)
  handlers.push(letClickHandler, moveHandler, rightClickHandler)
}

export { measurePolyLine, measurePolygon }
