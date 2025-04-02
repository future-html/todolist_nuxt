<template>
	<div class="p-4">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Your Boards</h1>
			<div class="flex gap-2">
				<button
					@click="showBoardModal = true"
					class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				>
					Create New Board
				</button>
				<button
					@click="handleLogout"
					class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
				>
					Logout
				</button>
			</div>
		</div>

		<!-- Create/Edit Board Modal -->
		<div
			v-if="showBoardModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		>
			<div class="bg-white p-6 rounded-lg max-w-md w-full">
				<h2 class="text-xl font-semibold mb-4">
					{{ editingBoard ? "Edit Board" : "Create New Board" }}
				</h2>
				<input
					v-model="currentBoardName"
					placeholder="Board name"
					class="w-full p-2 border rounded mb-4"
					@keyup.enter="saveBoard"
				/>
				<div class="flex justify-end gap-2">
					<button
						@click="closeModal"
						class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					>
						Cancel
					</button>
					<button
						@click="saveBoard"
						class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						:disabled="!currentBoardName.trim()"
					>
						{{ editingBoard ? "Update" : "Create" }}
					</button>
				</div>
			</div>
		</div>

		<!-- Delete Confirmation Modal -->
		<div
			v-if="showDeleteModal"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		>
			<div class="bg-white p-6 rounded-lg max-w-md w-full">
				<h2 class="text-xl font-semibold mb-4">Delete Board</h2>
				<p class="mb-4">Are you sure you want to delete "{{ boardToDelete?.boardName }}"?</p>
				<div class="flex justify-end gap-2">
					<button
						@click="showDeleteModal = false"
						class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					>
						Cancel
					</button>
					<button
						@click="confirmDelete"
						class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
					>
						Delete
					</button>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading"
			class="flex justify-center items-center h-64"
		>
			<p>Loading boards...</p>
		</div>

		<!-- Error State -->
		<div
			v-if="error"
			class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
		>
			{{ error }}
		</div>

		<!-- Boards Grid -->
		<div
			v-if="!loading && !error"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			<div
				v-for="board in userBoards"
				:key="board.boardId"
				class="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
			>
				<div class="absolute top-2 right-2 flex gap-1">
					<button
						@click.stop="editBoard(board)"
						class="p-1 text-gray-500 hover:text-blue-600"
						title="Edit board"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</button>
					<button
						@click.stop="initDeleteBoard(board)"
						class="p-1 text-gray-500 hover:text-red-600"
						title="Delete board"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>

				<NuxtLink
					:to="`/boards/${board.boardId}`"
					class="cursor-pointer block hover:bg-gray-50 p-4 rounded-lg transition-colors"
				>
					<h3 class="text-xl font-semibold mb-2">{{ board.boardName }}</h3>
					<p class="text-sm text-gray-600 mb-1">Owner: {{ getOwnerName(board.owner) }}</p>
					<p class="text-sm text-gray-600">Members: {{ board.people.length + 1 }}</p>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
});
import { useAuthStore } from "~/store/auth";
import { useBoardStore } from "~/store/board";
import { useStorage } from "~/services/storage";
import type { Board } from "~/types";
const authStore = useAuthStore();
const boardStore = useBoardStore();
const router = useRouter();

// State
const showBoardModal = ref(false);
const showDeleteModal = ref(false);
const newBoardName = ref("");
const currentBoardName = ref("");
const editingBoard = ref<Board | null>(null);
const boardToDelete = ref<Board | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Computed
const userBoards = computed(() => {
	const data = useStorage();
	if (!authStore.currentUser && !data.getAuth()) return [];
	return boardStore.getUserBoards((authStore.currentUser! && authStore.currentUser!.userId) || data.getAuth().userId);
});

// Methods
const getOwnerName = (userId: string) => {
	try {
		const storage = useStorage() as any;
		const data = storage.getData();
		const owner = data.users.find((u: any) => u.userId === userId);
		return owner?.name || "Unknown";
	} catch (err) {
		console.error("Error getting owner name:", err);
		return "Unknown";
	}
};

const createBoard = async () => {
	if (!authStore.currentUser || !currentBoardName.value.trim()) return;

	try {
		await boardStore.createBoard(currentBoardName.value, authStore.currentUser.userId);
		closeModal();
	} catch (err) {
		error.value = "Failed to create board. Please try again.";
		console.error("Error creating board:", err);
	}
};

const editBoard = (board: Board) => {
	editingBoard.value = board;
	currentBoardName.value = board.boardName;
	showBoardModal.value = true;
};

const updateBoard = async () => {
	if (!editingBoard.value || !currentBoardName.value.trim()) return;

	try {
		boardStore.updateBoard(editingBoard.value.boardId, currentBoardName.value);
		closeModal();
	} catch (err) {
		error.value = "Failed to update board. Please try again.";
		console.error("Error updating board:", err);
	}
};

const initDeleteBoard = (board: Board) => {
	boardToDelete.value = board;
	showDeleteModal.value = true;
};

const confirmDelete = async () => {
	if (!boardToDelete.value) return;

	try {
		await boardStore.deleteBoard(boardToDelete.value.boardId);
		showDeleteModal.value = false;
		boardToDelete.value = null;
	} catch (err) {
		error.value = "Failed to delete board. Please try again.";
		console.error("Error deleting board:", err);
	}
};

const saveBoard = () => {
	if (editingBoard.value) {
		updateBoard();
	} else {
		createBoard();
	}
};

const closeModal = () => {
	showBoardModal.value = false;
	showDeleteModal.value = false;
	editingBoard.value = null;
	boardToDelete.value = null;
	currentBoardName.value = "";
};

const goToBoard = (boardId: string) => {
	router.push(`/boards/${boardId}`);
};

const handleLogout = () => {
	authStore.logout();
	router.push("/login");
};

// Lifecycle
onMounted(async () => {
	try {
		boardStore.loadInitialData();
	} catch (err) {
		error.value = "Failed to load boards. Please try again.";
		console.error("Error loading boards:", err);
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped>
.board-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
