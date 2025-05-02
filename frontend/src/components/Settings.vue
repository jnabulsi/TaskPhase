<template>
  <v-dialog v-model="internalModel" min-height="550" max-width="800">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6">Settings</span>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <!-- Sidebar -->
          <v-col cols="3" style="border-right: 1px solid #ccc;">
            <v-list nav dense>
              <v-list-item v-for="(item, i) in menuItems" :key="i" :value="item.value" @click="selected = item.value"
                :active="selected === item.value">
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- Main content -->
          <v-col cols="9" class="pa-4">
            <div v-if="selected === 'storage'">
              <!-- Import Data Section -->
              <v-col cols="12">
                <p class="mt-4">Import Data</p>
                <p class="mb-2">Import data into the project using a JSON file. This will overwrite existing data.</p>
                <v-btn color="primary">Import JSON</v-btn>
              </v-col>
              <!-- Export Data Section -->
              <v-col cols="12">
                <v-divider></v-divider>
                <p class="mt-4">Export Data</p>
                <p class="mb-2">Export your project data to a JSON file for backup or sharing.</p>
                <v-btn color="primary">Export JSON</v-btn>
              </v-col>

              <!-- Clear Data Section --> <v-col cols="12">
                <v-divider></v-divider>
                <p class="mt-4 red--text">Clear Data</p>
                <p class="mb-2 red--text">This will permanently delete all data and cannot be undone!</p>
                <v-btn color="red" @click="confirmClearData">Clear Data</v-btn>
              </v-col>
            </div>
            <div v-else-if="selected === 'keybindings'">
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showConfirmClearDataModal" max-width="500px">
    <v-card>
      <v-card-title class="headline">Are you sure?</v-card-title>
      <v-card-text>
        <p>Do you really want to clear all the data stored in your browser?</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="showConfirmClearDataModal = false">Cancel</v-btn>
        <v-btn @click="clearData" color="red">Yes, Clear Data</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useBoardStore } from '@/stores/board'
const internalModel = ref(true)

const showConfirmClearDataModal = ref(false)

function confirmClearData() {
  showConfirmClearDataModal.value = true;
}

const boardStore = useBoardStore()
function clearData() {
  boardStore.clearStorage()
  showConfirmClearDataModal.value = false;
}

const selected = ref('storage');

const menuItems = [
  { label: 'Storage', value: 'storage' },
  { label: 'Keybindings', value: 'keybindings' },
];


const emit = defineEmits(['close'])

function close() {
  internalModel.value = false
}

watch(internalModel, (val) => {
  if (!val) emit('close')
})
</script>
