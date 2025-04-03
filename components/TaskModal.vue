<template>
	<!-- Backdrop -->
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<!-- Modal Container -->
		<div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-sea-blue-500">
			<!-- Modal Header -->
			<div class="flex justify-between items-center p-4 border-b border-sea-blue-700">
				<h2 class="text-xl font-bold text-white">Create New Task</h2>
				<button class="text-sea-blue-300 hover:text-white">
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

			<!-- Modal Body -->
			<div class="p-4 space-y-4">
				<!-- Task Name -->
				<div>
					<label class="block text-sm font-medium text-sea-blue-200 mb-1">Task Name</label>
					<input
						type="text"
						class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-sea-blue-500"
						placeholder="Enter task name"
					/>
				</div>

				<!-- Description -->
				<div>
					<label class="block text-sm font-medium text-sea-blue-200 mb-1">Description</label>
					<textarea
						rows="3"
						class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-sea-blue-500"
						placeholder="Task description..."
					></textarea>
				</div>

				<!-- Priority & Status -->
				<div class="grid grid-cols-2 gap-4">
					<!-- Priority -->
					<div>
						<label class="block text-sm font-medium text-sea-blue-200 mb-1">Priority</label>
						<select
							class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-sea-blue-500"
						>
							<option
								class="bg-gray-800"
								value="low"
							>
								Low
							</option>
							<option
								class="bg-gray-800"
								value="medium"
							>
								Medium
							</option>
							<option
								class="bg-gray-800"
								value="high"
							>
								High
							</option>
						</select>
					</div>

					<!-- Status -->
					<div>
						<label class="block text-sm font-medium text-sea-blue-200 mb-1">Status</label>
						<select
							class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-sea-blue-500"
						>
							<option
								class="bg-gray-800"
								value="todo"
							>
								To Do
							</option>
							<option
								class="bg-gray-800"
								value="progress"
							>
								In Progress
							</option>
							<option
								class="bg-gray-800"
								value="done"
							>
								Completed
							</option>
						</select>
					</div>
				</div>

				<!-- Due Date -->
				<div>
					<label class="block text-sm font-medium text-sea-blue-200 mb-1">Due Date</label>
					<input
						type="date"
						class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-sea-blue-500"
					/>
				</div>

				<!-- Assignees -->
				<div>
					<label class="block text-sm font-medium text-sea-blue-200 mb-1">Assign To</label>
					<div class="space-y-2">
						<div class="flex items-center">
							<input
								type="checkbox"
								id="user1"
								class="h-4 w-4 text-sea-blue-600 border-gray-600 rounded bg-gray-700 focus:ring-sea-blue-500"
							/>
							<label
								for="user1"
								class="ml-2 text-sm text-white"
								>John Doe</label
							>
						</div>
						<div class="flex items-center">
							<input
								type="checkbox"
								id="user2"
								class="h-4 w-4 text-sea-blue-600 border-gray-600 rounded bg-gray-700 focus:ring-sea-blue-500"
							/>
							<label
								for="user2"
								class="ml-2 text-sm text-white"
								>Jane Smith</label
							>
						</div>
						<div class="flex items-center">
							<input
								type="checkbox"
								id="user3"
								class="h-4 w-4 text-sea-blue-600 border-gray-600 rounded bg-gray-700 focus:ring-sea-blue-500"
							/>
							<label
								for="user3"
								class="ml-2 text-sm text-white"
								>Mike Johnson</label
							>
						</div>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="flex justify-end p-4 border-t border-sea-blue-700 space-x-3">
				<button
					@click="closeModal"
					class="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-md transition"
				>
					Cancel
				</button>
				<button class="px-4 py-2 text-white bg-sea-blue-600 hover:bg-sea-blue-500 rounded-md transition">
					Create Task
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps(["showTaskModal"]);
const emit = defineEmits(["close"]);
const closeModal = () => {
	emit("close");
};
</script>
