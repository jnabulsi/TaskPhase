<template>
  <v-container fluid class="pa-0">
    <v-app-bar app>
      <v-app-bar-nav-icon />
      <v-toolbar-title>Project Name</v-toolbar-title>
      <v-spacer />
      <v-btn icon><v-icon>mdi-plus</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-row no-gutters class="pa-4 justify-center" style="overflow-x: auto; flex-wrap: nowrap;">
        <Column v-for="column in columns" :key="column.id" :column="column" />
      </v-row>
    </v-main>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const columns = ref([
  {
    id: 1,
    title: 'To Do',
    tasks: [
      { id: 1, title: 'Implement authentication' },
      { id: 2, title: 'Design landing page' },
      { id: 3, title: 'Setup database schema' },
    ],
  },
  {
    id: 2,
    title: 'In Progress',
    tasks: [
      { id: 4, title: 'Develop API endpoints' },
    ],
  },
  {
    id: 3,
    title: 'Done',
    tasks: [
      { id: 5, title: 'Create project repository' },
      { id: 6, title: 'Write project documentation' },
    ],
  },
]);
</script>
