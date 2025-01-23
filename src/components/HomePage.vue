<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(true)

// 页面加载动画
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})

// 开始体验按钮
const startExperience = () => {
  // 是的,需要在路由配置文件中添加 /fireworks 路由
  // 建议在 src/router/index.ts 中添加如下配置:
  // {
  //   path: '/fireworks',
  //   name: 'Fireworks',
  //   component: () => import('../components/FireworksPage.vue')
  // }
  router.push('/fireworks')
}

// 添加照片墙跳转方法
const goToPhotoWall = () => {
  router.push('/photo-wall')
}

// 添加新的导航方法
const goToGame = () => {
  router.push('/love-game')
}

const goToWishBottle = () => {
  router.push('/wish-bottle')
}
</script>

<template>
  <div class="home-container">
    <!-- 加载动画 -->
    <div v-if="isLoading" class="loading">
      <div class="loading-heart"></div>
      <p>正在准备你的专属浪漫...</p>
    </div>
    
    <!-- 主页面内容 -->
    <div v-else class="main-content">
      <h1 class="title">爱的献礼</h1>
      <div class="love-counter">
        <p>我们已经相恋</p>
        <div class="time-display">365天 12小时 30分钟</div>
      </div>
      
      <div class="buttons-container">
        <button class="start-btn" @click="startExperience">
          开启浪漫之旅
        </button>
        <button class="photo-btn" @click="goToPhotoWall">
          浏览照片墙
        </button>
        <button class="game-btn" @click="goToGame">
          浪漫小游戏
        </button>
        <button class="wish-btn" @click="goToWishBottle">
          许愿香囊
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100vw;  /* 改用视口宽度单位确保占满整个视口宽度 */
  height: 100vh; /* 同样使用视口高度单位 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  position: fixed; /* 固定定位防止出现滚动条 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止内容溢出 */
}

.loading {
  text-align: center;
}

.loading-heart {
  width: 50px;
  height: 50px;
  background: white;
  position: relative;
  transform: rotate(45deg);
  margin: 20px auto;
  animation: pulse 1.5s infinite;
}

.loading-heart:before,
.loading-heart:after {
  content: "";
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  position: absolute;
}

.loading-heart:before {
  left: -25px;
}

.loading-heart:after {
  top: -25px;
}

@keyframes pulse {
  0% { transform: rotate(45deg) scale(1); }
  50% { transform: rotate(45deg) scale(1.2); }
  100% { transform: rotate(45deg) scale(1); }
}

.main-content {
  text-align: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.love-counter {
  margin: 2rem 0;
}

.time-display {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
}

.buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 2rem;
}

.start-btn,
.photo-btn,
.game-btn,
.wish-btn {
  padding: 15px 40px;
  font-size: 1.2rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn {
  background: white;
  color: #ff6b6b;
}

.photo-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.game-btn {
  background: rgba(255, 107, 107, 0.2);
  color: white;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 107, 107, 0.5);
}

.wish-btn {
  background: rgba(255, 215, 0, 0.2);
  color: white;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 215, 0, 0.5);
}

.start-btn:hover,
.photo-btn:hover,
.game-btn:hover,
.wish-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.photo-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.game-btn:hover {
  background: rgba(255, 107, 107, 0.3);
}

.wish-btn:hover {
  background: rgba(255, 215, 0, 0.3);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .buttons-container {
    flex-direction: column;
    gap: 15px;
    padding: 0 20px;
  }

  .start-btn,
  .photo-btn,
  .game-btn,
  .wish-btn {
    width: 100%;
    padding: 12px 30px;
    font-size: 1rem;
  }
}
</style>
