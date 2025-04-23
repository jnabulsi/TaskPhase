<template>
  <v-container fluid class="pa-0">
    <!-- Sidebar -->
    <BoardSidebar v-model:drawer="drawer" :tags="tags" @open-add-column="showAddColumnModal = true"
      @open-add-tag="showAddTagModal = true" @edit-tag="openTagEditModal" />

    <!-- Top Bar -->
    <v-app-bar class="pa-1" app>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="text-h5" />
      <v-toolbar-title class="text-h5"> {{ boardName }}</v-toolbar-title>
    </v-app-bar>

    <!-- Columns -->
    <v-main class="pa-0">
      <div class="column-scroll-wrapper mt-16">
        <v-row no-gutters class="columns-row">
          <draggable :list="sortedColumns" group="columns" item-key="id" tag="div" class="d-flex"
            handle=".column-header" @end="onColumnDragEnd">
            <template #item="{ element }">
              <Column :column="element" :key="element.id" />
            </template>
          </draggable>
        </v-row>
      </div>
    </v-main>

    <!-- Add Tag Modal -->
    <AddTagModal :isOpen="showAddTagModal" @submit="addTag" @close="showAddTagModal = false" />

    <!-- Edit Tag Modal -->
    <EditTagModal :isOpen="showTagEditModal" :title="newTagTitle" :color="newTagColor" @submit="handleUpdateTag"
      @delete="handleDeleteTag" @close="showTagEditModal = false" />

    <!-- Add Column Modal -->
    <AddColumnModal :isOpen="showAddColumnModal" @submit="handleAddColumn" @close="showAddColumnModal = false" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { useBoardStore } from '@/stores/board';
import { computeOrder } from '@/utils/utils';
import { useRoute } from 'vue-router'

const route = useRoute();
const store = useBoardStore();
store.loadFromStorage()
const boardId = route.params.id;

watchEffect(() => {
  if (store.boards.find(b => b.id === boardId)) {
    store.setActiveBoard(boardId)
  }
})

function getBoardNameByBoardId(boardId) {
  const board = store.boards.find(board => board.id === boardId);
  return board ? board.name : null;
}

const boardName = getBoardNameByBoardId(boardId);

const sortedColumns = computed(() =>
  store.getActiveColumns.sort((a, b) => a.order - b.order)
)

function onColumnDragEnd(evt) {
  const { oldIndex, newIndex } = evt
  if (oldIndex === newIndex) return
  const ordered = store.getActiveColumns.sort((a, b) => a.order - b.order)

  const [moved] = ordered.splice(oldIndex, 1)
  ordered.splice(newIndex, 0, moved)

  const before = ordered[newIndex - 1]?.order
  const after = ordered[newIndex + 1]?.order

  const newOrder = computeOrder(before, after)

  store.moveColumn(moved.id, newOrder)
}

const drawer = ref(false);
const showAddColumnModal = ref(false);
const showAddTagModal = ref(false);


const tags = computed(() => store.getActiveTags);
function addTag(inputValues) {
  store.createTag(inputValues.title.trim(), inputValues.color);
  showAddTagModal.value = false;
}

const showTagEditModal = ref(false);
const newTagTitle = ref('');
const newTagColor = ref('');
const editingTagId = ref(null);

function openTagEditModal(tag) {
  newTagTitle.value = tag.title;
  newTagColor.value = tag.color;
  editingTagId.value = tag.id;
  showTagEditModal.value = true;
}

function handleUpdateTag(inputValues) {
  store.updateTag(editingTagId.value, {
    title: inputValues.title.trim(),
    color: inputValues.color,
  });
  showTagEditModal.value = false;
  editingTagId.value = null;
}

function handleDeleteTag() {
  store.deleteTag(editingTagId.value);
  showTagEditModal.value = false;
  editingTagId.value = null;
}

function handleAddColumn(inputValues) {
  store.createColumn(inputValues.title.trim(), inputValues.color);
  showAddColumnModal.value = false;
}
</script>
<style scoped>
.column-scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  height: 100%;
}

.columns-row {
  flex-wrap: nowrap;
  min-width: max-content;
  justify-content: center;
}
</style>
