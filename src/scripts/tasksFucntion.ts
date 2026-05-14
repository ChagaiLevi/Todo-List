import { type SavedTaskProps } from "./types.ts";

export const createTaskDetails = (date = new Date()) => ({
  createdAt: date.getTime(),
  detailsDate: new Intl.DateTimeFormat("en-GB").format(date),
  detailsTime: new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date),
});

const parseLegacyTaskDate = (detailsDate?: string, detailsTime?: string) => {
  if (!detailsDate) return null;

  const [day, month, year] = detailsDate.split("/").map(Number);
  const [hour = 0, minute = 0] = detailsTime?.split(":").map(Number) ?? [];

  if (!day || !month || !year) return null;

  const parsedDate = new Date(year, month - 1, day, hour, minute);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const getSavedTaskDate = (task: SavedTaskProps) => {
  if (typeof task.createdAt === "number" && Number.isFinite(task.createdAt)) {
    return new Date(task.createdAt);
  }

  if (typeof task.createdAt === "string") {
    const timestamp = Number(task.createdAt);
    if (Number.isFinite(timestamp)) {
      return new Date(timestamp);
    }

    const parsedDate = new Date(task.createdAt);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return parseLegacyTaskDate(task.detailsDate, task.detailsTime) ?? new Date();
};