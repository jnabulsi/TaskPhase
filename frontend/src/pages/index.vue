<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height d-flex flex-row">
      <!-- Left Side: Text/CTA -->
      <v-col cols="12" md="6" class="d-flex flex-column justify-center px-6 px-md-12 pl-md-16 text-container">
        <div>
          <h1 class="font-weight-bold mb-4 gradient-text">TaskPhase</h1>
          <p class="text-h5 mb-6">
            Lightweight task boards for devs. Fast, local-first, and private.
          </p>
          <v-btn color="primary" size="large" @click="goLocal" rounded>
            Try it now
          </v-btn>
        </div>
      </v-col>

      <!-- Right Side: Visual -->
      <v-col cols="12" md="6" class="d-flex justify-center align-center right-pane">
        <img src="@/assets/demo.png" alt="App Preview" class="screenshot" />
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
  store.localMode = true
  store.saveToStorage()
  nextTick(() => {
    router.push('/dashboard')
  })
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.left-pane {
  background-color: #0f0f0f;
  color: white;
}

.right-pane {
  background-color: #A5D6A7
}

.gradient-text {
  background: linear-gradient(90deg, #42A5F5, #FFB300, #66BB6A);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 6.5rem;
}

@media (min-width: 960px) and (max-width: 1250px) {
  .gradient-text {
    font-size: 5rem;
  }
}

@media (max-width: 600px) {
  .gradient-text {
    font-size: 4.5rem;
  }
}


.screenshot {
  max-width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
</style>
