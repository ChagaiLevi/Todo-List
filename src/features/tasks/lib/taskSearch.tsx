import { type ReactNode } from "react";
import Fuse from "fuse.js";
import { type Task } from "../types";

const getSequentialMatchIndexes = (text: string, query: string): number[] => {
  const loweredText = text.toLowerCase();
  const loweredQuery = query.toLowerCase();
  const matchedIndexes: number[] = [];
  let searchStartIndex = 0;

  for (const character of loweredQuery) {
    const matchIndex = loweredText.indexOf(character, searchStartIndex);

    if (matchIndex === -1) continue;

    matchedIndexes.push(matchIndex);
    searchStartIndex = matchIndex + 1;
  }

  return matchedIndexes;
};

const getHighlightIndexes = (text: string, searchValue: string): number[] => {
  const uniqueIndexes = new Set<number>();
  const searchTerms = searchValue.trim().toLowerCase().split(/\s+/).filter(Boolean);

  searchTerms.forEach((term) => {
    getSequentialMatchIndexes(text, term).forEach((index) => uniqueIndexes.add(index));
  });

  return [...uniqueIndexes].sort((a, b) => a - b);
};

export const filterTasksBySearch = (tasks: Task[], searchValue: string) => {
  if (!searchValue.trim()) return null;

  const fuse = new Fuse<Task>(tasks, {
    keys: ["text"],
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
  });

  return fuse.search(searchValue).map((result) => result.item);
};

export const renderHighlightedTaskText = (
  text: string,
  searchValue: string,
  taskId: string
) => {
  const highlightIndexes = getHighlightIndexes(text, searchValue);
  if (highlightIndexes.length === 0) return text;

  const highlightedIndexSet = new Set(highlightIndexes);
  const segments: ReactNode[] = [];
  let segmentStart = 0;
  let keyIndex = 0;

  for (let index = 0; index < text.length; index += 1) {
    const isHighlighted = highlightedIndexSet.has(index);
    const previousHighlighted = highlightedIndexSet.has(index - 1);

    if (isHighlighted && !previousHighlighted && segmentStart < index) {
      segments.push(text.slice(segmentStart, index));
      segmentStart = index;
    }

    const nextHighlighted = highlightedIndexSet.has(index + 1);

    if (isHighlighted && !nextHighlighted) {
      segments.push(
        <span
          key={`${taskId}-highlight-${keyIndex}`}
          className="task-search-highlight"
        >
          {text.slice(segmentStart, index + 1)}
        </span>
      );
      keyIndex += 1;
      segmentStart = index + 1;
    }
  }

  if (segmentStart < text.length) {
    segments.push(text.slice(segmentStart));
  }

  return segments;
};
