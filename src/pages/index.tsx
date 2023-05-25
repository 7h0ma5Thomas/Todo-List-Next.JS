

import { useState } from 'react'
import TodoRow from '@/components/TodoRow'
import EditTodo from '@/components/EditTodo'
import Search from '@/components/Search'
import supabase from '../Lib/supabase'
import { GetStaticProps } from "next";
import { createSupaTodo, deleteSupaTodo, checkSupaTodo, updateSupaTodo } from '../Lib/supabase'
import { ToastContainer, toast } from 'react-toastify'

export default function Home({ data }) {
  const [todos, setTodos] = useState(data)
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)

  const notify = () => toast("Wow so easy !", { position: toast.POSITION.TOP_CENTER });


  const handleCreateTodo = async (todo) => {
    setTodos([...todos, todo].sort((a, b) => a.name.localeCompare(b.name)))

    await createSupaTodo(todo);
  }

  const handleSubmit = (todo) => {
    if (selectedTodo === null) {
      handleCreateTodo(todo)
    } else {
      handleEdit(todo)
    }
  }

  const handleDeleteTodo = async (id) => {
    const newTodos = [
      ...todos
    ]
    const todosIndex = todos.findIndex((todo) => id === todo.id)
    newTodos.splice(todosIndex, 1)
    setTodos(newTodos)

    await deleteSupaTodo(id);
  }

  const handleCheckTodo = async (id) => {
    const newTodos = [
      ...todos
    ]
    
    const todosIndex = todos.findIndex((todo) => id === todo.id)
    newTodos[todosIndex].completed = !newTodos[todosIndex].completed
    setTodos(newTodos)

    try {
      await checkSupaTodo("dsfdsfdsfdsfdsfsdf",newTodos[todosIndex].completed);
      
    } catch (error) {
      console.log('error index', error)
      notify()
    }
  }
  
  const handleEdit = async (updatedTodo) => {
    if (selectedTodo === null) return

    await updateSupaTodo(updatedTodo, selectedTodo);
  
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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await supabase
    .from('todos')
    .select()
    console.log(data);
    
  return { props: { data } };
};