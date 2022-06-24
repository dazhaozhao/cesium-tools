import { Cartesian3, Cartographic, Ellipsoid, Math as CesiumMath } from 'cesium'

/**
 * 计算两点距离
 * @param firstPoint
 * @param secondPoint
 */
export function getDistance(firstPoint: Cartesian3, secondPoint: Cartesian3) {
  const length: string | number = Cartesian3.distance(firstPoint, secondPoint)
  return length
}

function getFlatternDistance(
  p1: { lon: number; lat: number },
  p2: { lon: number; lat: number }
) {
  if (p1.lat === p2.lat && p1.lon === p2.lon) {
    return 0
  }
  var EARTH_RADIUS = 6378137.0
  var PI = Math.PI
  var lat1 = p1.lat
  var lon1 = p1.lon
  var lat2 = p2.lat
  var lon2 = p2.lon

  function getRad(d: number) {
    return (d * PI) / 180.0
  }
  var f = getRad((lat1 + lat2) / 2)
  var g = getRad((lat1 - lat2) / 2)
  var l = getRad((lon1 - lon2) / 2)

  var sg = Math.sin(g)
  var sl = Math.sin(l)
  var sf = Math.sin(f)

  var s, c, w, r, d, h1, h2
  var a = EARTH_RADIUS
  var fl = 1 / 298.257

  sg = sg * sg
  sl = sl * sl
  sf = sf * sf

  s = sg * (1 - sl) + (1 - sf) * sl
  c = (1 - sg) * (1 - sl) + sf * sl

  w = Math.atan(Math.sqrt(s / c))
  r = Math.sqrt(s * c) / w
  d = 2 * w * a
  h1 = (3 * r - 1) / 2 / c
  h2 = (3 * r + 1) / 2 / s
  var distance = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
  return distance
}

/**
 * 空间距离
 * @param positions
 * @returns
 */
export function getSpaceDistance(positions: Cartesian3[]) {
  let distance = 0
  for (let i = 0; i < positions.length - 1; i++) {
    let point1cartographic = Cartographic.fromCartesian(positions[i])
    let point2cartographic = Cartographic.fromCartesian(positions[i + 1])
    let p1 = {
      lon: CesiumMath.toDegrees(point1cartographic.longitude),
      lat: CesiumMath.toDegrees(point1cartographic.latitude),
    }
    let p2 = {
      lon: CesiumMath.toDegrees(point2cartographic.longitude),
      lat: CesiumMath.toDegrees(point2cartographic.latitude),
    }
    distance += getFlatternDistance(p1, p2)
  }
  return distance
}
/**
 * 格式化距离
 * @param distance
 * @returns
 */
export function formatDistance(distance: number) {
  return distance > 1000
    ? (distance / 1000).toFixed(2) + ' 公里'
    : distance.toFixed(2) + ' 米'
}
/**
 * 计算多边形的中心
 * @param mPoints
 * @returns {*[]}
 */
export function getCenterOfGravityPoint(mPoints: Cartesian3[]) {
  let centerPoint = mPoints[0]
  for (let i = 1; i < mPoints.length; i++) {
    centerPoint = Cartesian3.midpoint(centerPoint, mPoints[i], new Cartesian3())
  }
  return centerPoint
}

//坐标转换 笛卡尔转84
export const transformCartesianToWGS84 = (cartesian: Cartesian3) => {
  const ellipsoid = Ellipsoid.WGS84
  const cartographic = ellipsoid.cartesianToCartographic(cartesian)
  return {
    lng: CesiumMath.toDegrees(cartographic.longitude),
    lat: CesiumMath.toDegrees(cartographic.latitude),
    alt: cartographic.height,
  }
}
//坐标数组转换 笛卡尔转84
export const transformWGS84ArrayToCartesianArray = (
  WSG84Arr: { lon: number; lng?: number; lat: number; alt: number }[],
  alt: number
) => {
  return WSG84Arr
    ? WSG84Arr.map((item) => transformWGS84ToCartesian(item, alt))
    : []
}
//坐标转换 84转笛卡尔
export const transformWGS84ToCartesian = (
  position: { lon: number; lng?: number; lat: number; alt: number },
  alt: number
) => {
  return position
    ? Cartesian3.fromDegrees(
        position.lng || position.lon,
        position.lat,
        (position.alt = alt || position.alt),
        Ellipsoid.WGS84
      )
    : Cartesian3.ZERO
}
//坐标数组转换 84转笛卡尔
export const transformCartesianArrayToWGS84Array = (
  cartesianArr: Cartesian3[]
) => {
  return cartesianArr
    ? cartesianArr.map((item) => transformCartesianToWGS84(item))
    : []
}
