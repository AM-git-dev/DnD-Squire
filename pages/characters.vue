<template>
  <div>
    <Navbar />
    <h1>Gestion des personnages</h1>
    <Button variant="create" @click="addCharacter">Créer un personnage</Button>
    <Button variant="delete" @click="deleteCharacter">Supprimer un personnage</Button>
    <p>Voici la liste de tes personnages de jeu de rôle :</p>

    <ul>
      <li v-for="character in characters">{{ character.name }} - Niveau {{ character.level }}</li>
    </ul>


  </div>
  <FooterComp />
</template>


<script setup>
import Navbar from '@/components/Navbar.vue';
import Button from '@/components/Button.vue';


const characters = ref ([
  { name: 'Hugo', level:1},
  { name: 'Maxime', level:1}
])

const addCharacter = () => {
  characters.value.push({name: prompt("Quel est le nom du personnage ?"), level:1})
}

const deleteCharacter = () => {
  characters.value.pop()
}
</script>

<style>

</style>