<template>
  <v-dialog :model-value="isOpen" @update:model-value="handleModalChange" max-width="600" scrim="rgba(0, 0, 0, 0.8)">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ title }}</span>
        <v-btn v-if="showDelete" icon color="red" title="Delete" @click="confirmDeleteDialog = true">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <slot name="inputs" :input-values="inputValues"></slot>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="handleSubmit">Save</v-btn>
        <v-btn @click="handleCancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Confirm Deletion</v-card-title>
      <v-card-text>Are you sure you want to delete this item? This action cannot be undone.</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="confirmDeleteDialog = false">Cancel</v-btn>
        <v-btn color="red" @click="handleDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  showDelete: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'submit', 'delete']);

const inputValues = ref({});
const confirmDeleteDialog = ref(false);


// Watch for when the modal opens to set the initial values
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      inputValues.value = { ...props.initialValues };
      confirmDeleteDialog.value = false;
    }
  }
);

function handleSubmit() {
  emit('submit', inputValues.value);
}

function handleCancel() {
  emit('close');
}

function handleDelete() {
  confirmDeleteDialog.value = false;
  emit('delete');
}

function handleModalChange(value) {
  emit('update:isOpen', value);
}
</script>
