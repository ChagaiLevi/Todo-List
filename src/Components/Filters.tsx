import React, { useCallback, useEffect } from "react";
import Fuse from "fuse.js";
import { type FiltersProps, type TasksListProps } from "../scripts/types.ts";

const Filters: React.FC<FiltersProps> = ({
  setSorting,
  sorting,
  search,
  setSearch,
  tasks,
  setFilteredTasks,
}) => {
  const searchFunction = useCallback((searchValue = search) => {
    if (!searchValue.trim()) {
      setFilteredTasks?.(null);
      return;
    }

    setSorting('search');

    const fuse = new Fuse<TasksListProps>(tasks, {
      keys: ["text"],
      threshold: 0.4,
    });

    const results = fuse.search(searchValue);
    setFilteredTasks?.(results.map((result) => result.item));
  }, [search, setFilteredTasks, setSorting, tasks]);

  useEffect(() => {
    if (search.trim()) searchFunction(search);
  }, [search, searchFunction, tasks]);

  return (
    <div className="todo-filters">
      <span style={sorting === 'search' ? { pointerEvents: 'none', cursor: 'not-allowed', } : {}}>
        <select
          id="sort-select"
          className="filter-select"
          value={sorting}
          onChange={(e) => setSorting(e.target.value)}
        >
          <option value="customer">customer</option>
          <option value="A-Z">A - Z</option>
          <option value="Z-A">Z - A</option>
          <option value="date">Creation date</option>
          <option value="date-reverse">Reverse creation date</option>
        </select>
      </span>

      <input
        id="search-input"
        type="text"
        placeholder="Search tasks"
        className="filter-input"
        value={search}
        onChange={(e) => {
          const nextSearch: string = e.target.value;
          if (!nextSearch.trim()) {
            setFilteredTasks?.(null);
          }
          setSearch(nextSearch);
        }}
        onKeyDown={(e) => {
          const nextSearch: string = (e.target as HTMLInputElement).value;

          if (nextSearch.trim().length === 1) {
            setSorting("customer");
          }
        }}
      />

      <button id="search-btn" onClick={() => searchFunction()}>
        Search
      </button>
    </div>
  );
};

export default Filters;
