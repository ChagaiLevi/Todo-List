import { v4 as uuidv4 } from "uuid";
import { createTaskDetails } from "./taskDetails";
import { type Task } from "../types";

export const buildTask = (text: string): Task => ({
  id: uuidv4(),
  text,
  completed: false,
  isEditing: false,
  isDeleting: false,
  isRestored: false,
  ...createTaskDetails(),
});
