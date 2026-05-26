import { type Dispatch, type SetStateAction } from "react";
import { type TaskSortOption } from "../types";

type TaskFiltersProps = {
  sorting: TaskSortOption;
  setSorting: Dispatch<SetStateAction<TaskSortOption>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

const TaskFilters = ({
  sorting,
  setSorting,
  search,
  setSearch,
}: TaskFiltersProps) => {
  const isSearchActive = search.trim().length > 0;

  return (
    <div className="todo-filters">
      <span
        style={isSearchActive ? { pointerEvents: "none", cursor: "not-allowed" } : undefined}
      >
        <select
          id="sort-select"
          className="filter-select"
          value={sorting}
          onChange={(event) => setSorting(event.target.value as TaskSortOption)}
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
        onChange={(event) => setSearch(event.target.value)}
      />

      <button type="button" id="search-btn" onClick={() => setSearch((currentSearch) => currentSearch.trim())}>
        Search
      </button>
    </div>
  );
};

export default TaskFilters;
