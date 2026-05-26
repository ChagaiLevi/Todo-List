import { type Task, type TaskSortOption } from "../types";

export const sortTasks = (tasks: Task[], sorting: TaskSortOption) => {
  if (sorting === "customer") {
    return tasks.slice().reverse();
  }

  if (sorting === "A-Z") {
    return tasks.slice().sort((a, b) => a.text.localeCompare(b.text));
  }

  if (sorting === "Z-A") {
    return tasks.slice().sort((a, b) => b.text.localeCompare(a.text));
  }

  return tasks.slice().sort((a, b) => (
    sorting === "date" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
  ));
};
