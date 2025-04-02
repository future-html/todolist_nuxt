// ~/services/storage.ts
import type { User, Board, Column, Task } from "../types/index";
type DataStructure = {
	users: User[];
	boards: Board[];
	columns: Column[];
	tasks: Task[];
};

interface StorageInterface {
	getAuth: () => User | null;
	getData: () => DataStructure;
	saveData: (data: DataStructure) => void;
}

const STORAGE_KEY = "kanban-app-data";
// ~/services/storage.ts
export const useStorage = () => {
	const getAuth = () => {
		if (process.client) {
			const data = localStorage.getItem("auth");
			return data ? JSON.parse(data) : null;
		}
	};
	const getData = (): DataStructure => {
		if (process.client) {
			// Only run on client side
			try {
				const data = localStorage.getItem("kanban-app-data");
				return data
					? JSON.parse(data)
					: {
							users: [],
							boards: [],
							columns: [],
							tasks: [],
					  };
			} catch (e) {
				console.error("Failed to parse stored data", e);
			}
		}
		return {
			users: [],
			boards: [],
			columns: [],
			tasks: [],
		};
	};

	const saveData = (data: DataStructure) => {
		if (process.client) {
			// Only run on client side
			try {
				localStorage.setItem("kanban-app-data", JSON.stringify(data));
			} catch (e) {
				console.error("Failed to save data", e);
			}
		}
	};

	return {
		getAuth,
		getData,
		saveData,
	};
};
