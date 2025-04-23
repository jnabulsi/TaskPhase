<template>
  <GenericModal :title="'Add Task'" :isOpen="isOpen" :initialValues="initialValues" @submit="addNewTask"
    @close="handleClose">
    <template #inputs="{ inputValues }">
      <v-text-field v-model="inputValues.title" label="Task title" />
      <v-textarea v-model="inputValues.description" label="Task description" auto-grow />
      <!-- Tags Selection -->
      <v-list>
        <v-list-item v-for="tag in tags" :key="tag.id">
          <v-checkbox v-model="inputValues.tags" :label="tag.title" :value="tag.id" :style="{ color: tag.color }"
            hide-details />
        </v-list-item>
      </v-list>
    </template>
  </GenericModal>
</template>

<script setup>
import { useBoardStore } from '@/stores/board';

const store = useBoardStore();

const props = defineProps({
  isOpen: Boolean,
  initialValues: Object,
  handleClose: Function,
  tags: Array
});

const addNewTask = ({ title, description, tags }) => {
  if (title.trim()) {
    store.createTask(props.columnId, title.trim(), description.trim(), tags);
    props.handleClose();
  }
};
</script>
