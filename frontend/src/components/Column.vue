<template>
  <v-card :style="{ backgroundColor: lightenColor(column.color, 0.2) }" class="ma-4" width="380">
    <v-card-title :style="{ backgroundColor: column.color }"
      class="column-header d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <span class="ml-2 pa-3 text-h5 font-weight-bold ">{{ column.title }}</span>
      </div>
      <v-menu>
        <template #activator="{ props }">
          <v-btn :style="{ backgroundColor: column.color }" v-bind="props" aria-label="Edit column options"
            title="Edit column options">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn> </template>
        <v-list>
          <v-list-item @click="openColumnEditModal">
            <v-list-item-title>Edit Column</v-list-item-title> </v-list-item>
          <v-list-item @click="showTaskAddModal = true">
            <v-list-item-title>Add Task</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-divider />

    <v-card-text :data-column-id="props.column.id">
      <draggable v-model="columnTasks" item-key="id" group="tasks" @end="onTaskDrop" class="task-list">
        <template #item="{ element }">
          <div>
            <TaskCard v-if="passesFilters(element)" :task="element" />
          </div>
        </template>
      </draggable>
    </v-card-text>

    <!-- Column Edit Modal -->
    <GenericModal title="Edit Column" :isOpen="showColumnEditModal"
      :initialValues="{ title: newColumnTitle, color: newColumnColor }" :showDelete="true" @submit="handleUpdateColumn"
      @delete="handleDeleteColumn" @close="showColumnEditModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Column Title" />
        <v-color-picker v-model="inputValues.color" label="Column Color" />
      </template>
    </GenericModal>

    <!-- Task Add Modal -->
    <GenericModal :title="'Add Task'" :isOpen="showTaskAddModal"
      :initialValues="{ title: '', description: '', tags: [] }" @submit="addNewTask" @close="showTaskAddModal = false">
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
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';
import { useBoardStore } from '@/stores/board';
import { lightenColor } from '@/utils/utils';

const store = useBoardStore();

const props = defineProps({
  column: {
    type: Object,
    required: true
  }
});

const tags = computed(() => store.getActiveTags);

function passesFilters(task) {
  const board = store.getActiveBoard;
  const activeTags = Object.values(store.tags).filter(
    tag => tag.boardId === board.id && tag.value
  );

  if (activeTags.length === 0) return true;

  const taskTagSet = new Set(task.tags);
  return activeTags.some(tag => taskTagSet.has(tag.id));
}

const showTaskAddModal = ref(false);

function addNewTask({ title, description, tags }) {
  if (title.trim()) {
    store.createTask(props.column.id, title.trim(), description.trim(), tags);
    showTaskAddModal.value = false;
  }
}

const showColumnEditModal = ref(false);
const newColumnTitle = ref('');
const newColumnColor = ref('');

function openColumnEditModal() {
  newColumnTitle.value = props.column.title;
  newColumnColor.value = props.column.color;
  showColumnEditModal.value = true;
}

function handleUpdateColumn(inputValues) {
  store.updateColumn(props.column.id, {
    title: inputValues.title.trim(),
    color: inputValues.color,
  });
  showColumnEditModal.value = false;
}

function handleDeleteColumn() {
  showColumnEditModal.value = false;
  store.deleteColumn(props.column.id);
}

const columnTasks = ref([]);

watchEffect(() => {
  columnTasks.value = store.getActiveTasks
    .filter(task => task.columnId === props.column.id)
    .sort((a, b) => a.order - b.order);
});

function onTaskDrop(event) {
  const movedTaskId = event.item.id;
  const newIndex = event.newIndex;

  store.moveTask(movedTaskId, newIndex, props.column.id);
}
</script>

<style scoped>
.column-header {
  cursor: move;
}
</style>
