<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import type { TileValue } from '@/types'
import BaseButton from './ui/BaseButton.vue'
import BaseInput from './ui/BaseInput.vue'

const emits = defineEmits<{
  (e: 'back'): void
  (e: 'replay', board: TileValue[]): void
}>()

const appVersion = '0.0.6'

const sizes: number[] = [3, 4, 5, 6]

const store = useGameStore()
const { t, boardSize, defaultPlayerName, currentLang, availableLanguages, gameHistory } =
  storeToRefs(store)
const { changeDefaultName, changeLang, changeBoardSize, formatTime } = store
</script>

<template>
  <div class="screen">
    <div class="header">
      <h1 class="title">{{ t?.settings }}</h1>

      <BaseButton variant="secondary" @click="emits('back')">
        {{ t?.back }}
      </BaseButton>
    </div>

    <div class="settings-box">
      <BaseInput
        :modelValue="defaultPlayerName"
        @update:modelValue="changeDefaultName"
        :label="t?.playerName"
      />

      <div class="setting-item">
        <label class="section-label">{{ t?.gridSize }}:</label>

        <div class="grid-switcher">
          <button
            v-for="size in sizes"
            :key="size"
            :class="{ active: boardSize === size }"
            @click.stop.prevent="() => changeBoardSize(size)"
          >
            {{ size }}x{{ size }}
          </button>
        </div>
      </div>

      <div class="setting-item">
        <label class="section-label"> {{ t?.language }}: </label>

        <div class="select-wrapper">
          <select
            :value="currentLang"
            class="lang-select"
            @change="(e) => changeLang((e.target as HTMLSelectElement).value)"
          >
            <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
              {{ lang.label }}
            </option>
          </select>
          <span class="select-arrow">▼</span>
        </div>
      </div>
    </div>

    <h2 class="subtitle">{{ t?.history }}</h2>

    <div class="history-container">
      <div v-if="gameHistory.length === 0" class="no-history">
        {{ t?.noHistory }}
      </div>

      <template v-else>
        <div v-for="record in gameHistory" :key="record.id" class="history-item">
          <div
            class="mini-board"
            :style="{
              gridTemplateColumns: `repeat(${Math.sqrt(record.initialBoard.length)}, 1fr)`,
            }"
          >
            <div
              v-for="(subTile, subIdx) in record.initialBoard"
              :key="subIdx"
              class="mini-tile"
              :class="{ 'mini-empty': subTile === null }"
            >
              {{ subTile }}
            </div>
          </div>

          <div class="history-info">
            <span class="history-user">👤 {{ record.playerName }}</span>

            <span class="history-meta">
              📅 {{ record.date }} | 🏁 {{ record.moves }} | ⏱️ {{ formatTime(record.time) }}
            </span>
          </div>

          <button class="retry-btn" @click="emits('replay', record.initialBoard)">
            {{ t?.retry }}
          </button>
        </div>
      </template>
    </div>

    <div class="app-version">v {{ appVersion }}</div>
  </div>
</template>

<style scoped lang="scss">
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

.subtitle {
  color: var(--color-text-dark);
  margin: 20px 0 10px 0;
  align-self: flex-start;
  font-size: 20px;
}

.settings-box {
  width: 100%;
  background: var(--bg-surface);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-main);
  box-sizing: border-box;
}

.setting-item {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.section-label {
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--color-text-muted);
  font-size: 15px;
  display: block;
}

.grid-switcher {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;

  button {
    flex: 1;
    min-width: 65px;
    height: 46px;
    padding: 0 5px;
    border: 2px solid var(--border-color);
    background: var(--bg-main);
    color: var(--color-text-dark);
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 15px;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &.active {
      background-color: var(--btn-primary);
      color: white;
      border-color: var(--btn-primary);
      box-shadow: 0 3px 8px rgba(52, 152, 219, 0.3);
    }
  }
}

.history-container {
  width: 100%;
  max-height: 280px;
  overflow-y: auto;
  background: var(--bg-surface);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px var(--shadow-main);
  box-sizing: border-box;
}

.no-history {
  color: var(--color-text-muted);
  text-align: center;
  padding: 20px;
}

.history-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  &:last-child {
    border-bottom: none;
  }
}

.mini-board {
  display: grid;
  gap: 1px;
  width: 50px;
  height: 50px;
  background-color: var(--board-bg);
  padding: 2px;
  border-radius: 4px;
  flex-shrink: 0;
}

.mini-tile {
  background-color: var(--tile-bg);
  color: var(--tile-text);
  font-size: 6px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
  aspect-ratio: 1;
  &.mini-empty {
    background-color: transparent;
  }
}

.history-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.history-user {
  font-weight: bold;
  color: var(--color-text-dark);
  font-size: 14px;
}

.history-meta {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 3px;
  line-height: 1.4;
}

.retry-btn {
  background-color: var(--btn-warning);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.lang-select {
  width: 100%;
  height: 46px;
  padding: 0 15px;
  font-size: 16px;
  font-weight: bold;
  color: var(--color-text-dark);
  background-color: var(--bg-main);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--btn-primary);
  }
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.app-version {
  margin-top: 20px;
  font-size: 13px;
  color: var(--color-text-muted);
  opacity: 0.6;
  letter-spacing: 0.5px;
  font-weight: 500;
}
</style>
