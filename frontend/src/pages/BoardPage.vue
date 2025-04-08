<template>
  <v-container fluid class="pa-0">
    <v-app-bar app>
      <v-app-bar-nav-icon />
      <v-toolbar-title>Project Name</v-toolbar-title>
      <v-spacer />
      <v-btn icon aria-label="Add New Column" title="Add New Column"><v-icon>mdi-plus</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-row no-gutters class="pa-4 justify-center" style="overflow-x: auto; flex-wrap: nowrap;">
        <Column v-for="column in columns" :key="column.id" :column="column" />
      </v-row>
    </v-main>

  </v-container>
</template>

<script setup>
import { useBoardStore } from '@/stores/board'

const boardStore = useBoardStore()

const activeBoard = boardStore.activeBoard; // Use the getter
const columns = activeBoard?.columns || []; // Safely access columns
</script>
