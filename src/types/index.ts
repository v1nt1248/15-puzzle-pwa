export type TileValue = number | null

export interface GameRecord {
  id: string
  playerName: string
  initialBoard: TileValue[]
  moves: number
  time: number
  date: string
}

export interface LocaleStorage {
  title: string
  moves: string
  time: string
  restart: string
  settings: string
  back: string
  playerName: string
  language: string
  history: string
  noHistory: string
  winMessage: string
  retry: string
  date: string
  start: string
  shuffle: string
  saveResult: string
  saveBtn: string
  cancelBtn: string
  enterNamePlaceholder: string
  gridSize: string
}
