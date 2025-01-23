<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

interface Firework {
  position: THREE.Vector3
  velocity: THREE.Vector3
  particles: THREE.Points
  life: number
  exploded: boolean
  color: THREE.Color
}

const containerRef = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let fireworks: Firework[] = []

// 初始化场景
const initScene = () => {
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 1, 2000) // 增加雾效果范围
  
  camera = new THREE.PerspectiveCamera(
    45, // 降低视角范围使画面看起来更远
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  )
  // 调整相机位置，拉远观察距离
  camera.position.set(0, 100, 600)
  camera.lookAt(0, 100, 0) // 将视角中心点抬高

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000)
  containerRef.value?.appendChild(renderer.domElement)
}

// 创建烟花
const createFirework = (x: number, y: number, z: number) => {
  const particleCount = 1000
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  // 定义多种颜色配置
  const colorConfigs = [
    { hue: 0.99, saturation: 1, lightness: 0.7 },    // 红色
    { hue: 0.83, saturation: 1, lightness: 0.7 },    // 粉色
    { hue: 0.65, saturation: 1, lightness: 0.7 },    // 蓝色
    { hue: 0.75, saturation: 1, lightness: 0.7 },    // 紫色
    { hue: 0.55, saturation: 1, lightness: 0.7 },    // 青色
    { hue: 0.15, saturation: 1, lightness: 0.7 },    // 金色
  ]
  
  // 随机选择主色调
  const mainColorConfig = colorConfigs[Math.floor(Math.random() * colorConfigs.length)]
  const secondaryColorConfig = colorConfigs[Math.floor(Math.random() * colorConfigs.length)]
  
  // 创建颜色对象
  const mainColor = new THREE.Color()
  const secondaryColor = new THREE.Color()
  mainColor.setHSL(mainColorConfig.hue, mainColorConfig.saturation, mainColorConfig.lightness)
  secondaryColor.setHSL(secondaryColorConfig.hue, secondaryColorConfig.saturation, secondaryColorConfig.lightness)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    // 随机分配颜色
    let particleColor: THREE.Color
    const colorRand = Math.random()
    
    if (colorRand < 0.6) {
      // 60% 概率使用主色调
      particleColor = mainColor
    } else if (colorRand < 0.9) {
      // 30% 概率使用次色调
      particleColor = secondaryColor
    } else {
      // 10% 概率使用随机色调
      const randomColor = new THREE.Color()
      const randomHue = Math.random()
      randomColor.setHSL(randomHue, 1, 0.5)
      particleColor = randomColor
    }

    colors[i * 3] = particleColor.r
    colors[i * 3 + 1] = particleColor.g
    colors[i * 3 + 2] = particleColor.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false, // 优化透明度渲染
  })

  const points = new THREE.Points(geometry, material)

  const firework = {
    position: new THREE.Vector3(x, y, z),
    velocity: new THREE.Vector3(
      0, 
      4 + Math.random() * 3,
      0
    ),
    particles: points,
    life: 150,
    exploded: false,
    color: mainColor // 存储主色调
  }

  fireworks.push(firework)
  scene.add(points)
}

// 烟花爆炸
const explodeFirework = (firework: Firework) => {
  firework.exploded = true
  const positions = firework.particles.geometry.attributes.position.array as Float32Array
  const velocities: THREE.Vector3[] = []
  
  // 为每个粒子创建初始速度，根据颜色调整速度
  for (let i = 0; i < positions.length; i += 3) {
    const phi = Math.acos(-1 + (2 * Math.random()))
    const theta = Math.random() * Math.PI * 2
    
    // 根据粒子颜色调整速度
    const colors = firework.particles.geometry.attributes.color.array
    const brightness = (colors[i] + colors[i + 1] + colors[i + 2]) / 3
    const speed = 2 + Math.random() * 2 + brightness * 0.5 // 亮色粒子速度略快
    
    velocities.push(new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta) * speed,
      Math.sin(phi) * Math.sin(theta) * speed,
      Math.cos(phi) * speed
    ))
  }

  firework.velocities = velocities
}

// 更新烟花
const updateFireworks = () => {
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const firework = fireworks[i]
    
    if (!firework.exploded) {
      // 上升阶段
      firework.position.add(firework.velocity)
      firework.velocity.y -= 0.1 // 减小重力效果
      
      const positions = firework.particles.geometry.attributes.position.array as Float32Array
      for (let j = 0; j < positions.length; j += 3) {
        positions[j] = firework.position.x
        positions[j + 1] = firework.position.y
        positions[j + 2] = firework.position.z
      }
      firework.particles.geometry.attributes.position.needsUpdate = true

      if (firework.velocity.y < 0) {
        explodeFirework(firework)
      }
    } else {
      // 爆炸后的粒子运动
      const positions = firework.particles.geometry.attributes.position.array as Float32Array
      
      for (let j = 0; j < positions.length; j += 3) {
        const velocity = firework.velocities[j / 3]
        positions[j] += velocity.x
        positions[j + 1] += velocity.y
        positions[j + 2] += velocity.z
        
        // 添加重力效果
        velocity.y -= 0.03
      }
      
      firework.particles.geometry.attributes.position.needsUpdate = true
      
      // 逐渐降低不透明度
      firework.life--
      firework.particles.material.opacity = firework.life / 150
      
      if (firework.life <= 0) {
        scene.remove(firework.particles)
        fireworks.splice(i, 1)
      }
    }
  }
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)
  
  // 大幅降低自动发射频率
  if (Math.random() < 0.01) { // 从0.03改为0.01
    const x = (Math.random() - 0.5) * 300 // 扩大水平发射范围
    const y = 0 // 从地平线发射
    const z = (Math.random() - 0.5) * 200 // 扩大深度范围
    createFirework(x, y, z)
  }

  updateFireworks()
  renderer.render(scene, camera)
}

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  const x = (event.clientX / window.innerWidth) * 400 - 200 // 扩大点击范围
  const y = 0
  const z = (Math.random() - 0.5) * 200
  createFirework(x, y, z)
}

// 处理窗口大小变化
const handleResize = () => {
  if (!containerRef.value) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  initScene()
  animate()
  
  window.addEventListener('resize', handleResize)
  window.addEventListener('click', handleClick)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('click', handleClick)
  renderer.dispose()
})
</script>

<template>
  <div ref="containerRef" class="fireworks-container">
    <div class="hint-text">点击屏幕放烟花</div>
  </div>
</template>

<style scoped>
.fireworks-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  overflow: hidden;
}

.hint-text {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1.2rem;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  opacity: 0.7;
}
</style> 