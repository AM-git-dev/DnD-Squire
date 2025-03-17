<template>
  <div class="class-selection">
    <h2>Choix de la classe</h2>
    <p>Sélectionnez la classe de votre personnage.</p>
    
    <div class="class-grid">
      <div v-if="classes && classes.length > 0" 
        v-for="characterClass in classes" 
        :key="characterClass.id" 
        :class="['class-card', { 'selected': selectedClass && selectedClass.id === characterClass.id }]"
        @click="selectClass(characterClass)"
      >
        <div class="class-image">
          <img :src="characterClass.image || '/images/classes/default.png'" :alt="characterClass.name">
        </div>
        <div class="class-info">
          <h3>{{ characterClass.name }}</h3>
          <p>{{ characterClass.shortDescription }}</p>
          <div class="details-btn-container">
            <Button variant="select" @click="handleDetailsClick($event, characterClass)">Voir les détails</Button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="class-modal-overlay" @click="closeModal">
      <div class="class-modal-content" @click.stop>
        <button class="modal-close-btn" @click="closeModal">&times;</button>

        <div v-if="modalClass" class="class-details">
          <h3>{{ modalClass.name }}</h3>
          <div class="class-description">
            <p>{{ modalClass.description }}</p>
          </div>
          
          <h4>Caractéristiques principales</h4>
          <p>{{ modalClass.primaryAbility.map(ability => statName(ability)).join(', ') }}</p>
          
          <h4>Points de vie</h4>
          <p><strong>Dé de vie :</strong> {{ modalClass.hitDie }}</p>
          <p><strong>PV au niveau 1 :</strong> {{ modalClass.hitDie }} + votre modificateur de Constitution</p>
          
          <h4>Compétences & maîtrises</h4>
          <p><strong>Armures :</strong> {{ modalClass.proficiencies.armor.join(', ') }}</p>
          <p><strong>Armes :</strong> {{ modalClass.proficiencies.weapons.join(', ') }}</p>
          <p><strong>Outils :</strong> {{ modalClass.proficiencies.tools.join(', ') || 'Aucun' }}</p>
          <p><strong>Jets de sauvegarde :</strong> {{ modalClass.proficiencies.savingThrows.map(save => statName(save)).join(', ') }}</p>
          
          <h4>Équipement de départ</h4>
          <ul>
            <li v-for="(item, index) in modalClass.startingEquipment" :key="index">{{ item }}</li>
          </ul>
          
          <h4>Répartition des caractéristiques suggérée</h4>
          <div class="stat-distribution">
            <div 
              v-for="(value, stat) in modalClass.suggestedStats" 
              :key="stat" 
              class="stat-item"
            >
              <div class="stat-name">{{ statName(stat) }}</div>
              <div class="stat-value">{{ value }}</div>
            </div>
          </div>
          
          <div class="form-check mt-4">
            <input 
              id="use-suggested-stats" 
              v-model="useSuggestedStats" 
              type="checkbox" 
              class="form-check-input"
            >
            <label for="use-suggested-stats" class="form-check-label">
              Utiliser cette répartition des caractéristiques
            </label>
          </div>

          <div class="modal-actions">
            <Button v-if="selectedClass && selectedClass.id === modalClass.id" 
                   variant="create" @click="continueToNextStep">
              Continuer avec cette classe
            </Button>
            <Button v-else variant="create" @click="selectClassAndContinue">
              Sélectionner et continuer
            </Button>
            <Button variant="default" @click="closeModal">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Boutons de navigation (visibles seulement quand on n'est pas dans la modal) -->
    <div class="form-actions" v-if="!showModal">
      <Button variant="default" @click="previousStep">
        Retour
      </Button>
      <Button variant="create" @click="nextStep" :disabled="!selectedClass">
        Continuer
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
export default {
  name: 'ClassSelection',
  components: {
    Button
  },
  props: {
    character: {
      type: Object,
      required: true
    },
    classes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedClass: this.character.class || null,
      useSuggestedStats: false,
      localCharacter: { ...this.character },
      showModal: false,
      modalClass: null
    };
  },
  watch: {
    useSuggestedStats(val) {
      if (val && this.selectedClass && this.selectedClass.suggestedStats) {
        const baseStats = { ...this.selectedClass.suggestedStats };
        const raceBonus = this.character.race ? this.character.race.abilityScoreIncrease || {} : {};
        
        for (const [stat, bonus] of Object.entries(raceBonus)) {
          if (baseStats[stat] !== undefined) {
            baseStats[stat] += bonus;
          }
        }
        
        this.localCharacter.stats = baseStats;
      } else {
        this.localCharacter.stats = { ...this.character.stats };
      }
    }
  },
  methods: {
    handleDetailsClick(event, characterClass) {
      if (event) {
        event.stopPropagation();
      }
      this.openClassDetails(characterClass);
    },
    openClassDetails(characterClass) {
      this.modalClass = characterClass;
      this.showModal = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.showModal = false;
      // Réactiver le scroll du body
      document.body.style.overflow = '';
    },
    selectClass(characterClass) {
      this.selectedClass = characterClass;
      this.localCharacter.class = characterClass;
      if (characterClass.hitDie) {
        const hitDieValue = parseInt(characterClass.hitDie.slice(1));
        const conModifier = Math.floor((this.localCharacter.stats.constitution - 10) / 2);
        this.localCharacter.maxHp = hitDieValue + conModifier;
        this.localCharacter.hp = this.localCharacter.maxHp;
      }
    },
    selectClassAndContinue() {
      if (this.modalClass) {
        this.selectClass(this.modalClass);
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
      if (this.selectedClass) {
        this.$emit('update:character', this.localCharacter);
        this.$emit('next-step');
      }
    }
  }
};
</script>

<style scoped>
.class-selection {
  width: 100%;
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.class-card {
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.class-card.selected {
  border-color: green;
  box-shadow: 0 0 0 2px rgba(0, 128, 0, 0.5);
}

.class-image {
  height: 140px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.class-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.class-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100% - 140px);
}

.class-info h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.class-info p {
  flex-grow: 1;
  margin-bottom: 0.5rem;
}

.details-btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
}

.class-modal-overlay {
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

.class-modal-content {
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

.class-details {
  background-color: white;
  border-radius: 8px;
}

.class-details h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: green;
  font-size: 1.5rem;
}

.class-details h4 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.stat-distribution {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  padding: 0.8rem;
  border-radius: 4px;
}

.stat-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
}

.stat-value {
  font-size: 1.2rem;
}

.form-check {
  margin-top: 1.5rem;
}

.form-check-input {
  margin-right: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

@media (max-width: 767px) {
  .class-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .stat-distribution {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .class-modal-content {
    max-width: none;
    width: 90%;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .class-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .stat-distribution {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  
  .stat-item {
    padding: 0.6rem;
  }
  
  .stat-name {
    font-size: 0.9rem;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .modal-actions {
    margin-top: 1.5rem;
  }
  
  .class-modal-content {
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
  }
  
  .class-modal-overlay {
    padding: 0;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 375px) {
  .stat-distribution {
    grid-template-columns: 1fr;
  }
  
  .class-details h3 {
    font-size: 1.3rem;
  }
  
  .class-details h4 {
    font-size: 1rem;
    margin-top: 1.2rem;
  }
  
  .class-details p, .class-details li {
    font-size: 0.9rem;
  }
  
  .class-image {
    height: 120px;
  }
}
</style>