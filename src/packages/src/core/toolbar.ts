import { destroy, measurePolygon, measurePolyLine } from './measure'
import { getViewer } from './viewer'

const toolItemsConfig = [
  {
    text: '空间测量',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M18 9v4H6V9H4v6h16V9h-2z" fill="currentColor"></path></svg>`,
    onClick: () => {
      createMeasureBar()
    },
  },
  {
    text: '空间分析',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M9 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2zm6 0h4c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2zm6-13V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2z" fill="currentColor"></path></svg>`,
  },
  {
    text: '空间标注',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84l3.96-5.58a.99.99 0 0 0 0-1.16l-3.96-5.58z" fill="currentColor"></path></svg>`,
  },
  {
    text: '轨迹漫游',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 576 512"><path d="M573.19 402.67l-139.79-320C428.43 71.29 417.6 64 405.68 64h-97.59l2.45 23.16c.5 4.72-3.21 8.84-7.96 8.84h-29.16c-4.75 0-8.46-4.12-7.96-8.84L267.91 64h-97.59c-11.93 0-22.76 7.29-27.73 18.67L2.8 402.67C-6.45 423.86 8.31 448 30.54 448h196.84l10.31-97.68c.86-8.14 7.72-14.32 15.91-14.32h68.8c8.19 0 15.05 6.18 15.91 14.32L348.62 448h196.84c22.23 0 36.99-24.14 27.73-45.33zM260.4 135.16a8 8 0 0 1 7.96-7.16h39.29c4.09 0 7.53 3.09 7.96 7.16l4.6 43.58c.75 7.09-4.81 13.26-11.93 13.26h-40.54c-7.13 0-12.68-6.17-11.93-13.26l4.59-43.58zM315.64 304h-55.29c-9.5 0-16.91-8.23-15.91-17.68l5.07-48c.86-8.14 7.72-14.32 15.91-14.32h45.15c8.19 0 15.05 6.18 15.91 14.32l5.07 48c1 9.45-6.41 17.68-15.91 17.68z" fill="currentColor"></path></svg>`,
  },
]
const createSvgIcon = (icon: string) => {
  const svg = document.createElement('div')
  svg.style.width = '1em'
  svg.style.marginRight = '0.4em'
  svg.innerHTML = icon
  return svg
}
const addTransitionForToolbar = (el: HTMLElement) => {
  el.addEventListener('mouseover', () => {
    const toolItmesContainer = document.querySelector(
      '.toolbar-items-container'
    ) as HTMLElement
    const toolItems = document.querySelector('.toolbar-items') as HTMLElement
    toolItmesContainer.style.height = toolItems.offsetHeight + 'px'
  })
  el.addEventListener('mouseout', () => {
    const toolItmesContainer = document.querySelector(
      '.toolbar-items-container'
    ) as HTMLElement
    toolItmesContainer.style.height = '0px'
  })
}
export const initToolbar = () => {
  const toolbarContainer = document.createElement('div')
  const toolbarBtn = document.createElement('div')
  toolbarContainer.className = 'toolbar-container'
  const icon = createSvgIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M29.415 21.666l-6.335-6.335l6.334-6.334a2 2 0 0 0 .001-2.829l-.001-.002l-3.58-3.58a2 2 0 0 0-2.829-.001l-.001.001L16.67 8.92l-6.335-6.335a2.004 2.004 0 0 0-2.828 0L2.585 7.506a2.001 2.001 0 0 0 0 2.829l6.334 6.334L2 23.59V30h6.41l6.92-6.92l6.335 6.337a2.008 2.008 0 0 0 2.83 0l4.92-4.922a2.001 2.001 0 0 0 0-2.829zm-5.002-17.67l3.59 3.59l-6.333 6.334l-3.59-3.59zM8 28H4v-3.591l6.33-6.329l3.676 3.678zm15.08.004L4 8.92L8.922 4l3.788 3.787l-2.252 2.253l1.415 1.414l2.251-2.252l4.13 4.13L16 15.582l1.416 1.414l2.252-2.252l4.13 4.13l-2.252 2.251l1.414 1.415l2.252-2.251l2.79 2.791z" fill="currentColor"></path></svg>`
  )
  addTransitionForToolbar(toolbarContainer)
  toolbarBtn.appendChild(icon)
  const btnText = document.createElement('div')
  btnText.innerText = '地图工具'
  toolbarBtn.appendChild(btnText)
  toolbarBtn.className = 'toolbar-btn'
  toolbarContainer.appendChild(toolbarBtn)
  const toolItmesContainer = document.createElement('div')
  toolItmesContainer.className = 'toolbar-items-container'
  const toolItmes = document.createElement('div')
  toolItmes.className = 'toolbar-items'
  toolItmesContainer.appendChild(toolItmes)
  toolItemsConfig.forEach((item) =>
    createItems(item, toolItmes, 'toolbar-item')
  )
  toolbarContainer.appendChild(toolItmesContainer)
  getViewer().cesiumWidget.container.appendChild(toolbarContainer)
}
const createItems = (
  item: { text: string; onClick?: () => void; icon?: string },
  parent: HTMLElement,
  className: string
) => {
  const _item = document.createElement('div')
  if (item.icon) {
    const icon = createSvgIcon(item.icon)
    _item.appendChild(icon)
  }
  const text = document.createElement('div')
  text.innerText = item.text
  _item.className = className
  _item.appendChild(text)
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
