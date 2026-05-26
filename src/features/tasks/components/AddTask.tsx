import { type Dispatch, type KeyboardEvent, type SetStateAction } from "react";

type AddTaskProps = {
  addTask: () => void;
  setText: Dispatch<SetStateAction<string>>;
  text: string;
};

const AddTask = ({ addTask, setText, text }: AddTaskProps) => {
  return (
    <div className="todo-input">
      <input
        type="text"
        id="new-task"
        placeholder="Add a task"
        onChange={(event) => setText(event.target.value)}
        value={text}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => event.key === "Enter" && addTask()}
      />
      <button type="button" id="add-btn" onClick={addTask}>
        Add
      </button>
    </div>
  );
};

export default AddTask;
