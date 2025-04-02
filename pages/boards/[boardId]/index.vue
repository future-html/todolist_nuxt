<!-- ~/pages/boards/[boardId].vue -->
<template>
	<div>
		<div class="flex justify-between items-center mb-6">
			<div>
				<h1 class="text-2xl font-bold">{{ board?.boardName }}</h1>
				<p>Owner(has): {{ ownerName }}</p>
			</div>
			<div class="flex gap-2">
				<button
					@click="showInviteModal = true"
					class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
				>
					Invite Members
				</button>
				<NuxtLink
					to="/board"
					class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
				>
					Back to Boards
				</NuxtLink>

				<button
					@click="showAddColumn = true"
					class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Add Column
				</button>
			</div>
		</div>

		<!-- Members list -->
		<div class="mb-6">
			<h3 class="font-medium mb-2">Team Members:</h3>
			<div class="flex flex-wrap gap-2">
				<div
					v-for="userId in board?.people || []"
					:key="userId"
					class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
				>
					<span>{{ getUserName(userId) }}</span>
					<button
						v-if="isOwner"
						@click="removeMember(userId)"
						class="text-red-500 hover:text-red-700 text-sm"
					>
						×
					</button>
				</div>
			</div>
		</div>
		<div class="flex space-x-4 overflow-x-auto pb-4">
			<!-- <Column
				v-for="column in columns"
				:key="column.columnId"
				:column="column"
				:board-owner-id="board?.owner || ''"
				@column-updated="refreshBoard"
				@column-deleted="refreshBoard"
				@task-selected="openTaskModal"
				@add-task="openAddTaskModal"
			/> This is problem -->
		</div>

		<div
			v-if="showAddColumn"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
		>
			<div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
				<h2 class="text-xl font-bold mb-4">Add New Column</h2>
				<input
					v-model="newColumnName"
					type="text"
					placeholder="Column name"
					class="w-full p-2 border rounded mb-4"
					@keyup.enter="addColumn"
				/>
				<div class="flex justify-end space-x-2">
					<button
						@click="showAddColumn = false"
						class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					>
						Cancel
					</button>
					<button
						@click="addColumn"
						class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Add
					</button>
				</div>
			</div>
		</div>

		<!-- Rest of your board content -->

		<BoardInviteModal
			:boardId="boardId"
			:isOpen="showInviteModal"
			@close="showInviteModal = false"
			@invited="refreshBoard"
		/>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
});
onMounted(() => {
	boardStore.loadInitialData();
});

import TaskModal from "~/components/TaskModal.vue";
import Column from "~/components/Column.vue";
import type { Task } from "~/types";
import { useBoardStore } from "~/store/board";
import { useAuthStore } from "~/store/auth";
import { useStorage } from "~/services/storage";
import BoardInviteModal from "~/components/BoardInviteModal.vue";
const route = useRoute();
// const router = useRouter();
const boardStore = useBoardStore();
const authStore = useAuthStore();

const boardId = route.params.boardId as string;
const showAddColumn = ref(false);
const newColumnName = ref("");
const selectedTask = ref<Task | null>(null);

const showTaskModal = ref(false);
const selectedColumnId = ref("");

// console.loglog(boardId);
const showInviteModal = ref(false);

const board = computed(() => {
	return boardStore.boards.find((b) => b.boardId === boardId);
});

const columns = computed(() => {
	return boardStore.getBoardColumns(boardId);
});

// console.loglog(board);
const isOwner = computed(() => {
	return (
		board.value?.owner === ((authStore.currentUser && authStore.currentUser?.userId) || useStorage().getAuth().userId)
	);
});

// console.loglog(BoardInviteModal);

const addColumn = () => {
	if (!newColumnName.value.trim()) return;

	try {
		boardStore.addColumn(boardId, newColumnName.value);
		newColumnName.value = "";
		showAddColumn.value = false;
		refreshBoard();
	} catch (error) {
		console.error("Failed to add column:", error);
	}
};

const openAddTaskModal = (columnId: string) => {
	selectedTask.value = null;
	selectedColumnId.value = columnId;
	showTaskModal.value = true;
};

const openTaskModal = (task: Task) => {
	selectedTask.value = task;
	showTaskModal.value = true;
};

// const handleTaskCreated = (task: Task) => {
// 	refreshBoard();
// 	closeTaskModal();
// };
const closeTaskModal = () => {
	showTaskModal.value = false;
};

const ownerName = computed(() => {
	if (!board.value) return "";
	const storage = useStorage() as any;
	const data = storage.getData();
	const owner = data.users.find((u: any) => u.userId === board.value!.owner);
	return owner?.name || "Unknown";
});

const getUserName = (userId: string) => {
	const storage = useStorage() as any;
	const data = storage.getData();
	const user = data.users.find((u: any) => u.userId === userId);
	return user?.name || "Unknown";
};

const removeMember = async (userId: string) => {
	if (!confirm(`Remove this member from the board?`)) return;

	try {
		boardStore.removeMember(boardId, userId);
	} catch (error) {
		console.error("Failed to remove member:", error);
		// Show error to user
	}
};

const refreshBoard = () => {
	// Force reload board data if needed
	boardStore.loadInitialData();
};
</script>
