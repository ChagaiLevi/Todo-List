import { useEffect, useState } from "react";
import { filterTasksBySearch } from "../lib/taskSearch";
import { sortTasks } from "../lib/taskSort";
import { loadStoredTasks, saveTasks } from "../lib/taskStorage";
import { type Task, type TaskSortOption } from "../types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadStoredTasks);
  const [draftText, setDraftText] = useState("");
  const [sorting, setSorting] = useState<TaskSortOption>("customer");
  const [search, setSearch] = useState("");

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const searchResults = filterTasksBySearch(tasks, search);
  const visibleTasks = searchResults ?? sortTasks(tasks, sorting);
  const canDrag = !search.trim() && sorting === "customer";

  return {
    tasks,
    setTasks,
    draftText,
    setDraftText,
    sorting,
    setSorting,
    search,
    setSearch,
    visibleTasks,
    canDrag,
  };
};
