<template>
  <v-navigation-drawer :model-value="drawer" @update:model-value="$emit('update:drawer', $event)" :width="350" app>
    <v-list>
      <v-list-item>
        <v-list-item-title class="text-h6"></v-list-item-title>
      </v-list-item>

      <v-divider class="my-2" />
      <v-list-item class="ma-2 pa-4" @click="goToDashboard" icon="mdi-arrow-left">
        <template #prepend>
          <v-icon class="text-h4">mdi-arrow-left</v-icon>
        </template>
        <v-list-item-title class="text-h6">Dashboard</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2" />
      <v-list-item class="ma-2 pa-4" @click="() => $emit('open-add-column')" icon="mdi-plus">
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
            <v-col cols="auto">
              <v-checkbox v-model="tag.value" hide-details density="compact" :style="{ color: tag.color }" />
            </v-col>
            <v-col class="text-white">{{ tag.title }}</v-col>
            <v-col cols="auto">
              <v-menu>
                <template #activator="{ props }">
                  <v-btn icon v-bind="props">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="() => $emit('edit-tag', tag)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
        <v-list-item class="my-2 pa-4" @click="$emit('open-add-tag')" icon="mdi-plus">
          <template #prepend>
            <v-icon class="text-h4">mdi-plus</v-icon>
          </template>
          <v-list-item-title class="text-h6">Add Tag</v-list-item-title>
        </v-list-item>
      </v-card>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps(['drawer', 'tags']);
defineEmits(['update:drawer', 'open-add-column', 'open-add-tag', 'edit-tag']);


const router = useRouter();
function goToDashboard() {
  router.push('/dashboard');
}
</script>
