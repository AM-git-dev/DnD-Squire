<template>
  <div class="basic-info-form">
    <h2>Informations de base</h2>
    <p>Entrez les informations de base de votre personnage.</p>
    
    <div class="form-group">
      <label for="character-name">Nom du personnage</label>
      <input 
        id="character-name" 
        v-model="localCharacter.name" 
        type="text" 
        class="form-control"
        required
      >
    </div>
    
    <div class="form-group">
      <label for="character-background">Historique</label>
      <select 
        id="character-background" 
        v-model="localCharacter.background" 
        class="form-control"
      >
        <option value="">Sélectionnez un historique</option>
        <option value="acolyte">Acolyte</option>
        <option value="criminal">Criminel</option>
        <option value="folk-hero">Héros du peuple</option>
        <option value="noble">Noble</option>
        <option value="sage">Sage</option>
        <option value="soldier">Soldat</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="character-alignment">Alignement</label>
      <select 
        id="character-alignment" 
        v-model="localCharacter.alignment" 
        class="form-control"
      >
        <option value="">Sélectionnez un alignement</option>
        <option value="lawful-good">Loyal Bon</option>
        <option value="neutral-good">Neutre Bon</option>
        <option value="chaotic-good">Chaotique Bon</option>
        <option value="lawful-neutral">Loyal Neutre</option>
        <option value="neutral">Neutre</option>
        <option value="chaotic-neutral">Chaotique Neutre</option>
        <option value="lawful-evil">Loyal Mauvais</option>
        <option value="neutral-evil">Neutre Mauvais</option>
        <option value="chaotic-evil">Chaotique Mauvais</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="character-description">Description physique</label>
      <textarea 
        id="character-description" 
        v-model="localCharacter.description" 
        class="form-control"
        rows="3"
      ></textarea>
    </div>
    
    <div class="form-group">
      <label for="character-personality">Traits de personnalité</label>
      <textarea 
        id="character-personality" 
        v-model="localCharacter.personality" 
        class="form-control"
        rows="3"
      ></textarea>
    </div>
    
    <div class="form-actions">
      <button class="btn btn-primary" @click="nextStep" :disabled="!isFormValid">
        Continuer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicInfoForm',
  props: {
    character: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localCharacter: { ...this.character }
    };
  },
  computed: {
    isFormValid() {
      return this.localCharacter.name && this.localCharacter.name.trim() !== '';
    }
  },
  methods: {
    nextStep() {
      if (this.isFormValid) {
        this.$emit('update:character', this.localCharacter);
        this.$emit('next-step');
      }
    }
  }
};
</script>

<style scoped>
.basic-info-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

textarea.form-control {
  resize: vertical;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
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

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
