import Fuse from "fuse.js";
import { type TasksListProps } from "../App";

type FiltersProps = {
  setSorting: React.Dispatch<React.SetStateAction<string>>;
  sorting: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
}

const Filters: React.FC<FiltersProps> = ({ setSorting, sorting, search, setSearch, tasks, setTasks }) => {
  const fuse = new Fuse(tasks, {
    keys: ["text"],
    includeScore: true,
    includeMatches: true, // חשוב ל-highlight
    threshold: 0.4, // כמה "רחוק" מותר
  });

  console.log("Fuse instance:", fuse);

  const searchTasks = (query: string) => {
    const results = fuse.search(query);

    return {
      results,
      rest: tasks.filter(
        task => !results.find(r => r.item.id === task.id)
      ),
    };
  };

  const highlightFuse = (
    text: string,
    matches: readonly [number, number][]
  ) => {
    let lastIndex = 0;
    const parts = [];

    matches.forEach(([start, end], i) => {
      // טקסט רגיל
      if (lastIndex < start) {
        parts.push(text.slice(lastIndex, start));
      }

      // טקסט מודגש
      parts.push(
        <span key={i} style={{ backgroundColor: "yellow" }}>
          {text.slice(start, end + 1)}
        </span>
      );

      lastIndex = end + 1;
    });

    // שאר הטקסט
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
  };

  const { results } = searchTasks('l');

  // setSorting('search');



  return (
    <div className="todo-filters">
      <select
        id="sort-select"
        className="filter-select"
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
      >
        <option value='customer'>customer</option>
        <option value='A-Z' >A - Z</option>
        <option value='Z-A'>Z - A</option>
        <option value='date'>Creation date</option>
        <option value='date-reverse'>Reverse creation date</option>
      </select>
      <input id="search-input" type="text" placeholder="Search tasks" className="filter-input" value={search} onChange={(e) => setSearch(e.target.value)} />
      <button id="search-btn">Search</button>
    </div>
  )
}

export default Filters
