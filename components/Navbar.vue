<template>
  <nav>
    <NuxtLink to="/" :class="{ active: $route.path === '/'}">Accueil</NuxtLink>
    <NuxtLink to="/characters" :class="{ active: $route.path === '/characters'}">Personnages</NuxtLink>
    <NuxtLink to="/inventory" :class="{ active: $route.path === '/inventory'}">Inventaire</NuxtLink>
  </nav>
</template>

<script setup>

</script>

<style scoped>
nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    text-align: center;
}

a {
  text-decoration: none;
}

a:visited{
    color : black
}
.active {
  font-weight: bold;
}

</style>