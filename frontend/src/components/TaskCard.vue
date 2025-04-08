<template>
  <v-card class="mb-4 pa-4" outlined @click="openTaskModal">
    <div class="text-h6 font-weight-medium">{{ task.title }}</div>

    <v-dialog v-model="showTaskModal" max-width="600" scrim="rgba(0, 0, 0, 0.8)">
      <v-card v-if="!showTaskEditModal">
        <v-card-title>{{ task.title }}</v-card-title>
        <v-card-text>
          <p>Task Details</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="openEditTask">Edit Task</v-btn>
          <v-btn @click="closeTaskModal">Close</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-if="showTaskEditModal">
        <v-card-title>Edit Task</v-card-title>
        <v-card-text>
          <v-text-field v-model="newTaskTitle" label="Task Title" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveTask">Save</v-btn>
          <v-btn @click="closeTaskModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useBoardStore } from '@/stores/board';

const store = useBoardStore();

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const showTaskModal = ref(false);

function openTaskModal() {
  showTaskEditModal.value = false;
  showTaskModal.value = true;
}

function closeTaskModal() {
  showTaskModal.value = false;
}

const showTaskEditModal = ref(false);
const newTaskTitle = ref('');

function openEditTask() {
  newTaskTitle.value = props.task.title;
  showTaskEditModal.value = true;
}

function saveTask() {
  store.updateTask(props.task.id, newTaskTitle.value.trim());

  closeTaskModal();
}

</script>
