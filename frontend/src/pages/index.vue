<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="6" class="text-center">
        <v-card>
          <v-card-title>
            <h1>TaskForge</h1>
          </v-card-title>
          <v-card-subtitle>
            <h3>Minimal Task Management Tool</h3>
          </v-card-subtitle>
          <v-card-text>
            <p>
              Welcome to TaskForge, your go-to tool for managing tasks efficiently and effortlessly.
            </p>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="primary" @click="handleGetStarted">
              Get Started
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const handleGetStarted = () => {
  alert('Get Started button clicked!');
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.text-center {
  text-align: center;
}
</style>
