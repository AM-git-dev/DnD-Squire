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
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
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
</style>
