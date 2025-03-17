<template>
  <div class="character-summary">
    <h2>Récapitulatif du personnage</h2>
    <p>Vérifiez les informations de votre personnage avant de valider sa création.</p>
    
    <div class="summary-container">
      <div class="summary-header">
        <div class="character-portrait">
          <img :src="character.race?.image || '/images/races/default.png'" alt="Portrait">
        </div>
        <div class="character-identity">
          <h3>{{ character.name }}</h3>
          <div class="character-subtitle">
            <span>{{ character.race?.name || 'Race inconnue' }}</span>
            <span class="separator"></span>
            <span>{{ character.class?.name || 'Classe inconnue' }}</span>
            <span class="separator"></span>
            <span>Niveau {{ character.level }}</span>
          </div>
          <div class="character-background">
            <span>{{ formatBackground(character.background) }}</span>
            <span class="separator"></span>
            <span>{{ formatAlignment(character.alignment) }}</span>
          </div>
        </div>
      </div>
      
      <div class="summary-content">
        <div class="summary-section">
          <h4>Caractéristiques</h4>
          <div class="stats-grid">
            <div class="stat-box" v-for="(value, stat) in character.stats" :key="stat">
              <div class="stat-name">{{ statName(stat) }}</div>
              <div class="stat-value">{{ value }}</div>
              <div class="stat-modifier">{{ calculateModifier(value) }}</div>
            </div>
          </div>
        </div>
        
        <div class="summary-section">
          <h4>Combat</h4>
          <div class="combat-stats">
            <div class="combat-stat">
              <span>Initiative</span>
              <span>{{ calculateModifier(character.stats.dexterity) }}</span>
            </div>
            <div class="combat-stat">
              <span>Classe d'armure</span>
              <span>{{ calculateAC() }}</span>
            </div>
            <div class="combat-stat">
              <span>Points de vie</span>
              <span>{{ character.maxHp }}</span>
            </div>
            <div class="combat-stat">
              <span>Dé de vie</span>
              <span>{{ character.class?.hitDie || 'd8' }}</span>
            </div>
          </div>
        </div>
        
        <div class="summary-section">
          <h4>Profil</h4>
          <div class="profile-details">
            <div class="profile-item" v-if="character.description">
              <div class="profile-label">Description</div>
              <div class="profile-value">{{ character.description }}</div>
            </div>
            <div class="profile-item" v-if="character.personality">
              <div class="profile-label">Personnalité</div>
              <div class="profile-value">{{ character.personality }}</div>
            </div>
          </div>
        </div>
        
        <div class="summary-section">
          <h4>Traits raciaux</h4>
          <div class="traits-list" v-if="character.race && character.race.traits">
            <div class="trait-item" v-for="(trait, index) in character.race.traits" :key="index">
              <div class="trait-name">{{ trait.name }}</div>
              <div class="trait-description">{{ trait.description }}</div>
            </div>
          </div>
          <div v-else class="no-data">Aucun trait racial disponible</div>
        </div>
        
        <div class="summary-section">
          <h4>Capacités de classe</h4>
          <div class="features-list" v-if="character.class && character.class.features">
            <div class="feature-item" v-for="(feature, index) in level1Features" :key="index">
              <div class="feature-name">{{ feature.name }}</div>
              <div class="feature-description">{{ feature.description }}</div>
            </div>
          </div>
          <div v-else class="no-data">Aucune capacité de classe disponible</div>
        </div>
        
        <div class="summary-section">
          <h4>Compétences</h4>
          <div class="skills-list" v-if="character.class && character.class.skillProficiencies">
            <div class="skills-notice">
              Vous pouvez choisir {{ character.class.numSkillsProficiencies }} compétences parmi:
            </div>
            <div class="skill-options">
              <template v-for="(skill, index) in character.class.skillProficiencies" :key="index">
                {{ formatSkill(skill) }}<span v-if="index < character.class.skillProficiencies.length - 1" class="comma">, </span>
              </template>
            </div>
          </div>
          <div v-else class="no-data">Aucune compétence disponible</div>
        </div>
        
        <div class="summary-section">
          <h4>Équipement de départ</h4>
          <div class="equipment-list" v-if="character.class && character.class.startingEquipment">
            <ul>
              <li v-for="(item, index) in character.class.startingEquipment" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
          <div v-else class="no-data">Aucun équipement disponible</div>
        </div>
      </div>
    </div>
    
    <div class="form-actions">
      <button class="btn btn-secondary" @click="previousStep">
        Retour
      </button>
      <button class="btn btn-success" @click="saveCharacter">
        Créer le personnage
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CharacterSummary',
  props: {
    character: {
      type: Object,
      required: true
    }
  },
  computed: {
    level1Features() {
      if (!this.character.class || !this.character.class.features) return [];
      return this.character.class.features.filter(feature => feature.level === 1);
    }
  },
  methods: {
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
    calculateModifier(value) {
      const mod = Math.floor((value - 10) / 2);
      return mod >= 0 ? `+${mod}` : mod;
    },
    calculateAC() {
      const baseAC = 10 + Math.floor((this.character.stats.dexterity - 10) / 2);
      let bonusAC = 0;
      
      if (this.character.class && this.character.class.name === 'Barbare') {
        bonusAC += Math.floor((this.character.stats.constitution - 10) / 2);
      }
      
      return baseAC + bonusAC;
    },
    formatBackground(background) {
      if (!background) return 'Aucun historique';
      
      const backgroundNames = {
        'acolyte': 'Acolyte',
        'criminal': 'Criminel',
        'folk-hero': 'Héros du peuple',
        'noble': 'Noble',
        'sage': 'Sage',
        'soldier': 'Soldat'
      };
      
      return backgroundNames[background] || background;
    },
    formatAlignment(alignment) {
      if (!alignment) return 'Aucun alignement';
      
      const alignmentNames = {
        'lawful-good': 'Loyal Bon',
        'neutral-good': 'Neutre Bon',
        'chaotic-good': 'Chaotique Bon',
        'lawful-neutral': 'Loyal Neutre',
        'neutral': 'Neutre',
        'chaotic-neutral': 'Chaotique Neutre',
        'lawful-evil': 'Loyal Mauvais',
        'neutral-evil': 'Neutre Mauvais',
        'chaotic-evil': 'Chaotique Mauvais'
      };
      
      return alignmentNames[alignment] || alignment;
    },
    formatSkill(skill) {
      const skillNames = {
        'acrobatics': 'Acrobaties',
        'animal-handling': 'Dressage',
        'arcana': 'Arcanes',
        'athletics': 'Athlétisme',
        'deception': 'Tromperie',
        'history': 'Histoire',
        'insight': 'Perspicacité',
        'intimidation': 'Intimidation',
        'investigation': 'Investigation',
        'medicine': 'Médecine',
        'nature': 'Nature',
        'perception': 'Perception',
        'performance': 'Représentation',
        'persuasion': 'Persuasion',
        'religion': 'Religion',
        'sleight-of-hand': 'Escamotage',
        'stealth': 'Discrétion',
        'survival': 'Survie'
      };
      
      return skillNames[skill] || skill;
    },
    previousStep() {
      this.$emit('previous-step');
    },
    saveCharacter() {
      this.$emit('save-character');
    }
  }
};
</script>

