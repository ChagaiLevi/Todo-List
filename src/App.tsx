import Title from "./Components/Title";
import AddTask from "./features/tasks/components/AddTask";
import TaskDetailsPopover from "./features/tasks/components/TaskDetailsPopover";
import TaskFilters from "./features/tasks/components/TaskFilters";
import TaskList from "./features/tasks/components/TaskList";
import UndoToast from "./features/tasks/components/UndoToast";
import { buildTask } from "./features/tasks/lib/taskFactory";
import { useTaskDetailsPopover } from "./features/tasks/hooks/useTaskDetailsPopover";
import { useTasks } from "./features/tasks/hooks/useTasks";
import { useUndoToasts } from "./features/tasks/hooks/useUndoToasts";

function App() {
  const {
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
  } = useTasks();
  const { toasts, setToasts, showUndoableToast, startExit } = useUndoToasts(setTasks);
  const {
    detailsPopover,
    detailsPopoverRef,
    transitionInProgressRef,
    setDetailsPopover,
    hideDetailsPopover,
    handleDetailsClick,
  } = useTaskDetailsPopover();

  const handleAddTask = () => {
    if (!draftText.trim()) return;

    const newTask = buildTask(draftText);

    showUndoableToast({
      action: () => setTasks((prev) => [...prev, newTask]),
      previousTasks: tasks,
      text: "Task added",
    });

    if (search.trim()) {
      setSearch("");
      setSorting("customer");
      hideDetailsPopover();
    }

    setDraftText("");
  };

  return (
    <>
      <div className="container">
        <Title />
        <AddTask addTask={handleAddTask} setText={setDraftText} text={draftText} />
        <TaskFilters
          search={search}
          setSearch={setSearch}
          sorting={sorting}
          setSorting={setSorting}
        />
        <TaskList
          tasks={visibleTasks}
          allTasks={tasks}
          canDrag={canDrag}
          search={search}
          setTasks={setTasks}
          setToasts={setToasts}
          showUndoableToast={showUndoableToast}
          onDetailsClick={handleDetailsClick}
        />
        <TaskDetailsPopover
          detailsPopover={detailsPopover}
          detailsPopoverRef={detailsPopoverRef}
          transitionInProgressRef={transitionInProgressRef}
          setDetailsPopover={setDetailsPopover}
        />
      </div>
      <UndoToast toasts={toasts} setToasts={setToasts} startExit={startExit} />
    </>
  );
}

export default App;
