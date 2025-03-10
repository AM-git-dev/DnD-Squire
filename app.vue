<template>
  <div class="app-container">
    <Sidebar />
    <div class="content">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.content {
  flex: 1; 
  padding: 20px; 
  overflow-x: hidden; 
}
</style>
