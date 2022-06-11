<script setup lang="ts">
import Header from './components/Header.vue';
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <Header />

    <RouterView />
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-weight: 400;
  font-family: 'Source Sans 3';
}

.app {
  min-height: 100vh;
  position: relative;
}
</style>
