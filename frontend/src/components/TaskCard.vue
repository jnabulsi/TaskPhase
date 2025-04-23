<template>
  <v-card class="mb-4 pa-4" outlined @click="showTaskModal = true">
    <div class="text-h6 font-weight-medium">{{ task.title }}</div>
    <div class="d-flex flex-wrap gap-2 mt-3">
      <v-chip v-for="tagId in task.tags" :key="tagId" :color="store.getTagById(tagId)?.color" label small>
        {{ store.getTagById(tagId)?.title }}
      </v-chip>
    </div>

    <!-- Task View Modal -->
    <v-dialog v-if="!showEditTaskModal" v-model="showTaskModal" max-width="600" scrim="rgba(0, 0, 0, 0.8)">
      <v-card>
        <v-card-title class="ma-3">{{ task.title }}</v-card-title>
        <v-card-text>
          <p> {{ task.description }}</p>
        </v-card-text>
        <div class="d-flex flex-wrap gap-2 pl-4 ma-3">
          <v-chip v-for="tagId in task.tags" :key="tagId" :color="store.getTagById(tagId)?.color" label small>
            {{ store.getTagById(tagId)?.title }}
          </v-chip>
        </div>
        <v-card-actions>
          <v-btn @click="showEditTaskModal = true">Edit Task</v-btn>
          <v-btn @click="showTaskModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <GenericModal title="Edit Task" :isOpen="showEditTaskModal"
      :initialValues="{ title: task.title, description: task.description, tags: task.tags }" :showDelete="true"
      @submit="saveTask" @delete="handleDeleteTask" @close="showEditTaskModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Task Title" />
        <v-textarea v-model="inputValues.description" label="Task Description" rows="4" />

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
import { useBoardStore } from '@/stores/board';

const store = useBoardStore();

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const tags = computed(() => store.getActiveTags);

const showTaskModal = ref(false);
const showEditTaskModal = ref(false);

function saveTask(inputValues) {
  store.updateTask(props.task.id, {
    title: inputValues.title.trim(),
    description: inputValues.description.trim(),
    tags: inputValues.tags
  });
  showEditTaskModal.value = false;
}

function handleDeleteTask() {
  store.deleteTask(props.task.id);
  showEditTaskModal.value = false;
}
</script>
