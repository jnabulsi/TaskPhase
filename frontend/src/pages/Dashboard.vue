<template>
  <v-layout>
    <!-- Sidebar -->
    <v-navigation-drawer permanent width="92" class="sidebar" elevation="1" app>
      <v-list nav>
        <v-divider></v-divider>

        <!-- Profile -->
        <v-list-item class="d-flex align-center justify-center" @click="goToProfile">
          <v-icon class="ml-2" size="40">mdi-account</v-icon>
          <span class="ml-1">Profile</span>
        </v-list-item>

        <v-divider></v-divider>

        <!-- Create -->
        <v-list-item class="d-flex align-center justify-center" @click="createBoard">
          <v-icon class="ml-2" size="40">mdi-plus</v-icon>
          <span class="ml-1">Create</span>
        </v-list-item>

        <v-divider></v-divider>

        <!-- Settings -->
        <v-list-item class="d-flex align-center justify-center" @click="goToSettings">
          <v-icon class="ml-2" size="40">mdi-cog</v-icon>
          <span class="">Settings</span>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- Main Dashboard Content -->
    <v-main class="dashboard-main">
      <DashboardContent />
    </v-main>
  </v-layout>
</template>

<script setup>
function createBoard() {
  // open create modal
}

function goToSettings() {
  // navigate to settings
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

