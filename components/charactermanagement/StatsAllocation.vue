<template>
  <div class="stats-allocation">
    <h2>Caractéristiques</h2>
    <p>Personnalisez les caractéristiques de votre personnage.</p>
    
    <div class="stats-methods">
      <div class="method-selector">
        <h3>Méthode d'attribution</h3>
        <div class="method-options">
          <label class="method-option">
            <input type="radio" v-model="selectedMethod" value="standard">
            <span>Standard (15, 14, 13, 12, 10, 8)</span>
          </label>
          <label class="method-option">
            <input type="radio" v-model="selectedMethod" value="pointBuy">
            <span>Achat de points (27 points)</span>
          </label>
          <label class="method-option">
            <input type="radio" v-model="selectedMethod" value="roll">
            <span>Lancer de dés (4d6, garder les 3 meilleurs)</span>
          </label>
          <label class="method-option">
            <input type="radio" v-model="selectedMethod" value="manual">
            <span>Manuel</span>
          </label>
        </div>
        
        <div v-if="selectedMethod === 'roll'" class="roll-actions">
          <button class="btn btn-sm" @click="rollStats">Lancer les dés</button>
          <p v-if="rollResults.length > 0" class="roll-results">
            Résultats: {{ rollResults.join(', ') }}
          </p>
        </div>
        
        <div v-if="selectedMethod === 'pointBuy'" class="point-buy-info">
          <p>Points restants: {{ pointBuyRemaining }}</p>
        </div>
      </div>
    </div>
    
    <div class="stats-grid">
      <div 
        v-for="(value, stat) in localStats" 
        :key="stat" 
        class="stat-card"
      >
        <div class="stat-header">{{ statName(stat) }}</div>
        <div class="stat-value">{{ value }}</div>
        <div class="stat-modifier">({{ calculateModifier(value) }})</div>
        
        <div class="stat-controls" v-if="selectedMethod === 'manual' || selectedMethod === 'pointBuy'">
          <button 
            class="btn btn-sm" 
            @click="decreaseStat(stat)" 
            :disabled="cannotDecrease(stat, value)"
          >-</button>
          <button 
            class="btn btn-sm" 
            @click="increaseStat(stat)" 
            :disabled="cannotIncrease(stat, value)"
          >+</button>
        </div>
        
        <div class="stat-details">
          <div class="stat-base">
            Base: {{ getBaseStat(stat) }}
          </div>
          <div class="stat-race-bonus" v-if="getRaceBonus(stat)">
            Racial: +{{ getRaceBonus(stat) }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="stats-summary">
      <h3>Récapitulatif des caractéristiques</h3>
      <div class="derived-stats">
        <div class="derived-stat">
          <span>Initiative</span>
          <span>{{ calculateModifier(localStats.dexterity) }}</span>
        </div>
        <div class="derived-stat">
          <span>CA (sans armure)</span>
          <span>{{ 10 + calculateModifier(localStats.dexterity) }}</span>
        </div>
        <div class="derived-stat">
          <span>Points de vie</span>
          <span>{{ calculateHP() }}</span>
        </div>
      </div>
    </div>
    
    <div class="form-actions">
      <button class="btn btn-secondary" @click="previousStep">
        Retour
      </button>
      <button class="btn btn-primary" @click="nextStep">
        Continuer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsAllocation',
  props: {
    character: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedMethod: 'standard',
      localStats: { ...this.character.stats },
      baseStats: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      standardArray: [15, 14, 13, 12, 10, 8],
      standardArrayAssigned: {},
      pointBuyValues: {
        8: 0,
        9: 1,
        10: 2,
        11: 3,
        12: 4,
        13: 5,
        14: 7,
        15: 9
      },
      pointBuyTotal: 27,
      rollResults: [],
      localCharacter: { ...this.character }
    };
  },
  computed: {
    pointBuyRemaining() {
      let used = 0;
      for (const stat in this.localStats) {
        const baseValue = this.getBaseStat(stat);
        used += this.getPointBuyCost(baseValue);
      }
      return this.pointBuyTotal - used;
    }
  },
  mounted() {
    this.initializeStats();
  },
  methods: {
    initializeStats() {
      if (this.selectedMethod === 'standard') {
        this.applyStandardArray();
      }
    },
    applyStandardArray() {
      this.standardArrayAssigned = {};
      
      if (this.character.class && this.character.class.primaryAbilities) {
      
        const sortedStats = Object.keys(this.baseStats).sort((a, b) => {
          const isPrimaryA = this.character.class.primaryAbilities.includes(a);
          const isPrimaryB = this.character.class.primaryAbilities.includes(b);
          if (isPrimaryA && !isPrimaryB) return -1;
          if (!isPrimaryA && isPrimaryB) return 1;
          return 0;
        });
        
        let arrayIndex = 0;
        for (const stat of sortedStats) {
          if (arrayIndex < this.standardArray.length) {
            this.baseStats[stat] = this.standardArray[arrayIndex];
            this.standardArrayAssigned[stat] = true;
            arrayIndex++;
          }
        }
      } else {
        const stats = Object.keys(this.baseStats);
        for (let i = 0; i < Math.min(stats.length, this.standardArray.length); i++) {
          this.baseStats[stats[i]] = this.standardArray[i];
          this.standardArrayAssigned[stats[i]] = true;
        }
      }
      
      this.updateFinalStats();
    },
    rollStats() {
      this.rollResults = [];
      const stats = Object.keys(this.baseStats);
      
      for (let i = 0; i < 6; i++) {
        const rolls = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
        ];
        rolls.sort((a, b) => b - a);
        const sum = rolls[0] + rolls[1] + rolls[2];
        this.rollResults.push(sum);
      }
      
      this.rollResults.sort((a, b) => b - a);

      if (this.character.class && this.character.class.primaryAbilities) {
        const sortedStats = Object.keys(this.baseStats).sort((a, b) => {
          const isPrimaryA = this.character.class.primaryAbilities.includes(a);
          const isPrimaryB = this.character.class.primaryAbilities.includes(b);
          if (isPrimaryA && !isPrimaryB) return -1;
          if (!isPrimaryA && isPrimaryB) return 1;
          return 0;
        });
        
        for (let i = 0; i < Math.min(sortedStats.length, this.rollResults.length); i++) {
          this.baseStats[sortedStats[i]] = this.rollResults[i];
        }
      } else {
        for (let i = 0; i < Math.min(stats.length, this.rollResults.length); i++) {
          this.baseStats[stats[i]] = this.rollResults[i];
        }
      }
      
      this.updateFinalStats();
    },
    getPointBuyCost(value) {
      return this.pointBuyValues[value] || 0;
    },
    increaseStat(stat) {
      const currentBase = this.getBaseStat(stat);
      if (this.selectedMethod === 'pointBuy') {
        if (currentBase < 15 && this.pointBuyRemaining >= (this.pointBuyValues[currentBase + 1] - this.pointBuyValues[currentBase])) {
          this.baseStats[stat] = currentBase + 1;
        }
      } else {
        if (currentBase < 18) {
          this.baseStats[stat] = currentBase + 1;
        }
      }
      this.updateFinalStats();
    },
    decreaseStat(stat) {
      const currentBase = this.getBaseStat(stat);
      if (this.selectedMethod === 'pointBuy') {
        if (currentBase > 8) {
          this.baseStats[stat] = currentBase - 1;
        }
      } else {
        if (currentBase > 3) {
          this.baseStats[stat] = currentBase - 1;
        }
      }
      this.updateFinalStats();
    },
    cannotIncrease(stat, value) {
      const baseValue = this.getBaseStat(stat);
      if (this.selectedMethod === 'pointBuy') {
        const nextCost = this.pointBuyValues[baseValue + 1];
        const currentCost = this.pointBuyValues[baseValue];
        const costDiff = nextCost - currentCost;
        return baseValue >= 15 || this.pointBuyRemaining < costDiff;
      } else if (this.selectedMethod === 'manual') {
        return baseValue >= 18;
      }
      return true;
    },
    cannotDecrease(stat, value) {
      const baseValue = this.getBaseStat(stat);
      if (this.selectedMethod === 'pointBuy') {
        return baseValue <= 8;
      } else if (this.selectedMethod === 'manual') {
        return baseValue <= 3;
      }
      return true; 
    },
    getBaseStat(stat) {
      return this.baseStats[stat] || 10;
    },
    getRaceBonus(stat) {
      if (this.character.race && this.character.race.abilityScoreIncrease) {
        return this.character.race.abilityScoreIncrease[stat] || 0;
      }
      return 0;
    },
    calculateModifier(value) {
      const mod = Math.floor((value - 10) / 2);
      return mod >= 0 ? `+${mod}` : mod;
    },
    calculateHP() {
      if (!this.character.class) return 0;
      
      const hitDieValue = parseInt(this.character.class.hitDie?.slice(1)) || 0;
      const conModifier = Math.floor((this.localStats.constitution - 10) / 2);
      return hitDieValue + conModifier;
    },
    updateFinalStats() {
      for (const stat in this.baseStats) {
        this.localStats[stat] = this.baseStats[stat] + this.getRaceBonus(stat);
      }
      
      this.localCharacter.hp = this.calculateHP();
      this.localCharacter.maxHp = this.localCharacter.hp;
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
      this.localCharacter.stats = { ...this.localStats };
      this.$emit('update:character', this.localCharacter);
      this.$emit('next-step');
    }
  },
  watch: {
    selectedMethod(newMethod) {
      if (newMethod === 'standard') {
        this.applyStandardArray();
      } else if (newMethod === 'roll') {
        this.rollStats();
      } else if (newMethod === 'pointBuy') {
        // Réinitialiser à 8 pour le point buy
        for (const stat in this.baseStats) {
          this.baseStats[stat] = 8;
        }
        this.updateFinalStats();
      }
    }
  }
};
</script>

