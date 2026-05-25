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
  filteredTasks,
}) => {
  const searchFunction = useCallback((searchValue = search) => {
    if (!searchValue.trim()) {
      setFilteredTasks?.(null);
      return;
    }

    setSorting('search');

    const fuse = new Fuse<TasksListProps>(tasks, {
      keys: ["text"],
      includeScore: true,
      includeMatches: true,
      threshold: 0.4,
    });

    const results = fuse.search(searchValue);

    results.map((task) => {
      task.item.text = highlightTextReact(task.item.text, task.matches?.[0]?.indices || []) as unknown as string;

      return filteredTasks;
    });

    setFilteredTasks?.(results.map((result) => result.item));
  }, [search, setFilteredTasks, setSorting, tasks]);

  const highlightTextReact = (
    text: string,
    indices: readonly [number, number][]
  ) => {
    const elements: (string | React.JSX.Element)[] = [];
    let lastIndex = 0;

    indices.forEach(([start, end], i) => {
      elements.push(text.slice(lastIndex, start));
      elements.push(
        <span key={i} style={{ backgroundColor: "cyan", color: "black" }}>
          {text.slice(start, end + 1)}
        </span>
      );
      lastIndex = end + 1;
    });

    elements.push(text.slice(lastIndex));

    return elements;
  };

  const extractText = (nodes: React.ReactNode[]): string => {
    return React.Children.toArray(nodes)
      .map((node) => {
        if (typeof node === "string") return node;
        if (typeof node === "number") return node.toString();

        if (React.isValidElement(node)) {
          const element = node as React.ReactElement<any>;

          return extractText(element.props.children);
        }

        return "";
      })
      .join("");
  }

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

            tasks.map((task) => {
              task.text = extractText(task.text as unknown as React.ReactNode[]);
              return task;
            });
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
