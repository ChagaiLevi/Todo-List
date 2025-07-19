import Title from "./Components/Title"
import AddTask from "./Components/AddTask"
import ListTasks from "./Components/ListTasks"

function App() {

  return (
    <div className="container">
      <Title />
      <AddTask />
      <ListTasks />
    </div>
  )
}

export default App