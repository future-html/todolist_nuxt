<!-- ~/pages/login.vue -->
<template>
	<div>
		<h1>Login</h1>
		<form @submit.prevent="handleLogin">
			<div>
				<label>Email:</label>
				<input
					v-model="form.email"
					type="email"
					required
				/>
			</div>
			<div>
				<label>Password:</label>
				<input
					v-model="form.password"
					type="password"
					required
				/>
			</div>
			<button type="submit">Login</button>
		</form>
		<p
			v-if="error"
			class="error"
		>
			{{ error }}
		</p>
	</div>
</template>

<script setup>
definePageMeta({
	middleware: "guest",
});
import { useAuthStore } from "~/store/auth";
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
	email: "",
	password: "",
});
const error = ref("");

const handleLogin = async () => {
	try {
		authStore.login(form.email, form.password);
		const redirectPath = router.options.history.state.back || "/board";
		router.push(redirectPath);
	} catch (err) {
		error.value = err.message;
	}
};

onMounted(() => {
	if (authStore.isAuthenticated) {
		router.push("/board");
	}
});
</script>
