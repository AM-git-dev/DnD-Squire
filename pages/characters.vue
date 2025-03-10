<template>
  <div>
    <h1>Gestion des personnages</h1>
    <Button variant="create" @click="addCharacter">Créer un personnage </Button>
    <p>Voici la liste de tes personnages de jeu de rôle :</p>
    <ul>
      <li v-for="character in characters" :key="character.id">{{ character.name }} - Niveau {{ character.level }} 
        <Button variant="delete" @click="deleteCharacter(character.id)">Supprimer</Button>
      </li>
     
    </ul>


  </div>
  <FooterComp />
</template>



<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import Sidebar from '@/components/Sidebar.vue';
import Button from '@/components/Button.vue';
import { useNuxtApp } from '#app';

const nuxtApp = useNuxtApp();
const db = computed(() => nuxtApp.$firebaseDb); 

const characters = ref([]);
const charactersCollection = computed(() => db.value ? collection(db.value, "characters") : null);

let unsubscribeListener = null;

//Écoute en temps réel avec `onSnapshot()`
const listenToCharacters = () => {
  if (!charactersCollection.value) return;

  unsubscribeListener = onSnapshot(charactersCollection.value, (snapshot) => {
    characters.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
};

const addCharacter = async () => {
  if (!charactersCollection.value) return;
  const name = prompt("Quel est le nom du personnage ?");
  if (name) {
    const newCharacter = { name, level: 1 };
    await addDoc(charactersCollection.value, newCharacter);
  }
};

const deleteCharacter = async (id) => {
  if (!db.value) return;
  await deleteDoc(doc(db.value, "characters", id));
};

onMounted(() => {
  listenToCharacters();
});

onUnmounted(() => {
  if (unsubscribeListener) {
    unsubscribeListener(); // Arrête l'écoute pour éviter les fuites mémoire
  }
});
</script>




<style>

</style>