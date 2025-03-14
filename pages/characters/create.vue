<template>
  <div class="characters-create-page">
    <div class="container mx-auto py-8">
      <CharacterCreation />
    </div>
  </div>
</template>

<script>
import CharacterCreation from '@/components/charactermanagement/CharacterCreation.vue';

export default {
  name: 'CharactersCreatePage',
  components: {
    CharacterCreation
  },
  head() {
    return {
      title: 'Créer un personnage - D&D Companion'
    };
  }
};
</script>

<style scoped>
.characters-create-page {
  min-height: 100vh;
  background-color: #f8f9fa00;
}
</style>  