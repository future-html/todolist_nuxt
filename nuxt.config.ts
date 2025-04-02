import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@pinia/nuxt"],
	vite: {
		plugins: [tailwindcss()],
	},
	css: ["~/assets/css/index.css"],
});
