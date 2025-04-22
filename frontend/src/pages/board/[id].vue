<template>
  <v-container fluid class="pa-0">
    <!-- Sidebar -->
    <v-navigation-drawer v-model="drawer" :width="350" temporary app>
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6"></v-list-item-title>
        </v-list-item>

        <!-- Columns Section -->
        <v-divider class="my-2" />
        <v-list-item class="ma-2 pa-4" @click="showAddColumnModal = true" icon="mdi-plus">
          <template #prepend>
            <v-icon class="text-h4">mdi-plus</v-icon>
          </template>
          <v-list-item-title class="text-h6">Add Column</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2" />
        <v-card class="mx-2 px-5" style="background-color: #424242">
          <v-card-title class="text-h5">Tags</v-card-title>

          <v-divider class="mb-2" />

          <v-container fluid class="pa-0">
            <v-row v-for="tag in tags" :key="tag.id" align="center" class="ma-0 pa-2"
              style="border-bottom: 1px solid #555">
              <!-- Checkbox -->
              <v-col cols="auto">
                <v-checkbox v-model="tag.value" hide-details density="compact" :style="{ color: tag.color }" />
              </v-col>

              <!-- Tag Title -->
              <v-col class="text-white">
                {{ tag.title }}
              </v-col>

              <!-- Actions Menu -->
              <v-col cols="auto">
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn icon v-bind="props">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="openTagEditModal(tag)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
          <!-- Add Tag Button -->
          <v-list-item class="my-2 pa-4" @click="showAddTagModal = true" icon="mdi-plus">
            <template #prepend>
              <v-icon class="text-h4">mdi-plus</v-icon>
            </template>
            <v-list-item-title class="text-h6">Add Tag</v-list-item-title>
          </v-list-item>
        </v-card>
      </v-list>
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar class="pa-1" app>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="text-h5" />
      <v-toolbar-title class="text-h5"> {{ boardName }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-row no-gutters class="pa-4 justify-center" style="overflow-x: auto; flex-wrap: nowrap;">
        <draggable :list="sortedColumns" group="columns" item-key="id" tag="div" class="d-flex" handle=".column-header"
          @end="onColumnDragEnd">
          <template #item="{ element }">
            <Column :column="element" :key="element.id" />
          </template>
        </draggable>
      </v-row>
    </v-main>

    <!-- Add Tag Modal -->
    <GenericModal title="Add New Tag" :isOpen="showAddTagModal" :initialValues="{ title: '', color: '#000000' }"
      @submit="addTag" @close="showAddTagModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Tag Title" required />
        <v-color-picker v-model="inputValues.color" label="Tag Color" />
      </template>
    </GenericModal>

    <!-- Add Column Modal -->
    <GenericModal title="Add New Column" :isOpen="showAddColumnModal" :initialValues="{ title: '', color: '#000000' }"
      @submit="handleAddColumn" @close="showAddColumnModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Column Title" required />
        <v-color-picker v-model="inputValues.color" label="Column Color" />
      </template>
    </GenericModal>

    <!-- Edit Tag Modal -->
    <GenericModal title="Edit Tag" :isOpen="showTagEditModal"
      :initialValues="{ title: newTagTitle, color: newTagColor }" :showDelete="true" @submit="handleUpdateTag"
      @delete="handleDeleteTag" @close="showTagEditModal = false">
      <template #inputs="{ inputValues }">
        <v-text-field v-model="inputValues.title" label="Tag Title" required />
        <v-color-picker v-model="inputValues.color" label="Tag Color" />
      </template>
    </GenericModal>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { useBoardStore } from '@/stores/board';
import { computeOrder } from '@/utils/utils';

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
  const ordered = store.getActiveColumns().sort((a, b) => a.order - b.order)

  const [moved] = ordered.splice(oldIndex, 1)
  ordered.splice(newIndex, 0, moved)

  const before = ordered[newIndex - 1]?.order
  const after = ordered[newIndex + 1]?.order

  const newOrder = computeOrder(before, after)

  store.updateColumnOrder(moved.id, newOrder)
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
let editingTagId = ref(null);

function openTagEditModal(tag) {
  newTagTitle.value = tag.title;
  newTagColor.value = tag.color;
  editingTagId = tag.id;
  showTagEditModal.value = true;
}

function handleUpdateTag(inputValues) {
  store.updateTag(editingTagId, {
    title: inputValues.title.trim(),
    color: inputValues.color,
  });
  showTagEditModal.value = false;
  editingTagId = null;
}

function handleDeleteTag() {
  store.deleteTag(editingTagId);
  showTagEditModal.value = false;
  editingTagId = null;
}

function handleAddColumn(inputValues) {
  store.createColumn(inputValues.title.trim(), inputValues.color);
  showAddColumnModal.value = false;
}
</script>
