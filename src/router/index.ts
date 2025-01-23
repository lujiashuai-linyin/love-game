// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue' // 假设你有一个 Home 组件
import FireworksPage from '../components/FireworksPage.vue' // 假设你有一个 Fireworks 组件
import PhotoWall from '../components/PhotoWall.vue'
import WishBottle from '../components/WishBottle.vue'
import LoveGame from '../components/LoveGame.vue'
const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/fireworks',
    name: 'Fireworks',
    component: FireworksPage
  },
  {
    path: '/photo-wall',
    name: 'PhotoWall',
    component: PhotoWall
  },
  {
    path: '/wish-bottle',
    name: 'WishBottle',
    component: WishBottle
  },
  {
    path: '/love-game',
    name: 'LoveGame',
    component: LoveGame
  }
  // 这里添加其他路由
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
})

export default router