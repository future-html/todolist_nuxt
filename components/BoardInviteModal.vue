<!-- ~/components/BoardInviteModal.vue -->
<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
	>
		<div class="bg-white p-6 rounded-lg max-w-md w-full">
			<h2 class="text-xl font-semibold mb-4">Invite Members to {{ board?.boardName }}</h2>

			<UserSearch
				:boardId="boardId"
				:existingMembers="board?.people || []"
				@update:members="handleMembersUpdate"
			/>

			<div class="mt-4 flex justify-end gap-2">
				<button
					@click="close"
					class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
				>
					Cancel
				</button>
				<button
					@click="inviteMembers"
					class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					:disabled="isInviting"
				>
					<span v-if="isInviting">Sending...</span>
					<span v-else>Invite Members</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useBoardStore } from "~/store/board";
import UserSearch from "./UserSearch.vue";
const props = defineProps({
	boardId: {
		type: String,
		required: true,
	},
	isOpen: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits(["close", "invited"]);

const boardStore = useBoardStore();
const selectedMembers = ref<string[]>([]);
const isInviting = ref(false);

const board = computed(() => {
	return boardStore.boards.find((b) => b.boardId === props.boardId);
});


const handleMembersUpdate = (members: string[]) => {
	selectedMembers.value = members;
};

const inviteMembers = async () => {
	if (!selectedMembers.value.length) return;

	try {

// console.loglog(board, 'baird')
		isInviting.value = true;
		await boardStore.inviteMembers(props.boardId, selectedMembers.value);
		emit("invited");
		close();
	} catch (error) {
		console.error("Failed to invite members:", error);
		// Show error to user
	} finally {
		isInviting.value = false;
	}
};

const close = () => {
	selectedMembers.value = [];
	emit("close");
};
</script>
