import initialTodos from '@/data/todos'
import { useState } from 'react'
import TodoRow from '@/components/TodoRow'
import EditTodo from '@/components/EditTodo'
import Search from '@/components/Search'

export default function Home() {
  const [todos, setTodos] = useState(initialTodos)
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleCreateTodo = (todo) => {
    setTodos([...todos, todo].sort((a, b) => a.name.localeCompare(b.name)))
  }

  const handleSubmit = (todo) => {
    if (selectedTodo === null) {
      handleCreateTodo(todo)
    } else {
      handleEdit(todo)
    }
  }

  const handleDeleteTodo = (id) => {
    const newTodos = [
      ...todos
    ]
    const todosIndex = todos.findIndex((todo) => id === todo.id)
    newTodos.splice(todosIndex, 1)
    setTodos(newTodos)
  }

  const handleCheckTodo = (id) => {
    const newTodos = [
      ...todos
    ]
    const todosIndex = todos.findIndex((todo) => id === todo.id)
    newTodos[todosIndex].completed = !newTodos[todosIndex].completed
    setTodos(newTodos)
  }
  
  const handleEdit = (updatedTodo) => {
    if (selectedTodo === null) return
    const newTodos = [
      ...todos
    ]
    const todosIndex = todos.findIndex((todo) => selectedTodo.id === todo.id)
    newTodos[todosIndex] = updatedTodo
    setTodos(newTodos)
    setSelectedTodo(null)
  } 

  const handleFilterTodo = (searchTodo) => {
    setSearchText(searchTodo)
  }
  
  const filteredTodos = todos.filter((todo) =>
    todo.name.toLowerCase().includes(searchText.toLowerCase()) || 
    todo.content.toLowerCase().includes(searchText.toLowerCase())  
  )

  const handleShowModal = (todo) => {
    setSelectedTodo(todo)
    setShowModal(true)
  }
  
  return (
    <>
      <main className='mainContainer'>
      <h1 className='mainTitle'>Ma Todo Liste !</h1>
      <Search 
        onChange={(searchTodo) => handleFilterTodo(searchTodo)} 
      />
      <div className='todosContainer'>
        <button onClick={() => setShowModal(true)}>Ajouter</button>
        <div className='allTodos'>
          {filteredTodos.map((todo) => (
              < TodoRow 
                key={todo.id} 
                todo={todo}
                onDeleteTodo={() => handleDeleteTodo(todo.id)}
                onChange={() => handleCheckTodo(todo.id)}
                onShow={() => handleShowModal(todo)}
              />
            ))}
        </div> 
      </div>
      </main>
      {showModal && <EditTodo 
          onSubmit={(todo) => handleSubmit(todo)} 
          todo={selectedTodo}
          onClose={() => setShowModal(false)}
        />}
    </>
    
  )
}
