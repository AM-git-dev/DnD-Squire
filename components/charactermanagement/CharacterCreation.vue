<template>
  <div class="character-creation">
    <h1>Création de personnage</h1>
    
    <div class="progress-tracker-container">
      <div class="progress-tracker">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          :class="['step', { 
            'active': currentStep === index, 
            'completed': currentStep > index,
            'disabled': !canAccessStep(index)
          }]"
          @click="goToStep(index)"
        >
          {{ step.label }}
          <div class="progress-indicator">
            <div 
              class="progress-fill" 
              :style="getProgressStyle(index)"
            ></div>
          </div>
        </div>
      </div>
      <!-- Barre de progression globale -->
      <div class="global-progress">
        <div 
          class="global-progress-fill" 
          :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"
        ></div>
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
      completedSteps: [true, false, false, false, false], 
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
    canAccessStep(step) {
      return step <= this.currentStep || this.completedSteps[step];
    },
    goToStep(step) {
      if (this.canAccessStep(step)) {
        this.currentStep = step;
      }
    },
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.completedSteps[this.currentStep] = true;
        this.completedSteps[this.currentStep + 1] = true;
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    getProgressStyle(index) {
      if (this.currentStep > index) {
        return { width: '100%' };
      } else if (this.currentStep === index) {
        return { width: '100%' };
      } else {
        return { width: '0%' };
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

.progress-tracker-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; 
  background-color: #f5f5f5;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom: 2px solid #e0e0e0;
  scrollbar-width: thin; 
  scrollbar-color: rgba(36, 223, 42, 0.3) rgba(0, 0, 0, 0.1);
}

.progress-tracker-container::-webkit-scrollbar {
  height: 6px;
}

.progress-tracker-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.progress-tracker-container::-webkit-scrollbar-thumb {
  background-color: rgba(36, 223, 42, 0.3);
  border-radius: 6px;
}

.progress-tracker {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding: 0.8rem 0.5rem 0.3rem;
  min-width: max-content; 
  position: relative;
}

.step {
  cursor: pointer;
  position: relative;
  text-align: center;
  white-space: nowrap;
  font-size: 0.9rem;
  color: black;
  font-weight: bold;
  margin: 0 1rem 1rem;
  min-width: 90px;
  transition: color 0.3s ease;
}

.step.active {
  font-weight: bold;
  color: #24df2a;
}

.step.completed {
  color: #666; 
}

.step.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #999;
}

.progress-indicator {
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #ddd; 
  border-radius: 3px;
  overflow: hidden;
}

.step.active .progress-indicator {
  background-color: #24df2a; 
}

.step.completed .progress-indicator {
  background-color: #666;
}

.step.disabled .progress-indicator {
  background-color: #ccc; 
}

.progress-fill {
  display: none; 
}

.global-progress {
  height: 4px;
  background-color: #ddd;
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-bottom: 2px;
}

.global-progress-fill {
  position: absolute;
  height: 100%;
  width: 0%;
  background-color: #24df2a;
  transition: width 0.5s ease;
  border-radius: 0 2px 2px 0;
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
  background-color: #f5f5f5;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
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
  
  .progress-tracker {
    padding: 0.5rem 0.3rem 0.3rem;
  }
  
  .step {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
    margin: 0 0.3rem 1rem;
    min-width: 70px;
  }
}
</style>