<style scoped>
.character-summary {
  width: 100%;
}

.summary-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.summary-header {
  display: flex;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.character-portrait {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #ddd;
  margin-right: 1.5rem;
}

.character-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-identity {
  flex: 1;
}

.character-identity h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.character-subtitle {
  color: #666;
  margin-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.character-background {
  color: #888;
  font-style: italic;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.separator {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #999;
  margin: 0 8px;
  vertical-align: middle;
}

.comma {
  margin-right: 0.25rem;
}

.summary-content {
  padding: 1.5rem;
}

.summary-section {
  margin-bottom: 2rem;
}

.summary-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  color: #4caf50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

@media (max-width: 767px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .summary-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .character-portrait {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .character-subtitle, .character-background {
    justify-content: center;
  }
}

.stat-box {
  text-align: center;
  padding: 0.8rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.stat-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.stat-value {
  font-size: 1.5rem;
  line-height: 1;
  margin-bottom: 0.3rem;
}

.stat-modifier {
  color: #666;
  font-size: 0.9rem;
}

.combat-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

@media (max-width: 767px) {
  .combat-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.combat-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.combat-stat span:first-child {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.combat-stat span:last-child {
  font-size: 1.2rem;
}

.profile-item {
  margin-bottom: 1rem;
}

.profile-label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.profile-value {
  color: #555;
}

.traits-list, .features-list {
  display: grid;
  gap: 1rem;
}

.trait-item, .feature-item {
  padding: 0.8rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.trait-name, .feature-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.trait-description, .feature-description {
  color: #555;
  font-size: 0.95rem;
}

.skills-notice {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.skill-options {
  color: #555;
}

.no-data {
  color: #888;
  font-style: italic;
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

.btn-success {
  background-color: #2e7d32;
  color: white;
}

.btn-success:hover {
  background-color: #226325;
}

@media (max-width: 375px) {
  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>