<template>
  <v-card class="ma-2 pa-4">
    <v-card-title class="text-subtitle-1">
      {{ task.title }}
    </v-card-title>
  </v-card>
</template>
<script setup>

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>
