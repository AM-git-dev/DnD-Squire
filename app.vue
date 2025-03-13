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
import {useCharacterStore} from '@/stores/character';
const characterStore = useCharacterStore();
characterStore.loadCharacterFromStorage();


</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background: rgba(88, 81, 59, 0.651) url(/icons/testbackground.png);
  background-size: cover;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}



.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  /*background: url(/public/icons/background.png) no-repeat center center;*/
  background-size:100%;
  overflow-x: hidden;
}

@media screen and (min-width: 1024px){
.content{
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  height:100%
}
  
}
</style>
