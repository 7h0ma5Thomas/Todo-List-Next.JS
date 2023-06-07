import { v4 as uuidv4 } from "uuid";
import React, { FormEvent } from "react";
import { Todo } from "@/Lib/todos";
import { TypeOptions } from "react-toastify";

type EditTodoProps = {
  onSubmit: (todo: Todo) => void
  todo: Todo | null
  onClose: () => void
  notify: (message: string, type: TypeOptions, transition?: any) => void
}

export default function EditTodo({ onSubmit, todo, onClose, notify } : EditTodoProps) {
  const titleButton = todo === null ? "Ajouter" : "Modifier"
  const handleSubmit = (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const content = e.target.content.value
    if (name === '') {
      notify("Vous devez nommer votre tâche afin de la créer", "error")
      return
    }
    if (todo === null) {
      const newTodo = {
        id: uuidv4(),
        name,
        content,
        completed: false
      }
      onSubmit(newTodo)
    } else {
      const updatedTodo = {
        ...todo,
        name,
        content
      }
      onSubmit(updatedTodo)
    }
    onClose()
  }

  return (
    <div className='modalContainer'>
      <form className='modalForm' onSubmit={handleSubmit}>
        <h2 className='modalTitle'>{titleButton} une tâche</h2>
        <div className='modalContent'>
          <label htmlFor="name" className='modalLabel'>Nom :</label>
          <input name="name" type="text" className="modalInput" defaultValue={todo?.name ?? ''} />
        </div>
        <div className='modalContent'>
          <label htmlFor="content" className='modalLabel'>Description :</label>
          <input name="content" type="text" className="modalInput" defaultValue={todo?.content ?? ''} />
        </div>
        <div className='modalButtonsBox'>
          <input type="submit" value={titleButton} className='greenButton'/>
          <input type="button" value="Annuler" className='redButton' onClick={onClose}/>
        </div>
      </form>
    </div>
   
  )
}
