<template>
  <v-layout>
    <!-- Sidebar -->
    <v-navigation-drawer permanent width="92" class="sidebar" elevation="1" app>
      <v-list nav>
        <v-divider></v-divider>

        <!-- Profile -->
        <v-list-item v-if="!store.localMode" class="d-flex align-center justify-center" @click="goToProfile">
          <v-icon class="ml-2" size="40">mdi-account</v-icon>
          <span class="ml-1">Profile</span>
        </v-list-item>

        <v-divider v-if="!store.localMode"></v-divider>

        <!-- Create -->
        <v-list-item class="d-flex align-center justify-center" @click="showAddBoardModal = true">
          <v-icon class="ml-2" size="40">mdi-plus</v-icon>
          <span class="ml-1">Create</span>
        </v-list-item>

        <v-divider></v-divider>

        <!-- Settings -->
        <v-list-item class="d-flex align-center justify-center" @click="openSettings">
          <v-icon class="ml-2" size="40">mdi-cog</v-icon>
          <span class="">Settings</span>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- Main Dashboard Content -->
    <v-main class="dashboard-main">
      <DashboardContent />
    </v-main>
    <!-- Add Board Modal -->
    <GenericModal title="Add New Board" :isOpen="showAddBoardModal" :initialValues="{ title: '' }"
      @submit="handleAddBoard" @close="showAddBoardModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Board Title" required />
      </template>
    </GenericModal>

    <Settings v-if="showSettingsModal" @close="showSettingsModal = false" />

  </v-layout>
</template>

<script setup>

import { useBoardStore } from '@/stores/board'

const store = useBoardStore();
store.loadFromStorage()

const showAddBoardModal = ref(false);
function handleAddBoard(inputValues) {
  store.createBoard(inputValues.title.trim());
  showAddBoardModal.value = false;
}

const showSettingsModal = ref(false)

function openSettings() {
  showSettingsModal.value = true
}

function goToProfile() {
  // navigate to profile
}
</script>

<style scoped>
.dashboard-main {
  padding: 2rem;
  min-height: 100vh;
}
</style>
