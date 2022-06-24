<script setup lang="ts">
import { Cartesian3, Viewer } from 'cesium'
import * as Cesium from 'cesium'
import { markRaw, onMounted, ref, unref } from 'vue'
import { initCesiumTools, useCesiumTools } from './packages/src/index'
onMounted(() => {
  const viewer = new Viewer('cesium-container', {
    geocoder: false,
    selectionIndicator: false,
    animation: false,
    baseLayerPicker: true,
    vrButton: false,
    infoBox: false,
    timeline: false,
  })
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(103, 30, 200),
  })
  initCesiumTools(viewer, { showToolBar: true })
})
const { measurePolyLine, measurePolygon } = useCesiumTools()
const drawLine = () => {
  console.log(1)
  measurePolyLine((positions) => {
    console.log(positions)
  })
}
const drawPolygon = () => {
  console.log(1)
  measurePolygon((positions) => {
    console.log(positions)
  })
}
</script>

<template>
  <div style="height: 100vh; margin: 0; padding: 0">
    <div id="cesium-container" style="height: 100vh"></div>
  </div>
</template>

<style>
#app,
body {
  display: block;
  margin: 0px;
}
.cesium-tool-container {
  position: absolute;
  outline: none;
  border: none;
  z-index: 99;
  width: 100px;
  top: 10px;
  left: 10px;
  border-radius: 4px;
  background: #2c3e50;
  color: aliceblue;
  padding: 4px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
</style>
