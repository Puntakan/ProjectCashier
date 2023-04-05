<script setup>
import { RouterLink} from 'vue-router'
</script>
 
<template>
<div>
<RouterLink :to="{name: 'AddEdit'}">Cashier</RouterLink>
<RouterLink :to="{name: 'History'}">History</RouterLink>
</div>
</template>
 
<style scoped>
</style>