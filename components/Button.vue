<template>
  <button :class="variant" @click="onClick">
    <slot></slot>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  variant: { type: String, default: 'default' }
});

const emit = defineEmits(['click']);

const onClick = (event) => {
  emit('click', event);
};
</script>

<style scoped>
button {
  padding: 12px 4px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  min-width: 100px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.default {
  background: gray;
  color: white;
}

.create {
  background: green;
  color: white;
}

.delete {
  background: red;
  color: white;
}

.select {
  background: blue;
  color: white;
}

button:hover {
  transform: scale(1.05);
}
</style>