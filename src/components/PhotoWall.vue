<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import AOS from 'aos'
import 'aos/dist/aos.css'

interface Photo {
  id: number
  url: string
  title: string
  date: string
  size: 'large' | 'medium' | 'small'
  gridArea: string
}

const photos = ref<Photo[]>([])

// 初始化照片数据
const initializePhotos = () => {
  photos.value = [
    {
      id: 1,
      url: '/src/assets/photos/photo1.jpeg',
      title: '我们的第一张合照',
      date: '2023-03-15',
      size: 'large',
      gridArea: '1 / 1 / 3 / 3'
    },
    {
      id: 2,
      url: '/src/assets/photos/photo2.jpeg',
      title: '非暴力沟通',
      date: '2023-03-13',
      size: 'medium',
      gridArea: '1 / 3 / 2 / 4'
    },
    {
      id: 3,
      url: '/src/assets/photos/photo3.jpeg',
      title: '爱的乐章',
      date: '2023-03-20',
      size: 'medium',
      gridArea: '2 / 3 / 3 / 4'
    },
    {
      id: 4,
      url: '/src/assets/photos/photo4.jpeg',
      title: '温馨时刻',
      date: '2023-04-01',
      size: 'medium',
      gridArea: '3 / 1 / 4 / 2'
    },
    {
      id: 5,
      url: '/src/assets/photos/photo5.jpeg',
      title: '甜蜜瞬间',
      date: '2023-04-15',
      size: 'medium',
      gridArea: '3 / 2 / 4 / 3'
    },
    {
      id: 6,
      url: '/src/assets/photos/photo6.jpeg',
      title: '浪漫约会',
      date: '2023-05-01',
      size: 'medium',
      gridArea: '3 / 3 / 4 / 4'
    },
    {
      id: 7,
      url: '/src/assets/photos/photo7.jpeg',
      title: '甜蜜时光',
      date: '2023-05-15',
      size: 'large',
      gridArea: '1 / 4 / 3 / 6'
    },
    {
      id: 8,
      url: '/src/assets/photos/photo8.jpeg',
      title: '浪漫晚餐',
      date: '2023-05-20',
      size: 'medium',
      gridArea: '1 / 6 / 2 / 7'
    }
  ]
}

// 照片悬停效果
const handlePhotoHover = (photo: Photo, isEnter: boolean) => {
  gsap.to(`#photo-${photo.id}`, {
    scale: isEnter ? 1.05 : 1,
    y: isEnter ? -10 : 0,
    boxShadow: isEnter 
      ? '0 15px 30px rgba(0,0,0,0.2)' 
      : '0 5px 15px rgba(0,0,0,0.1)',
    duration: 0.1, // 将动画时长从0.2秒减少到0.1秒,使动画更快
    ease: 'power2.out'
  })
}

onMounted(() => {
  initializePhotos()
  // 初始化 AOS
  AOS.init({
    duration: 1000, // 动画持续时间
    once: false,    // 动画是否只播放一次
    mirror: true,   // 向回滚动时是否重新播放动画
    easing: 'ease-out-cubic'
  })
})
</script>

<template>
  <div class="photo-wall">
    <div class="photos-container">
      <div class="photos-grid">
        <div 
          v-for="(photo, index) in photos" 
          :key="photo.id"
          :id="`photo-${photo.id}`"
          class="photo-card"
          :class="[photo.size]"
          :style="{ gridArea: photo.gridArea }"
          @mouseenter="() => handlePhotoHover(photo, true)"
          @mouseleave="() => handlePhotoHover(photo, false)"
          :data-aos="index % 2 === 0 ? 'fade-right' : 'fade-left'"
          :data-aos-delay="index * 100"
          :data-aos-anchor-placement="'center-bottom'"
        >
          <div class="photo-inner">
            <img :src="photo.url" :alt="photo.title">
            <div class="photo-info">
              <h3>{{ photo.title }}</h3>
              <p class="date">{{ photo.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-wall {
  width: 100vw;
  height: 100vh;
  background: #f8f1ee;
  position: relative;
  overflow: hidden;
}

.photos-container {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  padding: 40px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  /* 添加滚动边界控制 */
  overscroll-behavior-x: contain;
  /* 添加滚动捕捉 */
  scroll-snap-type: x mandatory;
  /* 添加滚动链接 */
  scroll-snap-stop: always;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(3, minmax(200px, 1fr));
  gap: 30px;
  min-width: max-content;
  height: calc(100vh - 80px);
  /* 确保网格容器右边缘对齐 */
  padding-right: calc(100vw - 40px);
}

.photo-card {
  /* 添加滚动捕捉点 */
  scroll-snap-align: start;
  position: relative;
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  height: 100%;
  /* 添加透视效果 */
  perspective: 1000px;
  transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;
}

.photo-inner {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  height: 100%;
  background: #f5f5f5;
  /* 添加3D效果 */
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.photo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.photo-card:hover img {
  transform: scale(1.05);
}

.photo-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(255,255,255,0.95));
  transform: translateY(100%);
  transition: transform 0.4s ease;
}

.photo-card:hover .photo-info {
  transform: translateY(0);
}

.large {
  grid-area: span 2 / span 2;
}

.medium {
  grid-area: span 1 / span 1;
}

h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.date {
  margin: 6px 0 0;
  font-size: 14px;
  color: #666;
}

/* 拍立得效果 */
.photo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 15px;
  pointer-events: none;
}

.photo-card::after {
  content: '';
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 3px;
  background: rgba(0,0,0,0.05);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .photos-container {
    padding: 20px;
  }
  
  .photos-grid {
    grid-template-columns: repeat(12, 250px);
    grid-template-rows: repeat(2, minmax(150px, 1fr));
    gap: 20px;
    height: calc(100vh - 40px);
  }

  .photo-card {
    padding: 10px;
  }
}
</style>
