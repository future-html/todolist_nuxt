// ~/middleware/auth.ts
import { useAuthStore } from "~/store/auth";
import { useStorage } from "~/services/storage";
export default defineNuxtRouteMiddleware(async (to, from) => {
	const data = useStorage() as any;
	console.log(data.getAuth(), "atuh guest");

	// If not authenticated, redirect to login
	if (data.getAuth()) {
		return navigateTo("/board");
	}
});
