<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import type { TileValue } from '@/types'

import BaseButton from './ui/BaseButton.vue'
import SettingsScreen from './SettingsScreen.vue'
import WinPopup from './WinPopup.vue'

const store = useGameStore()
const { t, boardSize } = storeToRefs(store)
const { saveGameResult, loadHistory, formatTime } = store

const currentScreen = ref<'game' | 'settings'>('game')
const showWinPopup = ref(false)

const tiles = ref<TileValue[]>([])
const isWon = ref(false)
const isStarted = ref(false)
const movesCount = ref(0)
const timeElapsed = ref(0)

const initialBoardState = ref<TileValue[]>([])
let timerInterval: ReturnType<typeof setTimeout> | null = null

function startTimer() {
  if (timerInterval) return
  timerInterval = window.setInterval(() => {
    timeElapsed.value++
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function shuffleBoard() {
  isWon.value = false
  isStarted.value = false
  showWinPopup.value = false
  movesCount.value = 0
  timeElapsed.value = 0
  stopTimer()

  const size = Number(boardSize.value)
  const totalCells = size * size

  const board: TileValue[] = [...Array(totalCells - 1).keys()].map((i) => i + 1)
  board.push(null)
  let emptyIndex = totalCells - 1

  const shuffleSteps = size * size * 15

  for (let i = 0; i < shuffleSteps; i++) {
    const validMoves: number[] = []
    const row = Math.floor(emptyIndex / size)
    const col = emptyIndex % size
    if (row > 0) {
      validMoves.push(emptyIndex - size)
    }

    if (row < size - 1) {
      validMoves.push(emptyIndex + size)
    }

    if (col > 0) {
      validMoves.push(emptyIndex - 1)
    }

    if (col < size - 1) {
      validMoves.push(emptyIndex + 1)
    }

    const randomMoveIndex = validMoves[Math.floor(Math.random() * validMoves.length)]
    if (typeof randomMoveIndex === 'number') {
      const nextTile = board[randomMoveIndex]
      if (nextTile !== undefined) {
        board[emptyIndex] = nextTile
        board[randomMoveIndex] = null
        emptyIndex = randomMoveIndex
      }
    }
  }

  tiles.value = board
  initialBoardState.value = [...board]
}

function startGame() {
  if (isWon.value || isStarted.value) {
    return
  }

  isStarted.value = true
  startTimer()
}

function handleReplayGame(specificBoard: TileValue[]) {
  const targetSize = Math.sqrt(specificBoard.length)

  store.changeBoardSize(targetSize)

  tiles.value = [...specificBoard]
  initialBoardState.value = [...specificBoard]
  isWon.value = false
  isStarted.value = true
  showWinPopup.value = false
  movesCount.value = 0
  timeElapsed.value = 0
  currentScreen.value = 'game'
  stopTimer()
  startTimer()
}

function moveTile(index: number) {
  if (isWon.value || !isStarted.value) {
    return
  }

  const size = Number(boardSize.value)
  const emptyIndex = tiles.value.indexOf(null)
  const tileRow = Math.floor(index / size)
  const tileCol = index % size
  const emptyRow = Math.floor(emptyIndex / size)
  const emptyCol = emptyIndex % size

  if (Math.abs(tileRow - emptyRow) + Math.abs(tileCol - emptyCol) === 1) {
    const targetTile = tiles.value[index]
    if (targetTile !== undefined) {
      tiles.value[emptyIndex] = targetTile
      tiles.value[index] = null
      movesCount.value++
      checkWin()
    }
  }
}

function checkWin() {
  const size = Number(boardSize.value)
  const totalCells = size * size

  for (let i = 0; i < totalCells - 1; i++) {
    if (tiles.value[i] !== i + 1) {
      isWon.value = false
      return
    }
  }

  if (tiles.value[totalCells - 1] === null) {
    isWon.value = true
    isStarted.value = false
    stopTimer()
    showWinPopup.value = true
  }
}

function handleSaveRecord(typedName: string) {
  saveGameResult(typedName, initialBoardState.value, movesCount.value, timeElapsed.value)
  showWinPopup.value = false
}

watch(
  currentScreen,
  (newScreen) => {
    if (newScreen === 'game') {
      const size = Number(boardSize.value)
      const expectedTotalCells = size * size

      if (tiles.value.length !== expectedTotalCells) {
        shuffleBoard()
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadHistory()
  shuffleBoard()
})

onUnmounted(() => stopTimer())
</script>

<template>
  <div class="game-container">
    <div v-if="currentScreen === 'game'" class="screen">
      <div class="header">
        <h1 class="title">{{ t?.title }}</h1>

        <button class="icon-btn" @click="currentScreen = 'settings'">⚙️</button>
      </div>

      <div class="stats-container">
        <div class="stat-item">
          {{ t?.moves }}: <strong>{{ movesCount }}</strong>
        </div>
        <div class="stat-item">
          {{ t?.time }}: <strong>{{ formatTime(timeElapsed) }}</strong>
        </div>
      </div>

      <div
        class="board"
        :class="{ 'not-started': !isStarted }"
        :style="{ gridTemplateColumns: `repeat(${store.boardSize}, 1fr)` }"
      >
        <TransitionGroup name="tile-grid">
          <div
            v-for="(tile, index) in tiles"
            :key="tile ?? 'empty'"
            :class="['tile', { empty: tile === null }]"
            :style="{ fontSize: boardSize > 4 ? '18px' : '24px' }"
            @click="moveTile(index)"
          >
            <span v-if="tile !== null" class="tile-inner">
              {{ tile }}
            </span>
          </div>
        </TransitionGroup>
      </div>

      <div class="controls-box">
        <BaseButton v-if="!isStarted && !isWon" variant="success" @click="startGame">
          {{ t?.start }}
        </BaseButton>

        <BaseButton variant="primary" @click="shuffleBoard">
          {{ t?.shuffle }}
        </BaseButton>
      </div>
    </div>

    <SettingsScreen v-else @back="currentScreen = 'game'" @replay="handleReplayGame" />

    <WinPopup
      :show="showWinPopup"
      :moves="movesCount"
      :time="timeElapsed"
      @close="showWinPopup = false"
      @save="handleSaveRecord"
    />
  </div>
</template>

<style scoped lang="scss">
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--bg-main);
}

.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.title {
  color: var(--color-text-dark);
  margin: 0;
  font-size: 26px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 15px;
  font-size: 18px;
  strong {
    color: var(--btn-primary);
  }
}

.board {
  display: grid;
  gap: 10px;
  width: 100%;
  aspect-ratio: 1;
  background-color: var(--board-bg);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 8px 16px var(--shadow-board);
  box-sizing: border-box;
  transition: opacity 0.3s ease;
  &.not-started {
    opacity: 0.6;
  }
}

.tile {
  background-color: var(--tile-bg);
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8%;
  box-sizing: border-box;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.1s,
    box-shadow 0.1s;

  &:active:not(.empty) {
    transform: scale(0.96);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.empty {
    background-color: transparent;
    cursor: default;
    box-shadow: none;
    padding: 0;
  }
}

.tile-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  color: var(--tile-text);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.05) 100%);
  box-shadow:
    inset 2px 2px 5px rgba(0, 0, 0, 0.25),
    inset -2px -2px 5px rgba(255, 255, 255, 0.2);
}

.controls-box {
  position: relative;
  display: flex;
  gap: 15px;
  width: 100%;
  margin-top: 20px;
  justify-content: center;
  align-items: center;

  button {
    min-width: 150px;
    max-width: 45%;
    width: fit-content;
  }
}
</style>

<style>
.tile-grid-move {
  transition: transform 0.22s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
