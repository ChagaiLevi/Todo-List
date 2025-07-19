const ListTasks = () => {
  return (
    <div className="todo-list">
      <div className="todo-item">
        <p className="task-text">Complete the project work that needs more space and longer descriptions.</p>
        <div className="actions">
          <button className="edit-btn">✎</button>
          <button className="complete-btn">✔</button>
          <button className="delete-btn">✖</button>
        </div>
      </div>
      <div className="todo-item">
        <p className="task-text">Check all the emails for the day and respond accordingly.</p>
        <div className="actions">
          <button className="edit-btn">✎</button>
          <button className="complete-btn">✔</button>
          <button className="delete-btn">✖</button>
        </div>
      </div>
      <div className="todo-item">
        <p className="task-text">Learn about new technologies such as AI, machine learning, and blockchain.</p>
        <div className="actions">
          <button className="edit-btn">✎</button>
          <button className="complete-btn">✔</button>
          <button className="delete-btn">✖</button>
        </div>
      </div>
    </div>
  )
}

export default ListTasks