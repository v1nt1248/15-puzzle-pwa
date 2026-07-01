import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameRecord, TileValue } from '@/types'
import { translations } from '@/data/locales'

export const useGameStore = defineStore('game', () => {
  const defaultPlayerName = ref(localStorage.getItem('15_puzzle_name') || 'Player 1')
  const currentLang = ref(localStorage.getItem('15_puzzle_lang') || 'en')
  const boardSize = ref<number>(Number(localStorage.getItem('15_puzzle_size')) || 4)
  const gameHistory = ref<GameRecord[]>([])

  const availableLanguages = ref([
    { code: 'en', label: 'EN' },
    { code: 'pl', label: 'PL' },
    { code: 'by', label: 'BY' },
    { code: 'ua', label: 'UA' },
    { code: 'ru', label: 'RU' },
  ])

  const t = computed(() => translations[currentLang.value] || translations.en)

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function loadHistory() {
    const localData = localStorage.getItem('15_puzzle_history')
    gameHistory.value = localData ? JSON.parse(localData) : []
  }

  function saveGameResult(
    playerName: string,
    initialBoard: TileValue[],
    moves: number,
    time: number,
  ) {
    const newRecord: GameRecord = {
      id: Date.now().toString(),
      playerName: playerName.trim() || defaultPlayerName.value,
      initialBoard,
      moves,
      time,
      date: new Date().toLocaleDateString(),
    }
    gameHistory.value.unshift(newRecord)
    localStorage.setItem('15_puzzle_history', JSON.stringify(gameHistory.value))
  }

  function changeDefaultName(name: string) {
    defaultPlayerName.value = name
    localStorage.setItem('15_puzzle_name', name)
  }

  function changeLang(lang: string) {
    currentLang.value = lang
    localStorage.setItem('15_puzzle_lang', lang)
  }

  function changeBoardSize(size: number) {
    boardSize.value = size
    localStorage.setItem('15_puzzle_size', size.toString())
  }

  return {
    defaultPlayerName,
    currentLang,
    boardSize,
    gameHistory,
    availableLanguages,
    t,
    formatTime,
    loadHistory,
    saveGameResult,
    changeDefaultName,
    changeLang,
    changeBoardSize,
  }
})
