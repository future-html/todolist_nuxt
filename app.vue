<script setup lang="ts">
import { useCounter } from "./store/useCounter";
import { ref, onMounted } from "vue";
import axios from "axios";

console.log(useCounter);
const store = useCounter();

// setstate of data to be null
const data = ref(null);

onMounted(async () => {
	try {
		const response = await axios.get("http://localhost:3001/api/users");
		data.value = response.data;
		console.log(data.value);
	} catch (error) {
		console.error("Error fetching data:", error);
	}
});
</script>

<template>
	<button @click="store.n++">Increment {{ store.n }}</button>
	{{ JSON.stringify(data, null, 2) }}
</template>
