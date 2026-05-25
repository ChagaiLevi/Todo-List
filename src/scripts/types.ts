// Types of Data

export type TasksListProps = {
  id: string;
  text: string;
  completed: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  isRestored?: boolean;
  createdAt: number;
  detailsDate: string;
  detailsTime: string;
};

export type numberMessagesProps = {
  id: string;
  text: string;
  style: React.CSSProperties;
  timeOut: ReturnType<typeof setTimeout> | undefined;
  prevTasks: TasksListProps[];
  deleteTimeout?: ReturnType<typeof setTimeout>;
  didUndo?: boolean;
  isExiting?: boolean;
};

export type SavedTaskProps = Omit<TasksListProps, "createdAt" | "detailsDate" | "detailsTime"> & {
  createdAt?: number | string;
  detailsDate?: string;
  detailsTime?: string;
};

export type DetailsPopupStateProps = {
  isMounted: boolean;
  isVisible: boolean;
  left: number;
  top: number;
  detailsDate: string;
  detailsTime: string;
};

// Types of Components Props

export type addTaskProps = {
  addTask: () => void;
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}

export type FiltersProps = {
  setSorting: React.Dispatch<React.SetStateAction<string>>;
  sorting: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  tasks: TasksListProps[];
  setFilteredTasks: React.Dispatch<React.SetStateAction<TasksListProps[] | null>>;
  filteredTasks: TasksListProps[] | null;
}

export type LineTasksProps = {
  task: TasksListProps;
  tasks: TasksListProps[];
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  message: (action: () => void, id: string, prevTasksOverride?: TasksListProps[]) => string;
  onDragHandleMouseDown: (event: React.MouseEvent, itemEl: HTMLElement) => void;
  onDetailsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  storing: string;
};

export type ListTasksProps = {
  tasks: TasksListProps[];
  sourceTasks?: TasksListProps[];
  preserveOrder?: boolean;
  setTasks: React.Dispatch<React.SetStateAction<TasksListProps[]>>;
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  message: (action: () => void, id: string, prevTasksOverride?: TasksListProps[]) => string;
  onDetailsClick: (task: TasksListProps, event: React.MouseEvent<HTMLButtonElement>) => void;
  sorting: string;
};

export type UndoToastProps = {
  numberMessages: numberMessagesProps[];
  setNumberMessages: React.Dispatch<React.SetStateAction<numberMessagesProps[]>>;
  startExit: (messageId: string, e: HTMLElement | null) => void;
}