<style scoped>
.stats-allocation {
  width: 100%;
}

.stats-methods {
  margin-bottom: 2rem;
}

.method-selector {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

.method-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.method-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.method-option:hover {
  background-color: #e0e0e0;
}

.method-option input {
  margin-right: 0.5rem;
}

.roll-actions {
  margin-top: 1rem;
}

.roll-results {
  margin-top: 0.5rem;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-header {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #4caf50;
}

.stat-value {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-modifier {
  color: #666;
  margin-bottom: 1rem;
}

.stat-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn-sm {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 1.2rem;
  line-height: 1;
}

.stat-details {
  font-size: 0.85rem;
  color: #666;
}

.stat-race-bonus {
  color: #4caf50;
}

.stats-summary {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  overflow: hidden; /* Empêche le débordement du contenu */
}

.derived-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.derived-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 0.8rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.derived-stat span:first-child {
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center; /* Assure le centrage du texte */
  font-size: 0.9rem; /* Légèrement plus petit pour les écrans étroits */
}

.derived-stat span:last-child {
  font-size: 1.2rem;
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

@media (max-width: 767px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .derived-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .method-options {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .derived-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .derived-stat {
    padding: 0.6rem;
  }
  
  .derived-stat span:first-child {
    font-size: 0.85rem;
  }
  
  .derived-stat span:last-child {
    font-size: 1.1rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn {
    width: 100%;
  }
  
  .stats-summary h3 {
    font-size: 1.1rem;
  }
}

@media (max-width: 375px) {
  .method-option {
    padding: 0.4rem;
    font-size: 0.9rem;
  }
  
  .stat-card {
    padding: 0.8rem;
  }
  
  .stat-value {
    font-size: 1.7rem;
  }
  
  .stat-details {
    font-size: 0.8rem;
  }
  
  .stats-summary {
    padding: 0.8rem;
  }
}

</style>