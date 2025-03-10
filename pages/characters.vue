<template>
  <div>
    <h1>Gestion des personnages</h1>
    <Button variant="create" @click="addCharacter">Créer un personnage</Button>
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
import { ref, onMounted, computed } from 'vue';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import Sidebar from '@/components/Sidebar.vue';
import Button from '@/components/Button.vue';

const nuxtApp = useNuxtApp();
const db = computed(() => nuxtApp.$firebaseDb); // ✅ Vérifie que db est bien défini

const characters = ref([]);
const charactersCollection = computed(() => db.value ? collection(db.value, "characters") : null); // ✅ Attendre que db soit chargé

const fetchCharacters = async () => {
  if (!charactersCollection.value) return; // ✅ Empêcher une erreur si db est undefined
  const snapshot = await getDocs(charactersCollection.value);
  characters.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addCharacter = async () => {
  if (!charactersCollection.value) return;
  const name = prompt("Quel est le nom du personnage ?");
  if (name) {
    const newCharacter = { name, level: 1 };
    const docRef = await addDoc(charactersCollection.value, newCharacter);
    characters.value.push({ id: docRef.id, ...newCharacter });
  }
};

const deleteCharacter = async (id) => {
  if (!db.value) return;
  await deleteDoc(doc(db.value, "characters", id));
  characters.value = characters.value.filter(char => char.id !== id);
};

onMounted(fetchCharacters);
</script>



<style>

</style>