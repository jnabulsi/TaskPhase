<template>
  <GenericModal title="Add New Column" :isOpen="isOpen" :initialValues="initialValues" @submit="submit"
    @close="$emit('close')">
    <template #inputs="{ inputValues }">
      <v-text-field v-model="inputValues.title" label="Column Title" required />
      <v-color-picker v-model="inputValues.color" label="Column Color" />
    </template>
  </GenericModal>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['submit', 'close'])

const initialValues = {
  title: '',
  color: '#000000',
}

function submit(values) {
  emit('submit', values)
}
</script>
