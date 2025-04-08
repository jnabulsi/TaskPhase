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
    <GenericModal title="Edit Column" :isOpen="showColumnEditModal" :initialValues="{ title: newColumnTitle }"
      @submit="saveColumn" @close="showColumnEditModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Column Title" />
      </template>
    </GenericModal>

    <!-- Task Add Modal -->
    <GenericModal :title="'Add Task'" :isOpen="showTaskAddModal" :initialValues="{ title: '', description: '' }"
      @submit="addNewTask" @close="showTaskAddModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Task title" />
        <v-textarea v-model="inputValues.description" label="Task description" auto-grow />
      </template>
    </GenericModal>
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

function addNewTask({ title, description }) {
  if (title.trim()) {
    store.addTask(props.column.id, title.trim(), description.trim());
    showTaskAddModal.value = false;
  }
}

const showColumnEditModal = ref(false);

function openColumnEditModal() {
  newColumnTitle.value = props.column.title;
  showColumnEditModal.value = true;
}

function saveColumn(inputValues) {
  store.updateColumnTitle(props.column.id, inputValues.title.trim());
  showColumnEditModal.value = false;
}
</script>
