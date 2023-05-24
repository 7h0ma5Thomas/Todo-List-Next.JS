import { v4 as uuidv4 } from "uuid";
//test
export default function EditTodo({ onSubmit, todo, onClose }) {
  const titleButton = todo === null ? "Créer" : "Modifier"
  const handleSubmit = (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const content = e.target.content.value
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
    <div className="absolute left-0 top-0 bg-black h-screen w-screen flex flex-col justify-center items-center">
      <form className="p-2 border-2 shadow-2xl border-slate-600 m-1 rounded-xl flex flex-col gap-2 w-[600px]" onSubmit={handleSubmit}>
        <h2 className="text-2xl text-center">{titleButton} une tâche</h2>
        <div className="flex gap-1">
          <label htmlFor="name" className="w-[30%]">Nom :</label>
          <input name="name" type="text" className="input" defaultValue={todo?.name ?? ''} />
        </div>
        <div className="flex gap-1">
          <label htmlFor="content" className="w-[30%]">Description :</label>
          <input name="content" type="text" className="input" defaultValue={todo?.content ?? ''} />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <input type="submit" value={titleButton} className="bg-green-400 rounded-lg py-1" />
          <input type="button" value="Annuler" className="bg-red-400 rounded-lg py-1" onClick={onClose}/>
        </div>
      </form>
    </div>
   
  )
}
