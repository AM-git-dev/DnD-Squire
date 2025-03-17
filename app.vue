<template>
  <div class="app-container">
    <Sidebar />
    <div class="content-container">
      <div class="main-content">
        <NuxtPage />
      </div>
      <FooterComp />
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import FooterComp from "@/components/FooterComp.vue";
import {useCharacterStore} from '@/stores/character';
const characterStore = useCharacterStore();
characterStore.loadCharacterFromStorage();
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; 
}

.app-container {
  display: flex;
  height: 100vh; 
  background: rgb(120 118 104 / 92%);
}

.content-container {
  flex: 1;
  width: 100%;
  transition: margin-left 0.3s ease;
  padding-bottom: 40px;
  overflow-y: auto; 
}

.main-content {
  padding: 20px;
  height: calc(100vh - 60px); 
  overflow-y: auto; 
}

</style>