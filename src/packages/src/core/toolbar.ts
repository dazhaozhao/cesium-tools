import { getViewer } from './viewer'

export const initToolbar = () => {
  const toolbarContainer = document.createElement('div')
  const toolbarBtn = document.createElement('div')
  toolbarContainer.className = 'toolbar-container'
  toolbarBtn.innerText = '地图工具'
  toolbarBtn.className = 'toolbar-btn'
  toolbarContainer.appendChild(toolbarBtn)
  const toolItmes = document.createElement('div')
  toolItmes.className = 'toolbar-items'
  const spaceMeasure = createToolItems()
  spaceMeasure.innerText = '空间测量'
  toolItmes.appendChild(spaceMeasure)
  const spacAanalysis = createToolItems()
  spacAanalysis.innerText = '空间分析'
  toolItmes.appendChild(spacAanalysis)
  const spaceLabel = createToolItems()
  spaceLabel.innerText = '空间标注'
  toolItmes.appendChild(spaceLabel)
  toolbarContainer.appendChild(toolItmes)
  getViewer().cesiumWidget.container.appendChild(toolbarContainer)
}
const createToolItems = () => {
  const item = document.createElement('span')
  item.className = 'toolbar-item'
  return item
}
