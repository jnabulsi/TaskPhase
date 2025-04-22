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
              <v-card-title class="text-subtitle-1 font-weight-medium d-flex align-center">
                {{ board.name }}
                <!-- Dropdown Menu Button -->
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn class="ml-auto" v-bind="props" icon aria-label="Board options" title="Board options">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="openBoardEditModal(board)">
                      <v-list-item-title>Edit Board</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
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
    <!-- Board Edit Modal -->
    <GenericModal title="Edit Board" :isOpen="showBoardEditModal" :initialValues="{ title: newBoardTitle }"
      :showDelete="true" @submit="handleUpdateBoard" @delete="handleDeleteBoard(selectedBoardId)"
      @close="showBoardEditModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Board Title" />
      </template>
    </GenericModal>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBoardStore } from '@/stores/board'
import { useRouter } from 'vue-router'

const router = useRouter()
const boardStore = useBoardStore()

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

function defaultBordInit() {
  if (boardStore.boards.length === 0) {
    store.createBoard("Default Board");

    store.createColumn("To Do", "#42A5F5");
    store.createColumn("In Progress", "#FFB300");
    store.createColumn("Done", "#66BB6A");

    //get col id from the created cols
    store.createTask(columnId, title, description = '', tags = [],);
  }
}

function goToBoard(boardId) {
  boardStore.activeBoardId = boardId
  router.push(`/board/${boardId}`)
}

const selectedBoardId = ref(null);
const showBoardEditModal = ref(false);
const newBoardTitle = ref('');


function openBoardEditModal(board) {
  selectedBoardId.value = board.id
  newBoardTitle.value = board.name
  showBoardEditModal.value = true
}
function handleUpdateBoard(inputValues) {
  showBoardEditModal.value = false
  boardStore.updateBoard(selectedBoardId.value, {
    name: inputValues.title.trim(),
  })
}

function handleDeleteBoard(boardId) {
  showBoardEditModal.value = false
  boardStore.deleteBoard(boardId)
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
