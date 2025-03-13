<template>
  <div
      class="sidebar"
      :class="{ expanded: isExpanded }"
      @mousedown="startDrag"
      @touchstart="startDrag"
  >
    <div
        v-if="isExpanded"
        class="profile-container"
        @click="triggerFileInput"
    >
      <img
          :src="characterStore.selectedCharacter?.avatar || '/icons/default-avatar.png'"
          alt="Avatar"
          width="100px"
      />
      <input type="file" ref="fileInput" @change="uploadAvatar" accept="image/*" hidden />
    </div>

    <div class="spacer"></div>

    <div class="menu">
      <NuxtLink to="/">
        <img src="/icons/home.png" alt="Accueil"/>
        <span v-if="isExpanded">Accueil</span>
      </NuxtLink>
      <NuxtLink to="/characters">
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
      <NuxtLink to="/fight">
        <img src="/icons/notes.png" alt="Fight"/>
        <span v-if="isExpanded">Combat</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useNuxtApp} from '#app';
import {useCharacterStore} from '@/stores/character';

const nuxtApp = useNuxtApp();
const fileInput = ref(null);
const characterStore = useCharacterStore();
const isExpanded = ref(false);
let startX = 0;
let isDragging = false;

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const uploadAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file || !characterStore.selectedCharacter) return;

  try {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      const base64Image = e.target.result;
      const updatedCharacter = {
        ...characterStore.selectedCharacter,
        avatar: base64Image
      };

      characterStore.setCharacter(updatedCharacter);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`avatar_${characterStore.selectedCharacter.id}`, base64Image);
          console.log("Avatar sauvegardé dans localStorage avec succès");
        } catch (storageError) {
          console.warn("Avatar trop volumineux pour localStorage, seule la session courante le conservera");
        }
      }
    };
  } catch (error) {
    console.error("Erreur lors de l'upload de l'avatar:", error);
    alert("Une erreur est survenue lors de l'upload de l'avatar.");
  }
};

const loadLocalAvatars = () => {
  if (typeof window !== 'undefined' && characterStore.selectedCharacter?.id) {
    const savedAvatar = localStorage.getItem(`avatar_${characterStore.selectedCharacter.id}`);
    if (savedAvatar && characterStore.selectedCharacter) {
      if (!characterStore.selectedCharacter.avatar ||
          characterStore.selectedCharacter.avatar.startsWith('/icons/')) {
        const updatedCharacter = {
          ...characterStore.selectedCharacter,
          avatar: savedAvatar
        };
        characterStore.setCharacter(updatedCharacter);
      }
    }
  }
};

const startDrag = (event) => {
  startX = event.touches ? event.touches[0].clientX : event.clientX;
  isDragging = true;
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", drag, {passive: false});
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
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", stopDrag);
};

onMounted(() => {
  loadLocalAvatars();
});
</script>

<style scoped>
.sidebar {
  position: relative;
  left: 0;
  top: 0;
  height: 100vh;
  width: 60px;
  background: rgba(18, 18, 18, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  transition: width 0.3s ease;
  overflow: hidden;
  user-select: none;
  justify-content: space-between;
  -webkit-tap-highlight-color: transparent;
}

.spacer {
  flex: 1;
}

.profile-container {
  width: 100%;
  height: 150px;
  background: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  cursor: pointer;
}

.sidebar.expanded {
  width: 200px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
  margin-left: 10px;
  width: 100%;
  padding-bottom: 70px;
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