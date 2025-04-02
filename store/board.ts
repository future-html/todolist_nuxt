import { defineStore } from "pinia";
import { useStorage } from "~/services/storage";
import type { Board, Column, Task } from "~/types";
import { useAuthStore } from "./auth";
export const useBoardStore = defineStore("board", {
	state: () => ({
		boards: [] as Board[],
		columns: [] as Column[],
		tasks: [] as Task[],
	}),

	actions: {
		loadInitialData() {
			const storage = useStorage();
			const data = storage.getData();
			this.boards = data.boards;
			this.columns = data.columns;
			this.tasks = data.tasks;
		},

		createBoard(name: string, ownerId: string) {
			const storage = useStorage();
			const data = storage.getData();

			const boardId = `board-${Date.now()}`;
			const newBoard: Board = {
				boardId,
				boardName: name,
				people: [],
				owner: ownerId,
			};

			data.boards.push(newBoard);
			storage.saveData(data);
			this.boards = data.boards;

			return newBoard;
		},

		updateBoard(boardId: string, newName: string) {
			const storage = useStorage();
			const data = storage.getData();

			const boardIndex = data.boards.findIndex((b) => b.boardId === boardId);
			if (boardIndex === -1) throw new Error("Board not found");

			data.boards[boardIndex].boardName = newName;
			storage.saveData(data);
			this.boards = data.boards;

			return data.boards[boardIndex];
		},

		deleteBoard(boardId: string) {
			const storage = useStorage();
			const data = storage.getData();

			// Find board index
			const boardIndex = data.boards.findIndex((b) => b.boardId === boardId);
			if (boardIndex === -1) throw new Error("Board not found");

			// Get all columns for this board
			const boardColumns = data.columns.filter((c) => c.boardId === boardId);

			// Delete all tasks in these columns
			const columnIds = boardColumns.map((c) => c.columnId);
			data.tasks = data.tasks.filter((t) => !columnIds.includes(t.columnId));

			// Delete all columns
			data.columns = data.columns.filter((c) => c.boardId !== boardId);

			// Delete the board
			data.boards.splice(boardIndex, 1);

			// Save changes
			storage.saveData(data);
			this.boards = data.boards;
			this.columns = data.columns;
			this.tasks = data.tasks;
		},
		// ~/stores/board.ts (additional methods)
		updateColumn(columnId: string, newName: string) {
			const storage = useStorage();
			const data = storage.getData();

			const columnIndex = data.columns.findIndex((c) => c.columnId === columnId);
			if (columnIndex === -1) throw new Error("Column not found");

			data.columns[columnIndex].columnName = newName;
			storage.saveData(data);
			this.columns = data.columns;

			return data.columns[columnIndex];
		},

		deleteColumn(columnId: string) {
			const storage = useStorage();
			const data = storage.getData();

			// Find column index
			const columnIndex = data.columns.findIndex((c) => c.columnId === columnId);
			if (columnIndex === -1) throw new Error("Column not found");

			// Delete all tasks in this column
			data.tasks = data.tasks.filter((t) => t.columnId !== columnId);

			// Delete the column
			data.columns.splice(columnIndex, 1);

			// Save changes
			storage.saveData(data);
			this.columns = data.columns;
			this.tasks = data.tasks;
		},

		inviteUser(boardId: string, userId: string) {
			const storage = useStorage();
			const data = storage.getData();

			const board = data.boards.find((b) => b.boardId === boardId);
			if (!board) throw new Error("Board not found");

			// Only owner can invite
			const authStore = useAuthStore();
			console.log(board.owner, "owner");
			if (board.owner !== ((authStore.currentUser?.userId && authStore.currentUser) || storage.getAuth().userId)) {
				throw new Error("Only board owner can invite users");
			}

			if (!board.people.includes(userId)) {
				board.people.push(userId);
				storage.saveData(data);
				this.boards = data.boards;
			}
		},

		inviteMembers(boardId: string, userIds: string[]) {
			const storage = useStorage();
			const data = storage.getData();

			const board = data.boards.find((b) => b.boardId === boardId);

			console.log(board, "board in board.ts");
			if (!board) throw new Error("Board not found");

			// Only owner can invite members
			const authStore = useAuthStore();
			console.log(
				board.owner !== ((authStore.currentUser?.userId && authStore.currentUser) || storage.getAuth().userId)
			);
			if (board.owner !== ((authStore.currentUser?.userId && authStore.currentUser) || storage.getAuth().userId)) {
				throw new Error("Only board owner can invite members");
			}

			// Add new members (avoid duplicates)
			userIds.forEach((userId) => {
				if (!board.people.includes(userId)) {
					board.people.push(userId);
				}
			});

			storage.saveData(data);
			this.boards = data.boards;
		},

		removeMember(boardId: string, userId: string) {
			const storage = useStorage();
			const data = storage.getData();

			const board = data.boards.find((b) => b.boardId === boardId);
			if (!board) throw new Error("Board not found");

			// Only owner can remove members
			const authStore = useAuthStore();
			if (board.owner !== ((authStore.currentUser && authStore.currentUser?.userId) || storage.getAuth().userId)) {
				throw new Error("Only board owner can remove members");
			}

			board.people = board.people.filter((id) => id !== userId);
			storage.saveData(data);
			this.boards = data.boards;
		},

		addColumn(boardId: string, name: string) {
			const storage = useStorage();
			const data = storage.getData();

			const columnId = `column-${Date.now()}`;
			const newColumn: Column = {
				columnId,
				boardId,
				columnName: name,
			};

			data.columns.push(newColumn);
			storage.saveData(data);
			this.columns = data.columns;

			return newColumn;
		},

		addTask(columnId: string, taskData: Omit<Task, "taskId" | "columnId">) {
			const storage = useStorage();
			const data = storage.getData();

			const taskId = `task-${Date.now()}`;
			const newTask: Task = {
				taskId,
				columnId,
				...taskData,
			};

			data.tasks.push(newTask);
			storage.saveData(data);
			this.tasks = data.tasks;

			return newTask;
		},

		moveTask(taskId: string, newColumnId: string, newPosition: number) {
			const storage = useStorage();
			const data = storage.getData();

			const taskIndex = data.tasks.findIndex((t) => t.taskId === taskId);
			if (taskIndex === -1) throw new Error("Task not found");

			// Update task's column
			data.tasks[taskIndex].columnId = newColumnId;

			// Reorder tasks in the new column
			const columnTasks = data.tasks
				.filter((t) => t.columnId === newColumnId)
				.sort((a, b) => data.tasks.indexOf(a) - data.tasks.indexOf(b));

			// Remove the task temporarily
			const [task] = columnTasks.splice(
				columnTasks.findIndex((t) => t.taskId === taskId),
				1
			);

			// Insert at new position
			columnTasks.splice(newPosition, 0, task);

			// Update the tasks array with new order
			data.tasks = data.tasks.filter((t) => t.columnId !== newColumnId).concat(columnTasks);

			storage.saveData(data);
			this.tasks = data.tasks;
		},
	},

	getters: {
		getUserBoards: (state) => (userId: string) => {
			return state.boards.filter((board) => board.owner === userId || board.people.includes(userId));
		},

		getBoardColumns: (state) => (boardId: string) => {
			return state.columns.filter((column) => column.boardId === boardId);
		},

		getColumnTasks: (state) => (columnId: string) => {
			return state.tasks.filter((task) => task.columnId === columnId);
		},

		getTask: (state) => (taskId: string) => {
			return state.tasks.find((task) => task.taskId === taskId);
		},
	},
});
