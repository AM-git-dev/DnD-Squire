<template>
  <div 
    class="sidebar" 
    :class="{ expanded: isExpanded }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >

     <div v-if="isExpanded" class="profile-container">
      <img v-if="selectedCharacter" :src="selectedCharacter.avatar" alt="Avatar" width='100px' />
    </div>

    <div class="spacer"></div>

    <div class="menu">
      <NuxtLink to="/">
        <img src="/icons/home.png" alt="Accueil"/>
        <span v-if="isExpanded">Accueil</span>
      </NuxtLink>
      <NuxtLink to="characters">
        <img src="/icons/character.png" alt="Personnages"/>
        <span v-if="isExpanded">Personnages</span>
      </NuxtLink>
      <NuxtLink to="/stats">
        <img src="/icons/stats.png" alt="Statistiques"/>
        <span v-if="isExpanded">Stats</span>
      </NuxtLink>
      <NuxtLink to="/inventory">
        <img src="/icons/inventory.png" alt="Inventaire"/>
        <span v-if="isExpanded">Inventaire</span>
      </NuxtLink>
      <NuxtLink to="/tracker">
        <img src="/icons/tracker.png" alt="Tracker"/>
        <span v-if="isExpanded">Tracker</span>
      </NuxtLink>
     
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isExpanded = ref(false);
let startX = 0;
let isDragging = false;

const startDrag = (event) => {
  startX = event.touches ? event.touches[0].clientX : event.clientX;
  isDragging = true;
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("touchend", stopDrag);
};

const drag = (event) => {
  if (!isDragging) return;

  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const diff = clientX - startX;

  if (diff > 50) { 
    isExpanded.value = true;
  } else if (diff < -50) { 
    isExpanded.value = false;
  }

  console.log("Drag détecté, isExpanded =", isExpanded.value);
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", stopDrag);
};

const selectedCharacter = ref({
  avatar: "/icons/default-avatar.png",
});

</script>

<style scoped>
.sidebar {
  position: relative;
  left: 0;
  top: 0;
  height: 100vh;
  width: 60px; 
  background: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  transition: width 0.3s ease;
  overflow: hidden;
  user-select: none;
  justify-content: space-between;
  -webkit-tap-highlight-color: transparent; /* permet de ne pas avoir de surbrillance au clique sur les objet de la sidebar en mobile*/
}

.spacer {
  flex:1;
}
.profile-container {
  width: 100%;
  height: 150px; 
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
}
.sidebar.expanded {
  width: 200px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: left;
  margin-left: 10px;
  width: 100%;
  margin-bottom: 40px; 
  padding-bottom: 40px
  
}

.menu a {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  padding: 10px;
  transition: all 0.3s ease;
  
}

.menu img {
  width: 30px;
  height: 30px;
}

.menu span {
  white-space: nowrap;
}
</style>
