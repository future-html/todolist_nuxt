// ~/stores/auth.ts
import { defineStore } from "pinia";
import { useStorage } from "~/services/storage";
import type { User } from "~/types";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		currentUser: null as User | null,
		isAuthenticated: false,
	}),

	actions: {
		initialize() {
			if (process.client) {
				const authData = localStorage.getItem("auth");
				if (authData) {
					try {
						const { userId, timestamp } = JSON.parse(authData);

						// Validate session isn't expired (e.g., 7 days)
						const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
						if (timestamp > oneWeekAgo) {
							const storage = useStorage();
							const data = storage.getData();
							const user = data.users.find((u) => u.userId === userId);
							if (user) {
								this.currentUser = user;
								this.isAuthenticated = true;
								return;
							}
						}

						// Clear invalid session
						localStorage.removeItem("auth");
					} catch (e) {
						console.error("Failed to parse auth data", e);
						localStorage.removeItem("auth");
					}
				}
			}
			// Check if user is logged in from localStorage
		},

		register(user: Omit<User, "userId">) {
			const storage = useStorage();
			const data = storage.getData();

			// Check if email already exists
			if (data.users.some((u) => u.email === user.email)) {
				throw new Error("Email already registered");
			}

			// Generate unique userId
			const userId = `user-${Date.now()}`; // More unique than just length-based

			const newUser: User = {
				userId,
				...user,
			};

			data.users.push(newUser);
			storage.saveData(data);

			// Set current user and persist auth
			this.setAuthenticatedUser(newUser);

			return newUser;
		},

		login(email: string, password: string) {
			const storage = useStorage();
			const data = storage.getData();

			const user = data.users.find((u) => u.email === email);
			if (!user) throw new Error("User not found");
			if (user.password !== password) throw new Error("Invalid password");

			// Set current user and persist auth
			this.setAuthenticatedUser(user);

			return user;
		},

		setAuthenticatedUser(user: User) {
			this.currentUser = user;
			this.isAuthenticated = true;

			// Store minimal auth data in localStorage
			localStorage.setItem(
				"auth",
				JSON.stringify({
					userId: user.userId,
					timestamp: Date.now(), // For session expiration
				})
			);
		},

		logout() {
			this.currentUser = null;
			this.isAuthenticated = false;
			localStorage.removeItem("auth");
		},

		// Optional: Check if session is still valid
		checkAuth() {
			if (process.client) {
				const authData = localStorage.getItem("auth");
				if (!authData) {
					this.logout();
					return false;
				}
				try {
					const { userId, timestamp } = JSON.parse(authData);
					const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

					if (timestamp > oneWeekAgo) {
						const storage = useStorage();
						const data = storage.getData();
						const user = data.users.find((u) => u.userId === userId);

						if (user) {
							this.setAuthenticatedUser(user);
							return true;
						}
					}

					this.logout();
					return false;
				} catch (e) {
					this.logout();
					return false;
				}
			}
		},
	},
});
