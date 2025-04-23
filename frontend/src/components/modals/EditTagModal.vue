<template>
  <GenericModal title="Edit Tag" :isOpen="isOpen" :initialValues="{ title, color }" :showDelete="true" @submit="submit"
    @delete="$emit('delete')" @close="$emit('close')">
    <template #inputs="{ inputValues }">
      <v-text-field v-model="inputValues.title" label="Tag Title" required />
      <v-color-picker v-model="inputValues.color" label="Tag Color" />
    </template>
  </GenericModal>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  title: String,
  color: String,
})
const emit = defineEmits(['submit', 'close', 'delete'])

function submit(values) {
  emit('submit', values)
}
</script>
