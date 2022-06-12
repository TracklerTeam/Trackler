<script setup lang="ts">
import Header from './components/Header.vue';
import BurgerMenu from './components/BurgerMenu.vue';
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/userStore';
</script>

<template>
  <div class="app">
    <Header />
    <BurgerMenu v-if="useUserStore().isAuth"/>

    <RouterView class="content" />
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

.content {
  position: absolute;
  top: 80px;
  left: 240px;
}
</style>
