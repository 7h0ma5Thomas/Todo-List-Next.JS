import { useEffect, useState } from 'react'
import TodoRow from '@/components/TodoRow'
import EditTodo from '@/components/EditTodo'
import Search from '@/components/Search'
import supabase from '../Lib/supabase'
import { GetStaticProps } from "next";
import { createSupaTodo, deleteSupaTodo, checkSupaTodo, updateSupaTodo } from '../Lib/supabase'
import { useTodos, Todo } from '@/Lib/todos'
import { ToastContainer, toast, Slide, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type HomeProps = {
  data: Todo[]
}

export default function Home({ data } : HomeProps) {
  
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { todos, initTodos, addTodo, deleteTodo, checkTodo, updateTodo } = useTodos()


  useEffect(() => {
    initTodos(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const notify = (message: string, type, transition = Slide) => {
    toast(message, {
      position: "top-right",
      type: type,
      transition: transition,
      theme: "colored"
    })
  }

  const handleSubmit = async (todo: Todo) => {
    if (selectedTodo === null) {
      // handleCreateTodo(todo)
      addTodo(todo)
      await createSupaTodo(todo).then((response) => {
        notify(response, "success")
      })
        .catch(error => {
        notify(error.message, "error")
      })
    } else {
      // handleEdit(todo)
      updateTodo(todo)
      await updateSupaTodo(todo).then((response) => {
        notify(response, "success")
      })
        .catch(error => {
        notify(error.message, "error")
      })
    }
    setSelectedTodo(null)
  }

  const handleDeleteTodo = async (id: string) => {
    deleteTodo(id)
    await deleteSupaTodo(id).then((response) => {
      notify(response, "success")
    })
      .catch(error => {
      notify(error.message, "error")
    })
  }

  const handleCheckTodo = async (id: string) => {
    
    const completed = checkTodo(id)
    await checkSupaTodo(id, completed).then((response) => {
      console.log(response);
    })
      .catch(error => {
        console.log(error);
    })
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
          <button className='button' onClick={() => setShowModal(true)}>Ajouter</button>
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
        <div className='pulse'></div>
        <ToastContainer />
      </main>
        {showModal && <EditTodo 
          onSubmit={(todo) => handleSubmit(todo)} 
          todo={selectedTodo}
          onClose={() => setShowModal(false)}
          notify={notify}
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