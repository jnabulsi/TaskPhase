<template>
  <v-dialog v-model="internalModel" min-height="550" max-width="800">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6">Settings</span>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pl-8 ml-16">
        <v-row>
          <!-- Import Data Section -->
          <v-col cols="12">
            <p class="mt-4 text-h6">Import Data</p>
            <p class="mb-2">Import data using a JSON file.</p>
            <p class="mb-2">Export JSON from the board options.</p>

            <input class="ma-4" type="file" accept=".json" @change="handleFileChange">

            <v-btn color="primary" @click="importJson">Import JSON</v-btn>
          </v-col>

          <!-- Clear Data Section --> <v-col cols="12">
            <v-divider></v-divider>
            <p class="mt-4 red--text text-h6">Clear Data</p>
            <p class="mb-2 red--text">This will permanently delete all data and cannot be undone!</p>
            <v-btn color="red" @click="confirmClearData">Clear Data</v-btn>
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
import { importBoardData } from '@/utils/utils';
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

const selectedFile = ref(null);

function handleFileChange(event) {
  selectedFile.value = event.target.files[0] || null
}

async function importJson() {
  if (!selectedFile.value) {
    console.log('No file selected');
    return
  }

  const text = await selectedFile.value.text()

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (e) {
    console.log('Invalid JSON file', e);
    return
  }

  importBoardData(parsed)
  selectedFile.value = null
}

const emit = defineEmits(['close'])

function close() {
  internalModel.value = false
}

watch(internalModel, (val) => {
  if (!val) emit('close')
})
</script>
