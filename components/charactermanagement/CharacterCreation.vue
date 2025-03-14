<template>
  <div class="character-creation">
    <h1>Création de personnage</h1>
    
    <div class="progress-tracker">
      <div 
        v-for="(step, index) in steps" 
        :key="index" 
        :class="['step', { 'active': currentStep === index, 'completed': currentStep > index }]"
        @click="goToStep(index)"
      >
        {{ step.label }}
      </div>
    </div>

    <div class="creation-container">

      <!-- Étape 1: Informations de base -->
      <div v-if="currentStep === 0" class="step-container">
        <BasicInfoForm
          :character="character"
          @update:character="updateCharacter"
          @next-step="nextStep"
        />
      </div>

      <!-- Étape 2: Choix de la race -->
      <div v-if="currentStep === 1" class="step-container">
        <RaceSelection
          :character="character"
          :races="races"
          @update:character="updateCharacter"
          @next-step="nextStep"
          @previous-step="previousStep"
        />
      </div>

      <!-- Étape 3: Choix de la classe -->
      <div v-if="currentStep === 2" class="step-container">
        <ClassSelection
          :character="character"
          :classes="classes"
          @update:character="updateCharacter"
          @next-step="nextStep"
          @previous-step="previousStep"
        />
      </div>

      <!-- Étape 4: Attributs et statistiques -->
      <div v-if="currentStep === 3" class="step-container">
        <StatsAllocation
          :character="character"
          @update:character="updateCharacter"
          @next-step="nextStep"
          @previous-step="previousStep"
        />
      </div>

      <!-- Étape 5: Résumé et finalisation -->
      <div v-if="currentStep === 4" class="step-container">
        <CharacterSummary
          :character="character"
          @save-character="saveCharacter"
          @previous-step="previousStep"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/plugins/firebase.client';

import BasicInfoForm from './BasicInfoForm.vue';
import RaceSelection from './RaceSelection.vue';
import ClassSelection from './ClassSelection.vue';
import StatsAllocation from './StatsAllocation.vue';
import CharacterSummary from './CharacterSummary.vue';

export default {
  name: 'CharacterCreation',
  components: {
    BasicInfoForm,
    RaceSelection,
    ClassSelection,
    StatsAllocation,
    CharacterSummary
  },
  data() {
    return {
      currentStep: 0,
      steps: [
        { label: 'Informations' },
        { label: 'Race' },
        { label: 'Classe' },
        { label: 'Statistiques' },
        { label: 'Résumé' }
      ],
      character: {
        name: '',
        level: 1,
        race: null,
        class: null,
        stats: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10
        },
        hp: 0,
        maxHp: 0,
        background: '',
        alignment: '',
        experience: 0,
        proficiencyBonus: 2,
        skills: {},
        equipment: [],
        spells: [],
        features: []
      },
      races: [],
      classes: []
    };
  },
  async mounted() {
    await this.fetchRaces();
    await this.fetchClasses();
  },
  methods: {
    updateCharacter(updatedCharacter) {
      this.character = { ...this.character, ...updatedCharacter };
    },
    goToStep(step) {
      if (step <= this.currentStep + 1 && step >= 0 && step < this.steps.length) {
        this.currentStep = step;
      }
    },
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    async fetchRaces() {
      try {
        const racesSnapshot = await getDocs(collection(db, 'races'));
        this.races = racesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Erreur lors de la récupération des races :', error);
      }
    },
    async fetchClasses() {
      try {
        const classesSnapshot = await getDocs(collection(db, 'classes'));
        this.classes = classesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Erreur lors de la récupération des classes :', error);
      }
    },
    async saveCharacter() {
      try {
        if (this.character.id) {
          const characterRef = doc(db, 'characters', this.character.id);
          await updateDoc(characterRef, this.character);
          this.$router.push('/characters');
        } else {
          await addDoc(collection(db, 'characters'), this.character);
          this.$router.push('/characters');
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du personnage :', error);
      }
    }
  }
};
</script>

<style scoped>
.character-creation {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.progress-tracker {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  flex-wrap: wrap; 
  overflow-x: auto; 
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
  background-color: #7777779a;
  border-top-left-radius: 15px;
  border-top-right-radius:15px;
}

.step {
  padding: 0.5rem 1rem;
  cursor: pointer;
  position: relative;
  flex: 0 0 auto; 
  text-align: center;
  white-space: nowrap; 
  font-size: 0.9rem; 
  color: white;
  font-weight: bold;
}

.step.active {
  font-weight: bold;
  color: #00ff08;
}

.step.completed {
  color: #dddada;
}

.step.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #00ff08;
}


.step-container {
  min-height: 400px;
  width: 100%;
  overflow-x: hidden; 
}

.character-creation {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  overflow: hidden; 
}

.creation-container {
  background-color: #f5f5f57e;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: hidden; 
}



@media (max-width: 767px) {
  .character-creation {
    padding: 0.5rem;
  }
  
  .creation-container {
    padding: 0.5rem;
  }
}

@media (max-width: 767px) {
  .progress-tracker {
    padding-bottom: 5px; 
  }
  
  .step {
    padding: 0.4rem 0.6rem; 
    font-size: 0.8rem; 
  }
}
</style>