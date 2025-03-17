<template>
  <div class="race-selection">
    <h2>Choix de la race</h2>
    <p>Sélectionnez la race de votre personnage.</p>
    
    <div class="race-grid">
      <div v-if="races && races.length > 0" 
        v-for="race in races" 
        :key="race.id" 
        :class="['race-card', { 'selected': selectedRace && selectedRace.id === race.id }]"
        @click="selectRace(race)"
      >
        <div class="race-image">
          <img :src="race.image || '/images/races/default.png'" :alt="race.name">
        </div>
        <div class="race-info">
          <h3>{{ race.name }}</h3>
          <p>{{ race.shortDescription }}</p>
          <div class="details-btn-container">
            <Button variant="select" @click="handleDetailsClick($event, race)">Voir les détails</Button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="race-modal-overlay" @click="closeModal">
      <div class="race-modal-content" @click.stop>
        <button class="modal-close-btn" @click="closeModal">&times;</button>

        <div v-if="modalRace" class="race-details">
          <h3>{{ modalRace.name }}</h3>
          <div class="race-description">
            <p>{{ modalRace.description }}</p>
          </div>
          
          <h4>Bonus de caractéristiques</h4>
          <div class="ability-bonuses">
            <div v-for="(bonus, stat) in modalRace.abilityScoreIncrease" :key="stat" class="ability-bonus">
              <span>{{ statName(stat) }}</span>
              <span>+{{ bonus }}</span>
            </div>
          </div>
          
          <h4>Âge</h4>
          <p>{{ modalRace.age }}</p>
          
          <h4>Taille</h4>
          <p>{{ modalRace.size }}</p>
          
          <h4>Vitesse</h4>
          <p>{{ modalRace.speed }} mètres par tour</p>
          
          <h4>Traits raciaux</h4>
          <div class="traits-list" v-if="modalRace.traits && modalRace.traits.length > 0">
            <div class="trait-item" v-for="(trait, index) in modalRace.traits" :key="index">
              <div class="trait-name">{{ trait.name }}</div>
              <div class="trait-description">{{ trait.description }}</div>
            </div>
          </div>
          <div v-else class="no-data">Aucun trait racial disponible</div>
          
          <h4>Langues</h4>
          <p>{{ modalRace.languages?.join(', ') || 'Aucune langue supplémentaire' }}</p>

          <div class="modal-actions">
            <Button v-if="selectedRace && selectedRace.id === modalRace.id" 
                   variant="create" @click="continueToNextStep">
              Continuer avec cette race
            </Button>
            <Button v-else variant="create" @click="selectRaceAndContinue">
              Sélectionner et continuer
            </Button>
            <Button variant="default" @click="closeModal">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="form-actions" v-if="!showModal">
      <Button variant="default" @click="previousStep">
        Retour
      </Button>
      <Button variant="create" @click="nextStep" :disabled="!selectedRace">
        Continuer
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  name: 'RaceSelection',
  components: {
    Button
  },
  props: {
    character: {
      type: Object,
      required: true
    },
    races: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedRace: this.character.race || null,
      localCharacter: { ...this.character },
      showModal: false,
      modalRace: null
    };
  },
  methods: {
    handleDetailsClick(event, race) {
      if (event) {
        event.stopPropagation();
      }
      this.openRaceDetails(race);
    },
    openRaceDetails(race) {
      this.modalRace = race;
      this.showModal = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.showModal = false;
      document.body.style.overflow = '';
    },
    selectRace(race) {
      this.selectedRace = race;
      this.localCharacter.race = race;
      if (race.abilityScoreIncrease) {
        const updatedStats = { ...this.localCharacter.stats };
        
        for (const [stat, bonus] of Object.entries(race.abilityScoreIncrease)) {
          if (updatedStats[stat] !== undefined) {
            updatedStats[stat] += bonus;
          }
        }
        
        this.localCharacter.stats = updatedStats;
      }
    },
    selectRaceAndContinue() {
      if (this.modalRace) {
        this.selectRace(this.modalRace);
        this.closeModal();
        this.nextStep();
      }
    },
    continueToNextStep() {
      this.closeModal();
      this.nextStep();
    },
    statName(stat) {
      const statNames = {
        strength: 'Force',
        dexterity: 'Dextérité',
        constitution: 'Constitution',
        intelligence: 'Intelligence',
        wisdom: 'Sagesse',
        charisma: 'Charisme'
      };
      return statNames[stat] || stat;
    },
    previousStep() {
      this.$emit('previous-step');
    },
    nextStep() {
      if (this.selectedRace) {
        this.$emit('update:character', this.localCharacter);
        this.$emit('next-step');
      }
    }
  }
};
</script>

<style scoped>
.race-selection {
  width: 100%;
}

.race-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.race-card {
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.race-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.race-card.selected {
  border-color: green;
  box-shadow: 0 0 0 2px rgba(0, 128, 0, 0.5);
}

.race-image {
  height: 140px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.race-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.race-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100% - 140px);
}

.race-info h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.race-info p {
  flex-grow: 1;
  margin-bottom: 0.5rem;
}

.details-btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
}

/* Styles pour la modal */
.race-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.race-modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.modal-actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.race-details {
  background-color: white;
  border-radius: 8px;
}

.race-details h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: green;
  font-size: 1.5rem;
}

.race-details h4 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.ability-bonuses {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

.ability-bonus {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  padding: 0.8rem;
  border-radius: 4px;
}

.ability-bonus span:first-child {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.ability-bonus span:last-child {
  font-size: 1.2rem;
  color: green;
}

.traits-list {
  display: grid;
  gap: 1rem;
}

.trait-item {
  padding: 0.8rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.trait-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.trait-description {
  color: #555;
  font-size: 0.95rem;
}

.no-data {
  color: #888;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

/* Media queries pour le responsive */
@media (max-width: 767px) {
  .race-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .ability-bonuses {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .race-modal-content {
    max-width: none;
    width: 90%;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .race-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .ability-bonuses {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  
  .ability-bonus {
    padding: 0.6rem;
  }
  
  .ability-bonus span:first-child {
    font-size: 0.9rem;
  }
  
  .ability-bonus span:last-child {
    font-size: 1.1rem;
  }
  
  .modal-actions {
    margin-top: 1.5rem;
  }
  
  .race-modal-content {
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
  }
  
  .race-modal-overlay {
    padding: 0;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 375px) {
  .ability-bonuses {
    grid-template-columns: 1fr;
  }
  
  .race-details h3 {
    font-size: 1.3rem;
  }
  
  .race-details h4 {
    font-size: 1rem;
    margin-top: 1.2rem;
  }
  
  .race-details p, .race-details li {
    font-size: 0.9rem;
  }
  
  .race-image {
    height: 120px;
  }
}
</style>