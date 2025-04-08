<template>
  <v-card class="mb-4 pa-4" outlined @click="openTaskModal">
    <div class="text-h6 font-weight-medium">{{ task.title }}</div>

    <v-dialog v-model="taskModal" max-width="600" scrim="rgba(0, 0, 0, 0.8)">
      <v-card>
        <v-card-title>{{ task.title }}</v-card-title>
        <v-card-text>
          <p>Task Details</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="openEditTask">Edit Task</v-btn>
          <v-btn @click="taskModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const taskModal = ref(false);

function openTaskModal() {
  taskModal.value = true;
}

function openEditTask() {
}
</script>
