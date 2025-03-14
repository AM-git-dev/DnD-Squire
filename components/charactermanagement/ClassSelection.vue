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
        </div>
      </div>
    </div>
    
    <div v-if="selectedClass" class="class-details">
      <h3>{{ selectedClass.name }}</h3>
      <div class="class-description">
        <p class="blacktext">{{ selectedClass.description }}</p>
      </div>
      
      <h4>Caractéristiques principales</h4>
      <p class="blacktext">{{ selectedClass.primaryAbility.map(ability => statName(ability)).join(', ') }}</p>
      
      <h4>Points de vie</h4>
      <p class="blacktext"><strong>Dé de vie :</strong> {{ selectedClass.hitDie }}</p>
      <p class="blacktext"><strong>PV au niveau 1 :</strong> {{ selectedClass.hitDie }} + votre modificateur de Constitution</p>
      
      <h4>Compétences & maîtrises</h4>
      <p class="blacktext"><strong>Armures :</strong> {{ selectedClass.proficiencies.armor.join(', ') }}</p>
      <p class="blacktext"><strong>Armes :</strong> {{ selectedClass.proficiencies.weapons.join(', ') }}</p>
      <p class="blacktext"><strong>Outils :</strong> {{ selectedClass.proficiencies.tools.join(', ') || 'Aucun' }}</p>
      <p class="blacktext"><strong>Jets de sauvegarde :</strong> {{ selectedClass.proficiencies.savingThrows.map(save => statName(save)).join(', ') }}</p>
      
      <h4>Équipement de départ</h4>
      <ul>
        <li v-for="(item, index) in selectedClass.startingEquipment" :key="index">{{ item }}</li>
      </ul>
      
      <h4>Répartition des caractéristiques suggérée</h4>
      <div class="stat-distribution">
        <div 
          v-for="(value, stat) in selectedClass.suggestedStats" 
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
    </div>
    
    <div class="form-actions">
      <button class="btn btn-secondary" @click="previousStep">
        Retour
      </button>
      <button class="btn btn-primary" @click="nextStep" :disabled="!selectedClass">
        Continuer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClassSelection',
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
      localCharacter: { ...this.character }
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

.blacktext {
    color:black
  }
  
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
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.5);
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
}

.class-info h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.class-details {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
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

.btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;

 
}

/* Ajout de media queries pour le responsive */
@media (max-width: 767px) {
  .class-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .stat-distribution {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .class-details {
    padding: 1rem;
  }
  
  .class-details h4 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .class-grid {
    grid-template-columns: 1fr;
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
  
  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 375px) {
  .stat-distribution {
    grid-template-columns: 1fr;
  }
  
  .class-details {
    padding: 0.8rem;
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