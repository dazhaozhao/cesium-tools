import {
  Cartesian3,
  Entity,
  LabelStyle,
  Color,
  Cartesian2,
  CallbackProperty,
  HeightReference,
  PolygonHierarchy,
  ClassificationType,
} from 'cesium'
import { getViewer } from './viewer'

/**
 * 添加标签
 * @param position
 * @param text
 */
export function addLabel(centerPoint: Cartesian3, text: string) {
  if (!getViewer()) throw new Error('viewer is not defined')
  const entity = getViewer().entities.add(
    new Entity({
      position: centerPoint,
      label: {
        text: text,
        font: '14px sans-serif',
        style: LabelStyle.FILL_AND_OUTLINE, //FILL  FILL_AND_OUTLINE OUTLINE
        fillColor: Color.WHITE,
        showBackground: true, //指定标签后面背景的可见性
        backgroundColor: new Color(0.165, 0.165, 0.165, 0.8), // 背景颜色
        backgroundPadding: new Cartesian2(6, 6), //指定以像素为单位的水平和垂直背景填充padding
        pixelOffset: new Cartesian2(0, -25),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
  )
  return entity
}

/**
 * 添加点
 * @param position
 */
export function addPoint(position: Cartesian3) {
  if (!getViewer()) throw new Error('viewer is not defined')
  const point = getViewer().entities.add(
    new Entity({
      position: position,
      point: {
        color: Color.RED,
        pixelSize: 7,
        heightReference: HeightReference.CLAMP_TO_GROUND,
      },
    })
  )
  return point
}
/**
 * 添加线
 * @param positions
 */
export function addLine(positions: Cartesian3[]) {
  if (!getViewer()) throw new Error('viewer is not defined')
  const dynamicPositions = new CallbackProperty(() => {
    return positions
  }, false)
  const line = getViewer().entities.add(
    new Entity({
      polyline: {
        positions: dynamicPositions,
        width: 2,
        // arcType: ArcType.RHUMB,
        clampToGround: true,
        material: Color.fromCssColorString('rgb(223, 213, 44)'), //获取或设置折线的表面外观
      },
    })
  )
  return line
}

/**
 * 添加面
 * @param positions
 */
export function addPolyGon(positions: Cartesian3[]) {
  const dynamicPositions = new CallbackProperty(() => {
    return new PolygonHierarchy(positions)
  }, false)
  const polygon = getViewer().entities.add(
    new Entity({
      polygon: {
        hierarchy: dynamicPositions,
        material: Color.RED.withAlpha(0.5),
        classificationType: ClassificationType.BOTH, // 贴地表和贴模型,如果设置了，这不能使用挤出高度
      },
    })
  )
  return polygon
}
