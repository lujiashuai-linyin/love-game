<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Wish {
  id: number
  content: string
  date: string
}

const newWish = ref('')
const wishes = ref<Wish[]>([])
const isXiangnangOpen = ref(false)
const isWishFlying = ref(false)
const showHistory = ref(false)

// 添加新愿望
const addWish = () => {
  if (!newWish.value.trim()) return
  
  isWishFlying.value = true
  
  // 延迟保存愿望，等待动画完成
  setTimeout(() => {
    const wish: Wish = {
      id: Date.now(),
      content: newWish.value,
      date: new Date().toLocaleString('zh-CN')
    }
    
    wishes.value.unshift(wish)
    newWish.value = ''
    isWishFlying.value = false
    
    // 保存到本地存储
    localStorage.setItem('wishes', JSON.stringify(wishes.value))
  }, 1000)
}

// 切换历史记录显示
const toggleHistory = () => {
  showHistory.value = !showHistory.value
  isXiangnangOpen.value = showHistory.value
}

// 初始化加载保存的愿望
onMounted(() => {
  const savedWishes = localStorage.getItem('wishes')
  if (savedWishes) {
    wishes.value = JSON.parse(savedWishes)
  }
})
</script>

<template>
  <div class="wish-xiangnan-container">
    <div class="lantern-bg"></div>
    
    <div class="content-wrapper">
      <div class="input-section" :class="{ 'hide': showHistory }">
        <h2>✨ 写下你的心愿 ✨</h2>
        <div class="wish-input">
          <textarea 
            v-model="newWish"
            placeholder="在这里写下你的心愿..."
            :maxlength="100"
          ></textarea>
          <button @click="addWish" :disabled="!newWish.trim() || isWishFlying">
            <span>放入香囊</span>
            <i class="sparkle">✨</i>
          </button>
        </div>
      </div>

      <div class="xiangnan-section">
        <div 
          class="xiangnan" 
          :class="{ 'open': isXiangnangOpen }"
          @click="toggleHistory"
        >
          <div class="xiangnan-top"></div>
          <div class="xiangnan-body">
            <div class="xiangnan-pattern"></div>
          </div>
          <div class="xiangnan-tassel"></div>
        </div>
        
        <div 
          v-if="isWishFlying" 
          class="flying-wish"
        >
          {{ newWish }}
        </div>
      </div>

      <div class="history-section" v-if="showHistory">
        <h3>✨ 历史心愿 ✨</h3>
        <div class="wishes-list">
          <div v-for="wish in wishes" :key="wish.id" class="wish-item">
            <p class="wish-content">{{ wish.content }}</p>
            <span class="wish-date">{{ wish.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wish-xiangnan-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #8B0000 0%, #4A0404 100%);
  position: relative;
  overflow: hidden;
}

.lantern-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #FFD700, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #FFA500, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 50px 160px, #FFD700, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #FFA500, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 130px 80px, #FFD700, rgba(0,0,0,0));
  background-repeat: repeat;
  animation: twinkle 4s infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.5; }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  color: #fff;
}

.input-section {
  background: rgba(139, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  margin-top: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
}

.input-section h2 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 300;
  letter-spacing: 2px;
  color: #FFD700;
}

textarea {
  width: 100%;
  height: 120px;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  background: rgba(139, 0, 0, 0.2);
  color: #fff;
  resize: none;
  margin-bottom: 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: rgba(255, 215, 0, 0.5);
  background: rgba(139, 0, 0, 0.3);
}

textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #CD5C5C, #8B0000);
  border: 1px solid #FFD700;
  border-radius: 25px;
  color: #FFD700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

button span {
  position: relative;
  z-index: 1;
}

button .sparkle {
  position: absolute;
  animation: sparkleMove 2s infinite;
}

@keyframes sparkleMove {
  0% { transform: translate(-50px, 0) rotate(0deg); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(150px, 0) rotate(180deg); opacity: 0; }
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 0, 0, 0.4);
}

.xiangnan {
  width: 100px;
  height: 120px;
  position: relative;
  cursor: pointer;
  margin: 40px 0;
  transition: all 0.5s ease;
}

.xiangnan-top {
  width: 40px;
  height: 20px;
  background: #FFD700;
  margin: 0 auto;
  border-radius: 20px 20px 0 0;
  position: relative;
}

.xiangnan-body {
  width: 80px;
  height: 100px;
  background: linear-gradient(45deg, #CD5C5C, #8B0000);
  margin: 0 auto;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  border: 2px solid #FFD700;
}

.xiangnan-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(45deg, transparent 45%, #FFD700 45%, #FFD700 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, #FFD700 45%, #FFD700 55%, transparent 55%);
  background-size: 10px 10px;
  opacity: 0.3;
}

.xiangnan-tassel {
  width: 4px;
  height: 40px;
  background: #FFD700;
  margin: 0 auto;
  position: relative;
  animation: swingTassel 3s ease-in-out infinite;
}

@keyframes swingTassel {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.xiangnan:hover {
  transform: scale(1.1);
}

.xiangnan.open {
  transform: translateY(-20px);
}

.flying-wish {
  position: absolute;
  padding: 15px;
  background: rgba(255, 215, 0, 0.9);
  border-radius: 10px;
  color: #8B0000;
  max-width: 200px;
  text-align: center;
  animation: flyToXiangnan 1s forwards;
  box-shadow: 0 2px 20px rgba(255, 215, 0, 0.2);
}

@keyframes flyToXiangnan {
  0% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 100px) scale(0.2);
    opacity: 0;
  }
}

.history-section {
  background: rgba(139, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  margin-top: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.history-section h3 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 300;
  letter-spacing: 2px;
  color: #FFD700;
}

.wishes-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.wish-item {
  background: rgba(139, 0, 0, 0.2);
  padding: 20px;
  margin: 10px 0;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
}

.wish-item:hover {
  transform: translateY(-2px);
  background: rgba(139, 0, 0, 0.3);
  border-color: rgba(255, 215, 0, 0.4);
}

.wish-content {
  margin-bottom: 10px;
  line-height: 1.5;
  color: #FFD700;
}

.wish-date {
  font-size: 12px;
  color: rgba(255, 215, 0, 0.6);
}

@media (max-width: 768px) {
  .input-section,
  .history-section {
    width: 95%;
    padding: 20px;
  }
  
  .xiangnan {
    width: 80px;
    height: 100px;
  }
  
  .xiangnan-body {
    width: 60px;
    height: 80px;
  }
  
  .xiangnan-top {
    width: 30px;
    height: 15px;
  }
}
</style> 