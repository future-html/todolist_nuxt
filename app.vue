<script setup lang="ts">
import { useCounter } from "./store/useCounter";
console.log(useCounter);
const store = useCounter();
</script>

<template>
	<button @click="store.n++">Increment {{ store.n }}</button>
</template>
