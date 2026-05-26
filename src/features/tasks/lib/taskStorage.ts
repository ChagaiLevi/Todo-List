import { createTaskDetails, getSavedTaskDate } from "./taskDetails";
import { normalizeTaskText } from "./taskText";
import { type SavedTask, type Task } from "../types";

const TASKS_STORAGE_KEY = "tasks";

export const loadStoredTasks = (): Task[] => {
  const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!savedTasks) return [];

  const parsedTasks: SavedTask[] = JSON.parse(savedTasks);

  return parsedTasks.map((task) => {
    const normalizedDate = getSavedTaskDate(task);
    const normalizedDetails = createTaskDetails(normalizedDate);

    return {
      ...task,
      text: normalizeTaskText(task.text),
      ...normalizedDetails,
    };
  });
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};
