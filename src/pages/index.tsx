import { useState } from 'react'
import TodoRow from '@/components/TodoRow'
import EditTodo from '@/components/EditTodo'
import Search from '@/components/Search'
import { GetServerSidePropsContext  } from "next";
import { createSupaTodo, deleteSupaTodo, checkSupaTodo, updateSupaTodo } from '../Lib/supabase'
import { useTodos, Todo } from '@/Lib/todos'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPagesServerClient, createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
import { notify } from '@/Lib/notify';

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
  const supabaseClient = createPagesBrowserClient()

  const userId = session.user.id

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
      const EditedTodo = { ...todo}
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
    const { error } = await supabaseClient.auth.signOut()
    if (error) {
      console.log(error.message)
    } else {
      router.push('/auth')
    }
  }

  console.log(session.user)
  
  
  return (
    <>
      <main className='mainContainer'>
        <button className='signOutButton' type='button' onClick={handleLogout}>Se déconnecter</button>
        <h1 className='mainTitle'>Ma Todo Liste !</h1>
        <Search 
          onChange={(searchTodo) => handleFilterTodo(searchTodo)} 
        />
        <div className='todosContainer'>
          <button className='button' onClick={() => setShowModal(true)}>Ajouter une todo</button>
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
  const supabaseClient = createPagesServerClient(ctx)
  const { data: { session } } = await supabaseClient.auth.getSession()
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }

  const { data } = await supabaseClient
    .from('todos')
    .select('*')
    .eq('user_id', session.user.id)

    
  return { props: { data, session } };
}