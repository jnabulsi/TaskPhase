<template>
  <v-card class="ma-4" width="280">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <span class="ml-2">{{ column.title }}</span>
      </div>
      <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <TaskCard v-for="task in column.tasks" :key="task.id" :task="task" />
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
});
</script>
