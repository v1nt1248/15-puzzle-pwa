<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import BaseButton from './ui/BaseButton.vue'
import BaseInput from './ui/BaseInput.vue'

const props = defineProps<{
  show: boolean
  moves: number
  time: number
}>()

const emits = defineEmits(['close', 'save'])

const store = useGameStore()
const { defaultPlayerName, t } = storeToRefs(store)
const { formatTime } = store

const saveNameInput = ref('')

watch(
  () => props.show,
  (newVal) => {
    if (newVal) saveNameInput.value = defaultPlayerName.value
  },
)

function handleSave() {
  if (!saveNameInput.value.trim()) {
    return
  }

  emits('save', saveNameInput.value.trim())
}
</script>

<template>
  <div v-if="show" class="popup-overlay">
    <div class="popup-content">
      <h2>{{ t?.winMessage }}</h2>
      <p class="popup-stats">
        🏁 {{ t?.moves }}: {{ moves }} | ⏱️ {{ t?.time }}:
        {{ formatTime(time) }}
      </p>

      <BaseInput
        v-model="saveNameInput"
        :label="t?.saveResult"
        :placeholder="t?.enterNamePlaceholder"
      />

      <div class="popup-buttons">
        <BaseButton variant="success" @click="handleSave">
          {{ t?.saveBtn }}
        </BaseButton>

        <BaseButton variant="gray" @click="$emit('close')">
          {{ t?.cancelBtn }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.popup-content {
  background: var(--bg-surface);
  color: var(--color-text-dark);
  padding: 25px;
  border-radius: 12px;
  width: 100%;
  max-width: 350px;
  text-align: center;
  box-shadow: 0 10px 25px var(--shadow-board);

  h2 {
    color: var(--btn-success);
    margin-top: 0;
    font-size: 22px;
  }
}

.popup-stats {
  font-size: 16px;
  margin-bottom: 20px;
  background: var(--bg-main);
  padding: 8px;
  border-radius: 6px;
}

.popup-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  button {
    flex: 1;
  }
}
</style>
