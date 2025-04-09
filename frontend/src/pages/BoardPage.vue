<template>
  <v-container fluid class="pa-0">
    <v-app-bar app>
      <v-app-bar-nav-icon />
      <v-toolbar-title>Project Name</v-toolbar-title>
      <v-spacer />
      <v-btn icon aria-label="Add New Column" title="Add New Column"
        @click="showAddColumnModal = true"><v-icon>mdi-plus</v-icon></v-btn>
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

const showAddColumnModal = ref(false);

function handleAddColumn(inputValues) {
  store.addColumn(inputValues.title.trim(), inputValues.color);
  showAddColumnModal.value = false;
}

function onColumnDragEnd(evt) {
  const movedColumnId = columns[evt.oldIndex].id;
  store.updateColumnPosition(movedColumnId, evt.newIndex);
}
</script>
