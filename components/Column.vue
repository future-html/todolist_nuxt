<template>
	<div
		class="column bg-gray-100 dark:bg-gray-800 rounded-lg p-4 w-72 flex flex-col"
		:data-column-id="column.columnId"
	>
		{{ column.columnId }}
		<!-- Column Header -->
		<div class="flex items-center justify-between mb-4">
			<h3
				v-if="!isEditing"
				class="font-semibold text-lg text-gray-800 dark:text-white cursor-pointer"
				@click="enableEdit"
			>
				{{ column.columnName }}
			</h3>

			<input
				v-else
				ref="nameInput"
				v-model="editedName"
				type="text"
				class="flex-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded px-2 py-1"
				@blur="saveEdit"
				@keyup.enter="saveEdit"
				@keyup.escape="cancelEdit"
			/>

			<div class="flex items-center space-x-2">
				<button
					v-if="isEditing"
					class="text-green-500 hover:text-green-700"
					@click="saveEdit"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<button
					v-if="isEditing"
					class="text-red-500 hover:text-red-700"
					@click="cancelEdit"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<button
					v-if="!isEditing && isOwner"
					class="text-red-500 hover:text-red-700"
					@click="deleteColumn"
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
		</div>

		<!-- Tasks List -->
		<div
			class="flex-1 overflow-y-auto"
			v-if="tasks.length > 0"
		>
			<draggable
				v-model="tasks"
				group="tasks"
				item-key="taskId"
				@end="onTaskDragEnd"
			>
				<template #item="{ element: task }">
					<TaskElement
						:task="task"
						:board-owner-id="boardOwnerId"
						:board-id="column.boardId"
						@task-deleted="refreshData"
					/>

					<!-- @task-selected="openTaskModal" -->
				</template>
			</draggable>
		</div>
		<div v-else>
			<p>Error somethingz</p>
		</div>
		<!-- Add Task Button -->
		<button
			class="mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center"
			@click="openAddTaskModal"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 mr-1"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
					clip-rule="evenodd"
				/>
			</svg>
			Add Task
		</button>
	</div>
	<div v-if="showAddTaskModal">
		<TaskModal
			:columnId="column.columnId"
			v-model:showAddTaskModal="showAddTaskModal"
			v-model:isNewTask="isNewTask"
		/>
	</div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import TaskElement from "./TaskElement.vue";
import { useAuthStore } from "~/store/auth";
import { useBoardStore } from "~/store/board";
import { useStorage } from "~/services/storage";
import type { Column, Task } from "~/types";
import TaskModal from "./TaskModal.vue";
console.log(TaskElement);

const props = defineProps({
	column: {
		type: Object as PropType<Column>,
		required: true,
	},
	boardOwnerId: {
		type: String,
		required: true,
	},
});

const showAddTaskModal = ref(false);
const isNewTask = ref(true); // compoted for isNewTask by click add task or not
// and what is id to find

console.log(props.boardOwnerId);

const emit = defineEmits(["column-updated", "column-deleted", "task-selected", "add-task"]);

const authStore = useAuthStore();
const boardStore = useBoardStore();
const board = boardStore.boards.find((b) => b.boardId === props.column.boardId);
const data = useStorage() as any;

// Reactive state
const isEditing = ref(false);
const editedName = ref(props.column.columnName);
const nameInput = ref<HTMLInputElement | null>(null);

// Computed properties

const isOwner = true; // computed(() => authStore.currentUser?.userId === props.boardOwnerId);

console.log(isOwner);

const isMember = computed(() => {
	return board?.people.includes(authStore.currentUser?.userId || "") || false;
});

console.log(board && board.boardId, "boardId");

const priorityClasses = {
	low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
	high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// Methods
const enableEdit = () => {
	isEditing.value = true;
	editedName.value = props.column.columnName;
	nextTick(() => {
		nameInput.value?.focus();
	});
};

const saveEdit = async () => {
	try {
		await boardStore.updateColumn(props.column.columnId, editedName.value);
		emit("column-updated");
		isEditing.value = false;
	} catch (error) {
		console.error("Failed to update column:", error);
	}
};

const cancelEdit = () => {
	isEditing.value = false;
	editedName.value = props.column.columnName;
};

const deleteColumn = async () => {
	if (confirm("Are you sure you want to delete this column? All tasks will be deleted.")) {
		try {
			await boardStore.deleteColumn(props.column.columnId);
			emit("column-deleted", props.column.columnId);
		} catch (error) {
			console.error("Failed to delete column:", error);
		}
	}
};

// const openTaskModal = (task: Task) => {
// 	emit("task-selected", task);
// };

const openAddTaskModal = () => {
	showAddTaskModal.value = true;
};

const formatDate = (dateString: string) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const tasks = computed({
	get(): Task[] {
		return boardStore.getColumnTasks(props.column.columnId);
	},
	set(value: Task[]) {
		// This will be called when drag and drop reorders tasks
		// We need to update the order in the store
		updateTaskOrder(value);
	},
});

console.log(tasks.value, "tasks");

const onTaskDragEnd = (event: any) => {
	if (event.to !== event.from) {
		// Task moved between columns
		const taskId = event.item.dataset.id;
		const newColumnId = event.to.dataset.columnId;
		boardStore.moveTask(taskId, newColumnId, event.newIndex);
	}
};

const updateTaskOrder = (newTasks: Task[]) => {
	// Update the order of tasks in the same column
	const storage = useStorage();
	const data = storage.getData();

	// Remove all tasks from this column
	data.tasks = data.tasks.filter((t) => t.columnId !== props.column.columnId);

	// Add them back in the new order
	data.tasks.push(...newTasks);

	storage.saveData(data);
	boardStore.tasks = data.tasks;
};
const refreshData = () => {
	boardStore.loadInitialData();
};
</script>

<style scoped>
.column {
	min-height: 200px;
	max-height: calc(100vh - 200px);
}

.task {
	transition: transform 0.2s ease;
}

.task:hover {
	transform: translateY(-2px);
}
</style>
