<template>
	<div
		class="task bg-white dark:bg-gray-700 rounded-lg p-4 mb-3 shadow hover:shadow-md transition-shadow cursor-pointer"
		@click="openTaskModal"
	>
		<div class="flex justify-between items-start">
			<h3 class="font-medium text-gray-800 dark:text-white">{{ task.taskName }}</h3>
			<button
				v-if="isOwner || isMember"
				class="text-gray-400 hover:text-red-500"
				@click.stop="deleteTask"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>

		<div class="mt-2 flex items-center space-x-2">
			<span
				class="text-xs px-2 py-1 rounded capitalize"
				:class="priorityClasses[task.priority]"
			>
				{{ task.priority }}
			</span>
			<span
				v-if="task.dueDate"
				class="text-xs text-gray-500 dark:text-gray-300"
			>
				Due: {{ formatDate(task.dueDate) }}
			</span>
		</div>

		<div
			v-if="task.assignee.length > 0"
			class="mt-3"
		>
			<div class="flex items-center space-x-1">
				<span class="text-xs text-gray-500 dark:text-gray-300">Assigned to:</span>
				<div class="flex -space-x-2">
					<div
						v-for="userId in task.assignee.slice(0, 3)"
						:key="userId"
						class="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs"
					>
						{{ getUserInitials(userId) }}
					</div>
					<div
						v-if="task.assignee.length > 3"
						class="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-500 flex items-center justify-center text-xs"
					>
						+{{ task.assignee.length - 3 }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/auth";
import { useBoardStore } from "~/store/board";
import type { Task, User } from "~/types";

const props = defineProps({
	task: {
		type: Object as PropType<Task>,
		required: true,
	},
	boardOwnerId: {
		type: String,
		required: true,
	},
	boardId: {
		type: String,
		required: true,
	},
});

console.log(props.task, "task");
console.log(props.boardOwnerId, "boardOwnerId");

const emit = defineEmits(["task-deleted", "task-selected"]);

const authStore = useAuthStore();
const boardStore = useBoardStore();

// Computed properties
const isOwner = computed(() => {
	return authStore.currentUser?.userId === props.boardOwnerId;
});

const isMember = computed(() => {
	const board = boardStore.boards.find((b) => b.boardId === props.boardId);
	return board?.people.includes(authStore.currentUser?.userId || "") || false;
});

const priorityClasses = {
	low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
	high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// Methods
const openTaskModal = () => {
	emit("task-selected", props.task);
};

const deleteTask = async () => {
	if (confirm("Are you sure you want to delete this task?")) {
		try {
			await boardStore.deleteTask(props.task.taskId);
			emit("task-deleted", props.task.taskId);
		} catch (error) {
			console.error("Failed to delete task:", error);
		}
	}
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getUserInitials = (userId: string) => {
	const storage = useStorage() as any;
	const data = storage.getData();
	const user = data.users.find((u: User) => u.userId === userId);
	if (!user) return "?";
	return user.name
		.split(" ")
		.map((n: any) => n[0])
		.join("")
		.toUpperCase();
};
</script>

<style scoped>
.task {
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task:hover {
	transform: translateY(-2px);
}
</style>
