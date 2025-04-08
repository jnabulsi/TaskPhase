<template>
  <v-card class="mb-4 pa-4" outlined @click="showTaskModal = true">
    <div class="text-h6 font-weight-medium">{{ task.title }}</div>

    <!-- Task View Modal -->
    <v-dialog v-if="!showEditTaskModal" v-model="showTaskModal" max-width="600" scrim="rgba(0, 0, 0, 0.8)">
      <v-card>
        <v-card-title>{{ task.title }}</v-card-title>
        <v-card-text>
          <p>Description: {{ task.description }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showEditTaskModal = true">Edit Task</v-btn>
          <v-btn @click="showTaskModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <GenericModal title="Edit Task" :isOpen="showEditTaskModal"
      :initialValues="{ title: task.title, description: task.description }" @submit="saveTask"
      @close="showEditTaskModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Task Title" />
        <v-textarea v-model="inputValues.description" label="Task Description" rows="4" />
      </template>
    </GenericModal>
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
const showEditTaskModal = ref(false);

function saveTask(inputValues) {
  store.updateTask(props.task.id, inputValues.title.trim(), inputValues.description.trim());
  showEditTaskModal.value = false;
}
</script>
