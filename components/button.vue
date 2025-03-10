<template>
  <button :class="variant" @click="onClick">
    <slot></slot>
  </button>
</template>

<script setup>

defineProps({
  variant: { type: String, default: 'default' }
});
const emit = defineEmits(['click']);
const onClick = () => emit('click');

</script>

<style scoped>

button {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s ease, transform 0.2s ease;
}

.default {
  background: gray;
  color: white;
}

.create {
  background: blue;
  color: white;
}

.delete {
  background: red;
  color: white;
}

button:hover {
  transform: scale(1.05);
}
</style>
