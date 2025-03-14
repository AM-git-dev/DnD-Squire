<template>
  <div class="race-selection">
    <h2>Choix de la race</h2>
    <p>Sélectionnez la race de votre personnage.</p>
    
    <div class="race-grid">
      <div 
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
          <div class="race-traits">
            <p v-for="(bonus, stat) in race.abilityScoreIncrease" :key="stat">
              {{ statName(stat) }}: +{{ bonus }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="selectedRace" class="race-details">
      <h3>{{ selectedRace.name }}</h3>
      <div class="race-description">
        <p>{{ selectedRace.description }}</p>
      </div>
      
      <h4>Bonus de caractéristiques</h4>
      <ul>
        <li v-for="(bonus, stat) in selectedRace.abilityScoreIncrease" :key="stat">
          {{ statName(stat) }} : +{{ bonus }}
        </li>
      </ul>
      
      <h4>Traits raciaux</h4>
      <ul>
        <li v-for="(trait, index) in selectedRace.traits" :key="index">
          <strong>{{ trait.name }}</strong>: {{ trait.description }}
        </li>
      </ul>
      
      <h4>Âge et taille</h4>
      <p class="ageheightlang"><strong>Âge moyen :</strong> {{ selectedRace.age }}</p>
      <p class="ageheightlang"><strong>Taille :</strong> {{ selectedRace.size }}</p>
      <p class="ageheightlang"><strong>Vitesse :</strong> {{ selectedRace.speed }} mètres</p>
      
      <h4>Langues</h4>
      <p class="ageheightlang">{{ selectedRace.languages.join(', ') }}</p>
    </div>
    
    <div class="form-actions">
      <button class="btn btn-secondary" @click="previousStep">
        Retour
      </button>
      <button class="btn btn-primary" @click="nextStep" :disabled="!selectedRace">
        Continuer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RaceSelection',
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
      localCharacter: { ...this.character }
    };
  },
  methods: {
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

p {
  font-weight: bold;
}
.race-selection {
  width: 100%;
}

.race-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.5);
}

.race-image {
  height: 120px;
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
  background-color: #3333333a;
  height: 100%;
}

.race-info h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.race-traits {
  font-size: 0.85rem;
  color: #666;
}

.race-details {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.race-details h4 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.race-description p  {
  color : rgb(0, 0, 0)
}

.ageheightlang {
  color: black
}
.form-actions {
  display: flex;
  justify-content: space-between;
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


.race-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
  margin-bottom: 1.5rem;
}

@media (max-width: 767px) {
  .race-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
</style>