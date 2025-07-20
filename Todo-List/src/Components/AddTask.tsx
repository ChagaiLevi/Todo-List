const AddTask: React.FC<{ addTask: () => void; setText: React.Dispatch<React.SetStateAction<string>>, text: string }> = ({ addTask, setText, text }) => {
  return (
    <div className="todo-input">
      <input type="text" id="new-task" placeholder="Add a task" onChange={(e) => setText(e.target.value)} value={text} />
      <button id="add-btn" onClick={() => addTask()}>Add</button>
    </div>
  )
}

export default AddTask