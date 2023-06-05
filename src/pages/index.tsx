import { useEffect, useState } from 'react'
import TodoRow from '@/components/TodoRow'
import EditTodo from '@/components/EditTodo'
import Search from '@/components/Search'
import supabase from '../Lib/supabase'
import { GetServerSidePropsContext  } from "next";
import { createSupaTodo, deleteSupaTodo, checkSupaTodo, updateSupaTodo } from '../Lib/supabase'
import { useTodos, Todo } from '@/Lib/todos'
import { ToastContainer, toast, Slide, Zoom, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'

type HomeProps = {
  data: Todo[]
  session: any
}

export default function Home({ data, session } : HomeProps) {
  
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { todos, addTodo, deleteTodo, checkTodo, updateTodo } = useTodos(data)
  const router = useRouter()

  const userId = session.user.id

  const notify = (message: string, type: TypeOptions, transition = Slide) => {
    toast(message, {
      position: "top-right",
      type: type,
      transition: transition,
      theme: "colored"
    })
  }

  const handleSubmit = async (todo: Todo) => {
    if (selectedTodo === null) {
      // Création d'un newTodo avec l'id de l'utilisateur connecté
      const newTodo = { ...todo, user_id: userId}
      addTodo(newTodo)
      await createSupaTodo(newTodo).then((response) => {
        notify(response, "success")
      })
        .catch(error => {
        notify(error.message, "error")
      })
    } else {
      // handleEdit(todo)
      const EditedTodo = { ...todo, user_id: userId}
      if (updateTodo(EditedTodo)) {
        await updateSupaTodo(EditedTodo).then((response) => {
        notify(response, "success")
      })
        .catch(error => {
        notify(error.message, "error")
      })
      }
      
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

  const handleFilterTodo = (searchTodo: string) => {
    setSearchText(searchTodo)
  }
  
  const filteredTodos = todos.filter((todo) => 
    todo.name.toLowerCase().includes(searchText.toLowerCase()) || 
    todo.content.toLowerCase().includes(searchText.toLowerCase())  
  )

  const handleShowModal = (todo: Todo) => {
    setSelectedTodo(todo)
    setShowModal(true)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error.message)
    } else {
      router.push('/login')
    }
  }
  
  
  return (
    <>
      <main className='mainContainer'>
        <button type='button' onClick={handleLogout}>Déconnexion</button>
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

export const getServerSideProps = async (ctx : GetServerSidePropsContext) => {
  const supabaseSession = createPagesServerClient(ctx)
  const { data: { session } } = await supabaseSession.auth.getSession()
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { data } = await supabaseSession
    .from('todos')
    .select('*')
    .eq('user_id', session.user.id)

    
  return { props: { data, session } };
}