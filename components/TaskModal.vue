<template>
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<!-- <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold">{{ isNewTask ? "Create Task" : "Edit Task" }}</h2>
				<button
					@click="toggleOpenFormModal"
					class="text-gray-500 hover:text-gray-700"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			
			<form @submit.prevent="submitForm">
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Name</label>
						<input
							v-model="form.taskName"
							type="text"
							required
							class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
						<textarea
							v-model="form.description"
							class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
							rows="3"
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
							<select
								v-model="form.priority"
								class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
							<select
								v-model="form.status"
								class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
							>
								<option value="todo">To Do</option>
								<option value="In progress">In Progress</option>
								<option value="completed">Completed</option>
							</select>
						</div>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
						<input
							v-model="form.dueDate"
							type="date"
							class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignees</label>
						<div class="space-y-2">
							<div
								v-for="user in availableUsers"
								:key="user.userId"
								class="flex items-center"
							>
								<input
									:id="`assignee-${user.userId}`"
									v-model="form.assignee"
									type="checkbox"
									:value="user.userId"
									class="mr-2"
								/>
								<label :for="`assignee-${user.userId}`">{{ user.name }}</label>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-6 flex justify-end space-x-2">
					<button
						type="button"
						@click="toggleOpenFormModal"
						class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						{{ isNewTask ? "Create" : "Update" }}
					</button>
					<button
						v-if="!isNewTask"
						type="button"
						@click="deleteTask"
						class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
					>
						Delete
					</button>
				</div>
			</form>
		</div> -->
		<div class="text-white">Open Already modal</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { Board, Task, User } from "~/types";
import { useAuthStore } from "~/store/auth";
import { useBoardStore } from "~/store/board";
const availableUsers = [];

const props = defineProps({
	showAddTaskModal: Boolean,
	isNewTask: Boolean,
	columnId: String,
});

const emit = defineEmits(["update:showAddTaskModal", "update:isNewTask"]);

const toggleOpenFormModal = () => {
	emit("update:showAddTaskModal", !props.showAddTaskModal); // onChange in react but easier
};

// const props = defineProps({
// 	task: {
// 		type: Object as PropType<Task | null>,
// 		default: null,
// 	},
// 	columnId: {
// 		type: String,
// 		default: "",
// 	},
// 	boardId: {
// 		type: String,
// 		required: true,
// 	},
// 	isOpen: {
// 		type: Boolean,
// 		required: true,
// 	},
// });

// const emit = defineEmits(["close", "task-created", "task-updated", "task-deleted"]);

const authStore = useAuthStore();
const boardStore = useBoardStore();

// Form state
const form = reactive({
	taskName: "",
	description: "",
	priority: "medium" as "low" | "medium" | "high",
	status: "todo" as "todo" | "In progress" | "completed",
	dueDate: "",
	assignee: [] as string[],
});

// const isNewTask = computed(() => !props.task);

// Available users for assignment (owner + board members)

// const availableUsers = computed(() => {
// 	const storage = useStorage() as any;
// 	const data = storage.getData();

// 	const board = data.boards.find((b: Board) => b.boardId === props.boardId);
// 	if (!board) return [];

// 	const owner = data.users.find((u: User) => u.userId === board.owner);
// 	const members = board.people.map((userId: string) => data.users.find((u: User) => u.userId === userId));
// 	return [...(owner ? [owner] : []), ...members.filter(Boolean)];
// });

// Initialize form when props change
// watch(
// 	() => props.task,
// 	(task) => {
// 		if (task) {
// 			form.taskName = task.taskName;
// 			form.description = task.description || "";
// 			form.priority = task.priority;
// 			form.status = task.status;
// 			form.dueDate = task.dueDate || "";
// 			form.assignee = [...task.assignee];
// 		} else {
// 			resetForm();
// 		}
// 	},
// 	{ immediate: true }
// );

// Methods
// const resetForm = () => {
// 	form.taskName = "";
// 	form.description = "";
// 	form.priority = "medium";
// 	form.status = "todo";
// 	form.dueDate = "";
// 	form.assignee = [];
// };

// const closeModal = () => {
// 	emit("close");
// };

const submitForm = async () => {
	try {
		if (props.isNewTask) {
			if (props.columnId) {
				const newTask = boardStore.addTask(props.columnId, {
					taskName: form.taskName,
					description: form.description,
					priority: form.priority,
					status: form.status,
					dueDate: form.dueDate,
					assignee: form.assignee,
				});
			}

			// emit("task-created", newTask);
		} else {
			const updatedTask = boardStore.updateTask(props.task!.taskId, {
				taskName: form.taskName,
				description: form.description,
				priority: form.priority,
				status: form.status,
				dueDate: form.dueDate,
				assignee: form.assignee,
				// columnId: props.task!.columnId,
			});
			// emit("task-updated", updatedTask);
		}
		toggleOpenFormModal();
	} catch (error) {
		console.error("Failed to save task:", error);
	}
};

// const deleteTask = async () => {
// 	if (!props.task) return;

// 	if (confirm("Are you sure you want to delete this task?")) {
// 		try {
// 			await boardStore.deleteTask(props.task.taskId);
// 			emit("task-deleted", props.task.taskId);
// 			closeModal();
// 		} catch (error) {
// 			console.error("Failed to delete task:", error);
// 		}
// 	}
// };
</script>
