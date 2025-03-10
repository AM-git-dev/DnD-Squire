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
  background: rgba(88, 81, 59, 0.651);
  /*background-image: url(/public/icons/IMG_3666.png);*/
  background-size: cover;
}


.content {
  flex: 1; 
  display: flex;
  flex-direction: column;
  background: url(/public/icons/background.png) no-repeat center center;
  background-size:100%;
  overflow-x: hidden; 
}

@media screen and (min-width: 1024px){
.content{
  background-size:35%;
}
  
}
</style>
