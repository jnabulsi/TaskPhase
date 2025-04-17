<template>
  <v-container fluid class="mt-8 pt-16 pa-8 dashboard-container">
    <v-row justify="center">

      <v-col cols="12" md="10" lg="8">
        <!-- Welcome Title -->
        <h1 class="text-h4 font-weight-bold mb-6">Your Boards</h1>

        <!-- Search Bar -->
        <v-text-field v-model="search" label="Search boards" prepend-inner-icon="mdi-magnify" variant="outlined"
          class="mb-10" />

        <!-- Boards Grid -->
        <v-row dense>
          <v-col v-for="board in filteredBoards" :key="board.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="pa-4" hover ripple @click="goToBoard(board.id)">
              <v-card-title class="text-subtitle-1 font-weight-medium">
                {{ board.name }}
              </v-card-title>
              <!-- Color Strip Preview -->
              <v-card-text class="d-flex px-0 py-2 preview-strip">
                <div v-for="col in board.columns" :key="col.id" :style="{ backgroundColor: col.color, flex: 1 }" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBoardStore } from '@/stores/board'
import { useRouter } from 'vue-router'

const router = useRouter()
const boardStore = useBoardStore()

boardStore.initializeFromDefault();

const search = ref('')

const filteredBoards = computed(() => {
  const query = search.value.toLowerCase()

  return boardStore.boards
    .filter(board => board.name.toLowerCase().includes(query))
    .map(board => {
      const columns = boardStore.columns
        .filter(col => col.boardId === board.id)
        .sort((a, b) => a.order - b.order)

      return { ...board, columns }
    })
})

function goToBoard(boardId) {
  console.log("test")
  boardStore.activeBoardId = boardId
  router.push(`/board/${boardId}`)
}

</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
}

.preview-strip>div {
  height: 20px;
  margin-right: 2px;
}

.preview-strip>div:last-child {
  margin-right: 0;
}
</style>
