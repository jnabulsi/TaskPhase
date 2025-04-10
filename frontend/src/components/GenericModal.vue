<template>
  <v-dialog :model-value="isOpen" @update:model-value="handleModalChange" max-width="600" scrim="rgba(0, 0, 0, 0.8)">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot name="inputs" :input-values="inputValues"></slot>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="handleSubmit">Save</v-btn>
        <v-btn @click="handleCancel">Cancel</v-btn>
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
    default: () => ({}), // Default to an empty object
  },
});

const emit = defineEmits(['close', 'submit']);
const inputValues = ref({});

// Watch for when the modal opens to set the initial values
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      inputValues.value = { ...props.initialValues }; // Set input values when modal opens
    }
  }
);

function handleSubmit() {
  emit('submit', inputValues.value); // Emit input values when submitted
}

function handleCancel() {
  emit('close'); // Emit close event when canceled
}

// Emit the change to the parent when the modal is closed
function handleModalChange(value) {
  emit('update:isOpen', value); // Emit the updated state of the modal
}
</script>
