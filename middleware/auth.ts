// ~/middleware/auth.global.ts
import { useAuthStore } from "~/store/auth";
import { useStorage } from "~/services/storage";
export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();
	const data = useStorage() as any;

	console.log(data.getAuth(), "auth");

	// Initialize auth state

	// Redirect logic
	if (!data.getAuth() && !authStore.isAuthenticated) {
		return navigateTo("/login");
	}
});
