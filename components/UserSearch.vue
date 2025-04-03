<!-- ~/components/UserSearch.vue -->
<template>
	<div class="user-search">
		<input
			v-model="searchQuery"
			@input="searchUsers"
			placeholder="Search users by email"
			class="w-full p-2 border rounded"
		/>
		<div
			v-if="searchResults.length"
			class="mt-2 border rounded max-h-60 overflow-y-auto"
		>
			<div
				v-for="user in searchResults"
				:key="user.userId"
				class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
				@click="selectUser(user)"
			>
				<span>{{ user.name }} ({{ user.email }})</span>
				<!-- <button
					v-if="isSelected(user.userId)"
					@click.stop="removeUser(user.userId)"
					class="text-red-500 hover:text-red-700"
				>
					Remove
				</button> -->
				<button
					@click.stop="selectUser(user)"
					class="text-blue-500 hover:text-blue-700"
				>
					Add
				</button>
			</div>
		</div>
		<div
			v-else-if="searchQuery && !searchResults.length"
			class="mt-2 text-red-500"
		>
			User not found
		</div>
		<div
			v-if="selectedUsers.length"
			class="mt-2"
		>
			<h4 class="font-medium mb-1">Selected Members:</h4>
			<div
				v-for="userId in selectedUsers"
				:key="userId"
				class="flex items-center justify-between p-1"
			>
				<span>{{ getUserById(userId)?.name || "Unknown user" }}</span>
				<!-- <button
					@click="removeUser(userId)"
					class="text-red-500 hover:text-red-700 text-sm"
				>
					Remove
				</button> -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { User, Board } from "~/types";
import { useStorage } from "~/services/storage";
const props = defineProps({
	boardId: {
		type: String,
		required: true,
	},
	existingMembers: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
});

const emit = defineEmits(["update:members"]);

const searchQuery = ref("");
const searchResults = ref<User[]>([]);
const selectedUsers = ref<string[]>([]);

const response = useStorage() as any;
const getData = response.getData;

// Initialize with existing members
onMounted(() => {
	selectedUsers.value = [...props.existingMembers];
});

const searchUsers = () => {
	if (!searchQuery.value.trim()) {
		searchResults.value = [];
		return;
	}

	const data = getData();
	const filteredUsers = data.users.filter(
		(user: User) =>
			user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
			!selectedUsers.value.includes(user.userId) &&
			user.userId !== data.boards.find((b: Board) => b.boardId === props.boardId)?.owner
	);

	searchResults.value = filteredUsers;
};

const selectUser = (user: User) => {
	if (!selectedUsers.value.includes(user.userId)) {
		selectedUsers.value.push(user.userId);
		emit("update:members", selectedUsers.value);
		searchQuery.value = "";
		searchResults.value = [];
	}
};

const removeUser = (userId: string) => {
	selectedUsers.value = selectedUsers.value.filter((id) => id !== userId);
	emit("update:members", selectedUsers.value);
};

const isSelected = (userId: string) => {
	return selectedUsers.value.includes(userId);
};

const getUserById = (userId: string) => {
	const data = getData();
	const user = data.users.find((u: User) => u.userId === userId);
	if (!user) {
		console.warn(`User with ID ${userId} not found`);
	}
	return user;
};
</script>
