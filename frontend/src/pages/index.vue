<template>
  <v-container fluid>
    <v-row justify="center" class="mt-8 pt-16 pa-8 fill-height">
      <v-col cols="12" md="6" class="text-center">
        <h1 class="text-h4 font-weight-bold mb-2">TaskPhase</h1>
        <p class="text-subtitle-1 mb-6">
          Lightweight boards for devs & teams
        </p>
        <v-btn class="ma-2 mr-6" color="primary" @click="goLocal">
          Try it
        </v-btn>
        <v-btn class="ma-2 ml-6" color="secondary" @click="goLogin">
          Log in
        </v-btn>

        <v-divider class="my-6" />

        <v-row>
          <v-col cols="12" md="6">
            <v-icon size="32" class="mb-2">mdi-flash</v-icon>
            <h2 class="text-h6 font-weight-bold mb-1">Try it instantly</h2>
            <p class="text-body-2">
              No account needed. Your boards are saved in your browser.
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <v-icon size="32" class="mb-2">mdi-lock</v-icon>
            <h2 class="text-h6 font-weight-bold mb-1">Log in for full features</h2>
            <p class="text-body-2">
              Save to the cloud, collaborate with others, and sync across devices.
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores/board'

const store = useBoardStore();
store.loadFromStorage()

const router = useRouter()

function goLocal() {
  // Handle local mode navigation
  store.localMode = true
  store.saveToStorage();
  console.log('Entering local mode...');

  nextTick(() => {
    router.push('/dashboard');
  });
}

function goLogin() {
  // Handle login navigation
  console.log('Navigating to login...');
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.text-center {
  text-align: center;
}
</style>
