type addTaskProps = {
  addTask: () => void;
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}

const AddTask: React.FC<addTaskProps> = ({ addTask, setText, text }) => {
  return (
    <div className="todo-input">
      <input
        type="text"
        id="new-task"
        placeholder="Add a task"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        value={text}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addTask()} />
      <button
        id="add-btn"
        onClick={() => addTask()}
      >Add</button>
    </div>
  )
}

export default AddTask