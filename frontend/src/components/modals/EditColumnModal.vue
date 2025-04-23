<template>
  <GenericModal title="Edit Column" :isOpen="isOpen" :initialValues="{ title: columnTitle, color: columnColor }"
    :showDelete="true" @submit="handleSubmit" @delete="handleDelete" @close="handleClose">
    <template #inputs="{ inputValues }">
      <v-text-field v-model="inputValues.title" label="Column Title" required />
      <v-color-picker v-model="inputValues.color" label="Column Color" />
    </template>
  </GenericModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useBoardStore } from '@/stores/board';
import GenericModal from '@/components/GenericModal.vue';

const props = defineProps({
  isOpen: Boolean,
  columnTitle: String,
  columnColor: String,
});

const emit = defineEmits(['submit', 'close', 'delete']);

const isOpen = ref(props.isOpen);

// Watch the `isOpen` prop to update the local state when it changes
watch(() => props.isOpen, (newValue) => {
  isOpen.value = newValue;
});

const handleSubmit = (inputValues) => {
  emit('submit', {
    title: inputValues.title.trim(),
    color: inputValues.color,
  });
};

const handleDelete = () => {
  emit('delete');
};

const handleClose = () => {
  emit('close');
};
</script>
