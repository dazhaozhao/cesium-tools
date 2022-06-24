import { destroy, measurePolygon, measurePolyLine } from './measure'
import { getViewer } from './viewer'

const toolItemsConfig = [
  {
    text: '空间测量',
    onClick: () => {
      createMeasureBar()
    },
  },
  {
    text: '空间分析',
  },
  {
    text: '空间标注',
  },
  {
    text: '轨迹漫游',
  },
]
export const initToolbar = () => {
  const toolbarContainer = document.createElement('div')
  const toolbarBtn = document.createElement('div')
  toolbarContainer.className = 'toolbar-container'
  toolbarBtn.innerText = '地图工具'
  toolbarBtn.className = 'toolbar-btn'
  toolbarContainer.appendChild(toolbarBtn)
  const toolItmes = document.createElement('div')
  toolItmes.className = 'toolbar-items'
  toolItemsConfig.forEach((item) =>
    createItems(item, toolItmes, 'toolbar-item')
  )
  toolbarContainer.appendChild(toolItmes)
  getViewer().cesiumWidget.container.appendChild(toolbarContainer)
}
const createItems = (
  item: { text: string; onClick?: () => void },
  parent: HTMLElement,
  className: string
) => {
  const _item = document.createElement('span')
  _item.className = className
  _item.innerText = item.text
  item.onClick && _item.addEventListener('click', item.onClick)
  parent.appendChild(_item)
  return item
}
/**
 * 创建测量工具条
 */
const createMeasureBar = () => {
  const measureConfig = [
    {
      text: '测距',
      onClick: () => {
        measurePolyLine()
      },
    },
    {
      text: '测面',
      onClick: () => {
        measurePolygon()
      },
    },
    {
      text: '测高',
      onClick: () => {},
    },
    {
      text: '清除',
      onClick: () => {
        console.log(1)
        destroy()
      },
    },
    {
      text: 'x',
      onClick: () => {
        const measureBar = document.querySelector('.measure-bar')
        //@ts-ignore
        if (measureBar) measureBar.style.display = 'none'
      },
    },
  ]
  const existMeasureBar = document.querySelector('.measure-bar')

  if (existMeasureBar) {
    // @ts-ignore
    const display = existMeasureBar?.style.display
    // @ts-ignore
    existMeasureBar.style.display = display == 'none' ? 'flex' : 'none'
    return
  }
  const measureBar = document.createElement('div')
  measureBar.className = 'measure-bar'
  measureConfig.forEach((item) => createItems(item, measureBar, 'measure-item'))
  getViewer().cesiumWidget.container.appendChild(measureBar)
}
