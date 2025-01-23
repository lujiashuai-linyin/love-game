<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Card {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

const cards = ref<Card[]>([])
const flippedCards = ref<Card[]>([])
const score = ref(0)
const bestScore = ref(Number(localStorage.getItem('bestScore')) || 0)
const isGameComplete = ref(false)

const emojis = ['❤️', '💕', '💝', '💖', '💗', '💓', '💞', '💘', '💟', '♥️']

// 初始化游戏
const initGame = () => {
  const cardValues = [...emojis, ...emojis]
  cards.value = cardValues
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false
    }))
  flippedCards.value = []
  score.value = 0
  isGameComplete.value = false
}

// 翻转卡片
const flipCard = (card: Card) => {
  if (flippedCards.value.length === 2 || card.isFlipped || card.isMatched) return
  
  card.isFlipped = true
  flippedCards.value.push(card)
  
  if (flippedCards.value.length === 2) {
    score.value++
    checkMatch()
  }
}

// 检查匹配
const checkMatch = () => {
  setTimeout(() => {
    const [card1, card2] = flippedCards.value
    
    if (card1.value === card2.value) {
      card1.isMatched = true
      card2.isMatched = true
      checkGameComplete()
    } else {
      card1.isFlipped = false
      card2.isFlipped = false
    }
    
    flippedCards.value = []
  }, 1000)
}

// 检查游戏是否完成
const checkGameComplete = () => {
  if (cards.value.every(card => card.isMatched)) {
    isGameComplete.value = true
    if (score.value < bestScore.value || bestScore.value === 0) {
      bestScore.value = score.value
      localStorage.setItem('bestScore', score.value.toString())
    }
  }
}

onMounted(() => {
  initGame()
})
</script>

<template>
  <div class="game-container">
    <div class="game-header">
      <h2>💑 心心相印 💑</h2>
      <div class="score-board">
        <p>当前步数: {{ score }}</p>
        <p>最佳步数: {{ bestScore || '暂无' }}</p>
      </div>
    </div>

    <div class="game-board" :class="{ 'game-complete': isGameComplete }">
      <div 
        v-for="card in cards" 
        :key="card.id"
        class="card"
        :class="{ 
          'flipped': card.isFlipped,
          'matched': card.isMatched 
        }"
        @click="flipCard(card)"
      >
        <div class="card-inner">
          <div class="card-front">❓</div>
          <div class="card-back">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <div v-if="isGameComplete" class="game-complete-modal">
      <h3>🎉 恭喜完成! 🎉</h3>
      <p>你用了 {{ score }} 步完成游戏</p>
      <button @click="initGame">再玩一次</button>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.game-header h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.score-board {
  background: rgba(255,255,255,0.2);
  padding: 15px 30px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.game-board {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  max-width: 600px;
  width: 100%;
  padding: 20px;
}

.card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border-radius: 10px;
  background: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card-back {
  transform: rotateY(180deg);
  background: #fff;
}

.card.matched .card-inner {
  animation: matched 0.5s ease-in-out;
}

@keyframes matched {
  0%, 100% { transform: rotateY(180deg) scale(1); }
  50% { transform: rotateY(180deg) scale(1.1); }
}

.game-complete-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: modalShow 0.5s ease-out;
}

@keyframes modalShow {
  from { opacity: 0; transform: translate(-50%, -40%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}

.game-complete-modal button {
  margin-top: 20px;
  padding: 12px 30px;
  background: #ff6b6b;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-complete-modal button:hover {
  background: #ff8e8e;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .game-board {
    grid-template-columns: repeat(4, 1fr);
    padding: 10px;
  }

  .card-front,
  .card-back {
    font-size: 1.5rem;
  }
}
</style> 