<template>
  <v-card class="ma-4" width="380">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <span class="ml-2 pa-3 text-h5">{{ column.title }}</span>
      </div>
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" aria-label="Edit column options" title="Edit column options">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="openColumnEditModal">
            <v-list-item-title>Edit Column</v-list-item-title>
          </v-list-item>
          <v-list-item @click="showTaskAddModal = true">
            <v-list-item-title>Add Task</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <TaskCard v-for="task in column.tasks" :key="task.id" :task="task" />
    </v-card-text>

    <!-- Column Edit Modal -->
    <v-dialog v-model="showColumnEditModal" max-width="600" scrim="rgba(0, 0, 0, 0.8)">
      <v-card>
        <v-card-title>Edit Column</v-card-title>
        <v-card-text>
          <v-text-field v-model="newColumnTitle" label="Column Title" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveColumn">Save</v-btn>
          <v-btn @click="showColumnEditModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Task Add Modal -->
    <v-dialog v-model="showTaskAddModal" max-width="600" scrim="rgba(0, 0, 0, 0.8)">
      <v-card>
        <v-card-title>Add Task</v-card-title>
        <v-card-text>
          <v-text-field v-model="newTaskTitle" label="Task title" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showTaskAddModal = false">Cancel</v-btn>
          <v-btn @click="addNewTask">Add</v-btn>
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
  column: {
    type: Object,
    required: true
  }
});

const showTaskAddModal = ref(false);
const newTaskTitle = ref('');

function addNewTask() {
  if (newTaskTitle.value.trim()) {
    store.addTask(props.column.id, newTaskTitle.value.trim());
    newTaskTitle.value = '';
    showTaskAddModal.value = false;
  }
}

const showColumnEditModal = ref(false);
const newColumnTitle = ref('');

function openColumnEditModal() {
  newColumnTitle.value = props.column.title;
  showColumnEditModal.value = true;
}

function saveColumn() {
  store.updateColumnTitle(props.column.id, newColumnTitle.value.trim());
  showColumnEditModal.value = false;
}
</script>

