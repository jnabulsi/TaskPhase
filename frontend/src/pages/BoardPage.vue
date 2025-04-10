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

        <v-card class="mx-2 px-5 " :style="{ backgroundColor: '#424242' }">
          <!-- Tags Section -->
          <v-list-item-title class=" ma-2 text-h5">Tags</v-list-item-title>
          <!-- List of Tags -->
          <v-list>
            <v-list-item class="pa-0" v-for="tag in tags" :key="tag.id">
              <v-checkbox v-model="tag.value" :label="tag.title" :style="{ color: tag.color }" hide-details />
            </v-list-item>
          </v-list>

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
      <v-toolbar-title class="text-h5">Project Name</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-row no-gutters class="pa-4 justify-center" style="overflow-x: auto; flex-wrap: nowrap;">
        <draggable v-model="columns" group="columns" item-key="id" tag="div" class="d-flex" handle=".column-header"
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

  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { useBoardStore } from '@/stores/board';

const store = useBoardStore();

const activeBoard = store.activeBoard;
const columns = activeBoard?.columns || [];
const tags = activeBoard?.tags || [];

const drawer = ref(false);
const showAddColumnModal = ref(false);
const showAddTagModal = ref(false);

function addTag(inputValues) {
  store.addTag(inputValues.title.trim(), true, inputValues.color);
  showAddTagModal.value = false;
}

function handleAddColumn(inputValues) {
  store.addColumn(inputValues.title.trim(), inputValues.color);
  showAddColumnModal.value = false;
}

function onColumnDragEnd(evt) {
  const movedColumnId = columns[evt.oldIndex].id;
  store.updateColumnPosition(movedColumnId, evt.newIndex);
}
</script>
