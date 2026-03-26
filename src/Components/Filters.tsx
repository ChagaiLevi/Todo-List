type FiltersProps = {
  setSorting: React.Dispatch<React.SetStateAction<string>>;
  sorting: string;
}

const Filters: React.FC<FiltersProps> = ({ setSorting, sorting }) => {
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
      <input id="search-input" type="text" placeholder="Search tasks" className="filter-input" />
      <button id="search-btn">Search</button>
    </div>
  )
}

export default Filters
