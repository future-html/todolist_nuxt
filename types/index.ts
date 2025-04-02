// ~/types/index.ts
export interface User {
	userId: string; // format: user-1, user-2, etc.
	name: string;
	email: string;
	password: string;
}

export interface Board {
	boardId: string; // format: board-1, board-2, etc.
	boardName: string;
	people: string[]; // array of userIds (not including owner)
	owner: string; // userId of owner
	createdAt?: string;
	updatedAt?: string;
}

export interface Column {
	columnId: string; // format: column-1, column-2, etc.
	boardId: string; // reference to board
	columnName: string;
}

export interface Task {
	taskId: string; // format: task-1, task-2, etc.
	columnId: string; // reference to column
	taskName: string;
	priority: "low" | "medium" | "high";
	status: "todo" | "In progress" | "completed";
	dueDate: string; // format: dd-mm-yy
	assignee: string[]; // array of userIds
}
